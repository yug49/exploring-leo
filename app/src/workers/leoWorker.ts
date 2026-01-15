/**
 * Leo Execution Web Worker
 * 
 * This worker handles Leo program execution in a separate thread
 * to avoid blocking the main UI thread during WASM operations.
 * 
 * Based on the official SDK template-vanilla/worker.js example.
 */

// Import from browser entry point to avoid CommonJS issues
import {
  Account,
  ProgramManager,
  initThreadPool,
} from "@provablehq/sdk/mainnet.js";

// Initialize the thread pool for WASM execution at top level
console.log('Leo Worker: Starting initialization...');
await initThreadPool();
console.log('Leo Worker: Thread pool initialized successfully');

/**
 * Execute a Leo program locally
 */
async function localProgramExecution(
  program: string,
  aleoFunction: string,
  inputs: string[]
): Promise<string[]> {
  const programManager = new ProgramManager();

  // Create a temporary account for the execution of the program
  const account = new Account();
  programManager.setAccount(account);

  console.log(`Leo Worker: Running ${aleoFunction} with inputs:`, inputs);
  const executionResponse = await programManager.run(
    program,
    aleoFunction,
    inputs,
    false, // Don't prove execution (faster for local playground)
  );
  
  return executionResponse.getOutputs();
}

/**
 * Parse inputs from code comments or provide defaults
 */
function parseInputsFromCode(code: string, functionName: string): string[] {
  // Try to find input hints in comments like: // inputs: 5u32, 3u32
  const inputHintRegex = new RegExp(`//\\s*${functionName}\\s*inputs?:\\s*(.+)`, 'i');
  const match = code.match(inputHintRegex);
  if (match) {
    return match[1].split(',').map(s => s.trim());
  }

  // Try to find a general inputs comment
  const generalInputRegex = /\/\/\s*inputs?:\s*(.+)/i;
  const generalMatch = code.match(generalInputRegex);
  if (generalMatch) {
    return generalMatch[1].split(',').map(s => s.trim());
  }

  // For Aleo Instructions format: parse "input r0 as u32.public;" lines
  const aleoFuncRegex = new RegExp(`function\\s+${functionName}:\\s*([\\s\\S]*?)(?:function\\s|$)`, 'm');
  const aleoMatch = code.match(aleoFuncRegex);
  
  if (aleoMatch) {
    const funcBody = aleoMatch[1];
    const inputRegex = /input\s+\w+\s+as\s+(\w+)\.(public|private)/g;
    const inputs: string[] = [];
    let inputMatch;
    
    while ((inputMatch = inputRegex.exec(funcBody)) !== null) {
      const type = inputMatch[1];
      // Provide sensible defaults based on type
      switch (type) {
        case 'u8': inputs.push('1u8'); break;
        case 'u16': inputs.push('1u16'); break;
        case 'u32': inputs.push('5u32'); break;
        case 'u64': inputs.push('5u64'); break;
        case 'u128': inputs.push('5u128'); break;
        case 'i8': inputs.push('1i8'); break;
        case 'i16': inputs.push('1i16'); break;
        case 'i32': inputs.push('5i32'); break;
        case 'i64': inputs.push('5i64'); break;
        case 'i128': inputs.push('5i128'); break;
        case 'field': inputs.push('1field'); break;
        case 'bool': inputs.push('true'); break;
        case 'address': inputs.push('aleo1qnr4dkkvkgfqph0vzc3y6z2eu975wnpz2925ntjccd5cfqxtyu8s7pyjh9'); break;
        case 'scalar': inputs.push('1scalar'); break;
        case 'group': inputs.push('0group'); break;
        default: inputs.push('0u32');
      }
    }
    
    if (inputs.length > 0) {
      return inputs;
    }
  }

  // Fallback: Extract Leo-style function signature
  const funcRegex = new RegExp(`(?:async\\s+)?transition\\s+${functionName}\\s*\\(([^)]+)\\)`, 's');
  const funcMatch = code.match(funcRegex);
  
  if (funcMatch) {
    const paramsStr = funcMatch[1];
    const params = paramsStr.split(',').map(p => p.trim()).filter(p => p);
    
    return params.map(param => {
      // Parse parameter: "public a: u32" or "a: u32"
      const typeMatch = param.match(/:\s*(\w+)/);
      if (!typeMatch) return '0u32'; // default
      
      const type = typeMatch[1];
      
      // Provide sensible defaults based on type
      switch (type) {
        case 'u8': return '1u8';
        case 'u16': return '1u16';
        case 'u32': return '5u32';
        case 'u64': return '5u64';
        case 'u128': return '5u128';
        case 'i8': return '1i8';
        case 'i16': return '1i16';
        case 'i32': return '5i32';
        case 'i64': return '5i64';
        case 'i128': return '5i128';
        case 'field': return '1field';
        case 'bool': return 'true';
        case 'address': return 'aleo1qnr4dkkvkgfqph0vzc3y6z2eu975wnpz2925ntjccd5cfqxtyu8s7pyjh9';
        case 'scalar': return '1scalar';
        case 'group': return '0group';
        default: return '0u32';
      }
    });
  }

  return [];
}

// Signal that the worker is ready
self.postMessage({ type: 'ready' });

// Handle messages from the main thread
self.onmessage = async function(e: MessageEvent) {
  const { type, payload, id } = e.data;

  if (type === 'execute') {
    const { code, functionName, inputs: providedInputs } = payload;
    const startTime = performance.now();
    
    // Use provided inputs or parse from code
    const inputs = providedInputs && providedInputs.length > 0 
      ? providedInputs 
      : parseInputsFromCode(code, functionName);

    try {
      const outputs = await localProgramExecution(code, functionName, inputs);
      const executionTime = performance.now() - startTime;
      
      console.log('Leo Worker: Execution complete. Outputs:', outputs);
      
      self.postMessage({ 
        type: 'result', 
        id, 
        payload: {
          success: true,
          outputs,
          executionTime,
        }
      });
    } catch (error) {
      const executionTime = performance.now() - startTime;
      console.error('Leo Worker: Execution error:', error);
      
      self.postMessage({ 
        type: 'result', 
        id, 
        payload: {
          success: false,
          error: error instanceof Error ? error.message : String(error),
          executionTime,
        }
      });
    }
  }
};
