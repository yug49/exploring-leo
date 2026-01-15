/**
 * LeoExecutor Service
 * 
 * Executes Leo programs by communicating with the local Leo execution server.
 * The server runs the Leo CLI to compile and execute programs.
 */

import type { ExecutionResult, LeoExecutionOptions } from '../types';

// Server configuration
const SERVER_URL = import.meta.env.VITE_LEO_SERVER_URL || 'http://localhost:3001';
const DEFAULT_TIMEOUT = 120000; // 120 seconds

// Server health status
let serverHealthy: boolean | null = null;
let lastHealthCheck: number = 0;
const HEALTH_CHECK_INTERVAL = 30000; // 30 seconds

/**
 * Check if the Leo execution server is running and healthy
 */
export async function checkServerHealth(): Promise<{
  healthy: boolean;
  leoInstalled: boolean;
  message: string;
}> {
  try {
    const response = await fetch(`${SERVER_URL}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    });

    if (!response.ok) {
      return {
        healthy: false,
        leoInstalled: false,
        message: `Server responded with status ${response.status}`,
      };
    }

    const data = await response.json();
    serverHealthy = data.status === 'healthy';
    lastHealthCheck = Date.now();

    return {
      healthy: data.status === 'healthy',
      leoInstalled: data.leoInstalled ?? false,
      message: data.message ?? 'Unknown status',
    };
  } catch (error) {
    serverHealthy = false;
    return {
      healthy: false,
      leoInstalled: false,
      message: `Cannot connect to Leo server at ${SERVER_URL}. Make sure the server is running with 'npm run dev' in the server directory.`,
    };
  }
}

/**
 * Get cached server health or refresh if stale
 */
async function ensureServerHealthy(): Promise<boolean> {
  // Use cached result if recent
  if (serverHealthy !== null && Date.now() - lastHealthCheck < HEALTH_CHECK_INTERVAL) {
    return serverHealthy;
  }

  const health = await checkServerHealth();
  return health.healthy;
}

/**
 * Extract the program name from Leo source code
 */
function extractProgramName(source: string): string | null {
  // Leo format: program name.aleo { }
  const match = source.match(/program\s+(\w+)\.aleo\s*\{/);
  return match ? match[1] : null;
}

/**
 * Extract available transitions from Leo source code
 */
function extractTransitions(source: string): string[] {
  const transitions: string[] = [];
  
  // Leo format: transition name(...) or async transition name(...)
  const regex = /(?:async\s+)?transition\s+(\w+)\s*\(/g;
  let match;
  while ((match = regex.exec(source)) !== null) {
    transitions.push(match[1]);
  }
  
  return transitions;
}

/**
 * Determine error type from error message
 */
function determineErrorType(error: string): 'compilation' | 'runtime' | 'timeout' {
  const lowerError = error.toLowerCase();
  
  if (lowerError.includes('timed out') || lowerError.includes('timeout')) {
    return 'timeout';
  }
  
  if (
    lowerError.includes('parse') ||
    lowerError.includes('syntax') ||
    lowerError.includes('unexpected') ||
    lowerError.includes('expected') ||
    lowerError.includes('type') ||
    lowerError.includes('build failed') ||
    lowerError.includes('compilation')
  ) {
    return 'compilation';
  }
  
  return 'runtime';
}

/**
 * Execute Leo code using the local server
 */
export async function executeLeoCode(
  source: string,
  options: LeoExecutionOptions = {}
): Promise<ExecutionResult> {
  const { timeout = DEFAULT_TIMEOUT, inputs = [], functionName } = options;
  const startTime = performance.now();

  try {
    // Validate source code
    if (!source || source.trim() === '') {
      return {
        status: 'error',
        error: 'No Leo code provided',
        errorType: 'compilation',
      };
    }

    // Extract program name for validation
    const programName = extractProgramName(source);
    if (!programName) {
      return {
        status: 'error',
        error: 'Could not find a valid program declaration. Leo programs must start with "program name.aleo { }"',
        errorType: 'compilation',
      };
    }

    // Extract available transitions
    const transitions = extractTransitions(source);
    if (transitions.length === 0) {
      return {
        status: 'error',
        error: 'No transitions found in the program. Add at least one transition function.',
        errorType: 'compilation',
      };
    }

    // Determine which function to execute
    const functionToRun = functionName || transitions[0];
    if (!transitions.includes(functionToRun)) {
      return {
        status: 'error',
        error: `Transition "${functionToRun}" not found. Available transitions: ${transitions.join(', ')}`,
        errorType: 'compilation',
      };
    }

    // Check server health (use cached if recent)
    const isHealthy = await ensureServerHealthy();
    if (!isHealthy) {
      return {
        status: 'error',
        error: `Leo execution server is not available. Make sure the server is running:\n\n  cd server && npm install && npm run dev\n\nThen try again.`,
        errorType: 'runtime',
      };
    }

    // Create abort controller for timeout
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      // Send execution request to server
      const response = await fetch(`${SERVER_URL}/execute`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          code: source,
          functionName: functionToRun,
          inputs,
          timeout,
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Server error' }));
        return {
          status: 'error',
          error: errorData.error || `Server responded with status ${response.status}`,
          errorType: errorData.errorType || 'runtime',
          executionTime: performance.now() - startTime,
        };
      }

      const result = await response.json();

      if (result.success) {
        return {
          status: 'success',
          output: result.output || '✓ Program executed successfully',
          executionTime: result.executionTime || (performance.now() - startTime),
        };
      } else {
        return {
          status: 'error',
          error: result.error || 'Execution failed',
          errorType: result.errorType || determineErrorType(result.error || ''),
          executionTime: result.executionTime || (performance.now() - startTime),
        };
      }
    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError instanceof Error && fetchError.name === 'AbortError') {
        return {
          status: 'error',
          error: `Execution timed out after ${timeout / 1000} seconds. The program may be too complex or have an infinite loop.`,
          errorType: 'timeout',
          executionTime: timeout,
        };
      }
      
      throw fetchError;
    }
  } catch (error) {
    const executionTime = performance.now() - startTime;
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';

    // Check if it's a network error
    if (errorMessage.includes('fetch') || errorMessage.includes('network') || errorMessage.includes('Failed to fetch')) {
      return {
        status: 'error',
        error: `Cannot connect to Leo server. Make sure the server is running:\n\n  cd server && npm install && npm run dev`,
        errorType: 'runtime',
        executionTime,
      };
    }

    return {
      status: 'error',
      error: errorMessage,
      errorType: determineErrorType(errorMessage),
      executionTime,
    };
  }
}

/**
 * Validate Leo code syntax without executing
 */
export async function validateLeoSyntax(source: string): Promise<{
  valid: boolean;
  errors: Array<{ message: string; line?: number; column?: number }>;
}> {
  try {
    if (!source || source.trim() === '') {
      return {
        valid: false,
        errors: [{ message: 'No code provided' }],
      };
    }

    const programName = extractProgramName(source);
    if (!programName) {
      return {
        valid: false,
        errors: [{ 
          message: 'Missing program declaration. Start with "program name.aleo { }"',
          line: 1,
        }],
      };
    }

    const transitions = extractTransitions(source);
    if (transitions.length === 0) {
      return {
        valid: false,
        errors: [{ 
          message: 'No transitions found. Add at least one transition function.',
        }],
      };
    }

    return {
      valid: true,
      errors: [],
    };

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return {
      valid: false,
      errors: [{ message: errorMessage }],
    };
  }
}

/**
 * Get information about available transitions in Leo code
 */
export function getTransitionInfo(source: string): {
  programName: string | null;
  transitions: string[];
} {
  return {
    programName: extractProgramName(source),
    transitions: extractTransitions(source),
  };
}
