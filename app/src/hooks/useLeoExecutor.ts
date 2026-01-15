/**
 * Custom hook for executing Leo code
 */

import { useState, useCallback } from 'react';
import type { ExecutionResult, ExecutionStatus, LeoExecutionOptions } from '../types';
import { executeLeoCode } from '../services';

interface UseLeoExecutorReturn {
  /** Current execution result */
  result: ExecutionResult | null;
  /** Current execution status */
  status: ExecutionStatus;
  /** Whether execution is in progress */
  isExecuting: boolean;
  /** Execute Leo code */
  execute: (source: string, options?: LeoExecutionOptions) => Promise<ExecutionResult>;
  /** Reset the executor state */
  reset: () => void;
}

export function useLeoExecutor(): UseLeoExecutorReturn {
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [status, setStatus] = useState<ExecutionStatus>('idle');

  const execute = useCallback(async (
    source: string,
    options?: LeoExecutionOptions
  ): Promise<ExecutionResult> => {
    setStatus('compiling');
    
    try {
      const executionResult = await executeLeoCode(source, options);
      setResult(executionResult);
      setStatus(executionResult.status);
      return executionResult;
    } catch (error) {
      const errorResult: ExecutionResult = {
        status: 'error',
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        errorType: 'runtime',
      };
      setResult(errorResult);
      setStatus('error');
      return errorResult;
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setStatus('idle');
  }, []);

  return {
    result,
    status,
    isExecuting: status === 'compiling' || status === 'running',
    execute,
    reset,
  };
}
