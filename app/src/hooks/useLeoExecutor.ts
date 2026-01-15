/**
 * Custom hook for executing Leo code
 */

import { useState, useCallback } from 'react';
import type { ExecutionResult, ExecutionStatus, LeoExecutionOptions } from '../types';
import { executeLeoCode } from '../services';

interface UseLeoExecutorReturn {
  /** Current execution result (null if not executed or failed) */
  result: ExecutionResult | null;
  /** Error message (null if no error) */
  error: string | null;
  /** Current execution status */
  status: ExecutionStatus;
  /** Whether execution is in progress */
  isExecuting: boolean;
  /** Execute Leo code - returns true if successful */
  execute: (source: string, options?: LeoExecutionOptions) => Promise<boolean>;
  /** Reset/clear the executor state */
  reset: () => void;
  /** Clear just the result and error */
  clearResult: () => void;
}

export function useLeoExecutor(): UseLeoExecutorReturn {
  const [result, setResult] = useState<ExecutionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<ExecutionStatus>('idle');

  const execute = useCallback(async (
    source: string,
    options?: LeoExecutionOptions
  ): Promise<boolean> => {
    setStatus('compiling');
    setError(null);
    
    try {
      const executionResult = await executeLeoCode(source, options);
      setResult(executionResult);
      setStatus(executionResult.status);
      
      if (executionResult.status === 'error') {
        setError(executionResult.error || 'Unknown error occurred');
        return false;
      }
      
      return true;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error occurred';
      setError(errorMessage);
      setResult(null);
      setStatus('error');
      return false;
    }
  }, []);

  const reset = useCallback(() => {
    setResult(null);
    setError(null);
    setStatus('idle');
  }, []);

  const clearResult = useCallback(() => {
    setResult(null);
    setError(null);
    // Keep status as 'idle' if we're just clearing
    if (status !== 'compiling' && status !== 'running') {
      setStatus('idle');
    }
  }, [status]);

  return {
    result,
    error,
    status,
    isExecuting: status === 'compiling' || status === 'running',
    execute,
    reset,
    clearResult,
  };
}
