/**
 * Types for Leo code execution
 */

export type ExecutionStatus = 'idle' | 'compiling' | 'running' | 'success' | 'error';

export interface ExecutionResult {
  /** Status of the execution */
  status: ExecutionStatus;
  /** Output from successful execution */
  output?: string;
  /** Error message if execution failed */
  error?: string;
  /** Type of error (compilation or runtime) */
  errorType?: 'compilation' | 'runtime' | 'timeout';
  /** Execution time in milliseconds */
  executionTime?: number;
}

export interface CompilationError {
  message: string;
  line?: number;
  column?: number;
}

export interface LeoExecutionOptions {
  /** Timeout in milliseconds (default: 30000) */
  timeout?: number;
  /** Function name to execute */
  functionName?: string;
  /** Arguments to pass to the function */
  args?: string[];
}
