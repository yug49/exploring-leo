/**
 * Leo Execution Server
 * 
 * A local server that compiles and executes Leo programs using the Leo CLI.
 * This server is meant to run locally during development and learning.
 */

import express from 'express';
import cors from 'cors';
import { execSync, exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import os from 'os';
import { v4 as uuidv4 } from 'uuid';

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}));
app.use(express.json({ limit: '1mb' }));

// Types
interface ExecuteRequest {
  code: string;
  functionName?: string;
  inputs?: string[];
  timeout?: number;
}

interface ExecuteResponse {
  success: boolean;
  output?: string;
  error?: string;
  errorType?: 'compilation' | 'runtime' | 'timeout' | 'setup';
  executionTime?: number;
}

// Check if Leo CLI is installed
function checkLeoInstalled(): boolean {
  try {
    execSync('leo --version', { encoding: 'utf8', stdio: 'pipe' });
    return true;
  } catch {
    return false;
  }
}

// Create a temporary Leo project
function createTempProject(code: string): { projectPath: string; cleanup: () => void } {
  const tempDir = os.tmpdir();
  const projectName = `leo_temp_${uuidv4().replace(/-/g, '_')}`;
  const projectPath = path.join(tempDir, projectName);

  // Extract program name from code
  const programMatch = code.match(/program\s+(\w+)\.aleo/);
  const programName = programMatch ? programMatch[1] : 'main';

  // Create project directory structure
  fs.mkdirSync(projectPath, { recursive: true });
  fs.mkdirSync(path.join(projectPath, 'src'), { recursive: true });

  // Create program.json
  const programJson = {
    program: `${programName}.aleo`,
    version: '0.0.0',
    description: 'Temporary Leo program for Exploring Leo',
    license: 'MIT',
  };
  fs.writeFileSync(
    path.join(projectPath, 'program.json'),
    JSON.stringify(programJson, null, 2)
  );

  // Create .env file with network setting
  fs.writeFileSync(
    path.join(projectPath, '.env'),
    'NETWORK=testnet\nPRIVATE_KEY=APrivateKey1zkpHtqVWT6fSHgUMNxsuVf7eaR6id2cj7TieKY1Z8CP5rCD\nENDPOINT=https://api.explorer.provable.com/v1\n'
  );

  // Write the Leo source code
  fs.writeFileSync(path.join(projectPath, 'src', 'main.leo'), code);

  const cleanup = () => {
    try {
      fs.rmSync(projectPath, { recursive: true, force: true });
    } catch (e) {
      console.warn('Failed to cleanup temp project:', e);
    }
  };

  return { projectPath, cleanup };
}

// Execute Leo code
async function executeLeoCode(
  code: string,
  functionName: string = 'main',
  inputs: string[] = [],
  timeout: number = 60000
): Promise<ExecuteResponse> {
  const startTime = Date.now();

  // Create temporary project
  let tempProject: { projectPath: string; cleanup: () => void } | null = null;

  try {
    tempProject = createTempProject(code);
    const { projectPath, cleanup } = tempProject;

    // Build the project first
    const buildResult = await runCommand(
      `cd "${projectPath}" && leo build`,
      timeout
    );

    if (!buildResult.success) {
      cleanup();
      return {
        success: false,
        error: formatLeoError(buildResult.error || 'Build failed'),
        errorType: 'compilation',
        executionTime: Date.now() - startTime,
      };
    }

    // Prepare the run command with inputs
    const inputArgs = inputs.length > 0 ? inputs.join(' ') : '';
    const runCmd = `cd "${projectPath}" && leo run ${functionName} ${inputArgs}`.trim();

    // Run the program
    const runResult = await runCommand(runCmd, timeout);

    cleanup();

    if (!runResult.success) {
      return {
        success: false,
        error: formatLeoError(runResult.error || 'Execution failed'),
        errorType: runResult.isTimeout ? 'timeout' : 'runtime',
        executionTime: Date.now() - startTime,
      };
    }

    return {
      success: true,
      output: formatLeoOutput(runResult.output || ''),
      executionTime: Date.now() - startTime,
    };
  } catch (error) {
    if (tempProject) {
      tempProject.cleanup();
    }
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred',
      errorType: 'runtime',
      executionTime: Date.now() - startTime,
    };
  }
}

// Run a command with timeout
function runCommand(
  command: string,
  timeout: number
): Promise<{ success: boolean; output?: string; error?: string; isTimeout?: boolean }> {
  return new Promise((resolve) => {
    const process = exec(command, { timeout, encoding: 'utf8' }, (error, stdout, stderr) => {
      if (error) {
        // Check if it was killed due to timeout
        if (error.killed) {
          resolve({
            success: false,
            error: 'Execution timed out. Your code may have an infinite loop or be taking too long.',
            isTimeout: true,
          });
        } else {
          resolve({
            success: false,
            error: stderr || stdout || error.message,
          });
        }
      } else {
        resolve({
          success: true,
          output: stdout,
        });
      }
    });
  });
}

// Format Leo error messages for better readability
function formatLeoError(error: string): string {
  // Remove ANSI color codes
  const cleanError = error.replace(/\x1b\[[0-9;]*m/g, '');
  
  // Extract relevant error information
  const lines = cleanError.split('\n').filter(line => line.trim());
  
  // Look for error messages
  const errorLines: string[] = [];
  let capturing = false;
  
  for (const line of lines) {
    if (line.includes('Error') || line.includes('error') || capturing) {
      capturing = true;
      errorLines.push(line);
    }
  }
  
  return errorLines.length > 0 ? errorLines.join('\n') : cleanError;
}

// Format Leo output for display
function formatLeoOutput(output: string): string {
  // Remove ANSI color codes
  const cleanOutput = output.replace(/\x1b\[[0-9;]*m/g, '');
  
  // Extract just the output value (e.g., "3field" from "• 3field")
  const lines = cleanOutput.split('\n');
  const outputValues: string[] = [];
  
  for (const line of lines) {
    const trimmed = line.trim();
    // Extract value after bullet point (• value)
    if (trimmed.startsWith('•')) {
      const value = trimmed.substring(1).trim();
      if (value) {
        outputValues.push(value);
      }
    }
  }
  
  // Return just the output values, one per line
  if (outputValues.length > 0) {
    return outputValues.join('\n');
  }
  
  // Fallback: return cleaned output if no bullet points found
  return cleanOutput.trim();
}

// API Routes

// Health check endpoint
app.get('/health', (req, res) => {
  const leoInstalled = checkLeoInstalled();
  res.json({
    status: leoInstalled ? 'healthy' : 'unhealthy',
    leoInstalled,
    message: leoInstalled 
      ? 'Leo CLI is installed and ready' 
      : 'Leo CLI is not installed. Please install it from https://developer.aleo.org/leo/installation',
  });
});

// Execute Leo code endpoint
app.post('/execute', async (req, res) => {
  const { code, functionName, inputs, timeout } = req.body as ExecuteRequest;

  // Validate request
  if (!code || typeof code !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Missing or invalid "code" field',
      errorType: 'setup',
    } as ExecuteResponse);
  }

  // Check if Leo is installed
  if (!checkLeoInstalled()) {
    return res.status(503).json({
      success: false,
      error: 'Leo CLI is not installed on this system. Please install it from https://developer.aleo.org/leo/installation',
      errorType: 'setup',
    } as ExecuteResponse);
  }

  // Execute the code
  const result = await executeLeoCode(
    code,
    functionName || 'main',
    inputs || [],
    timeout || 60000
  );

  res.json(result);
});

// Start server
app.listen(PORT, () => {
  console.log(`\nLeo Execution Server running on http://localhost:${PORT}`);
  
  // Check if Leo is installed
  if (checkLeoInstalled()) {
    console.log('[OK] Leo CLI detected and ready');
  } else {
    console.log('[WARNING] Leo CLI not found!');
    console.log('          Please install it from: https://github.com/ProvableHQ/leo');
  }
  
  console.log('\nEndpoints:');
  console.log(`  GET  /health  - Check server and Leo CLI status`);
  console.log(`  POST /execute - Execute Leo code`);
  console.log('\n');
});

export default app;
