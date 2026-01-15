/**
 * Output Panel Component
 * 
 * Displays execution results, errors, and loading states.
 */

import React from 'react';
import type { ExecutionResult } from '../../types';

interface OutputPanelProps {
  /** Execution result (if successful) */
  result?: ExecutionResult | null;
  /** Error message (if failed) */
  error?: string | null;
  /** Whether execution is in progress */
  isLoading?: boolean;
  /** Additional class name */
  className?: string;
}

export const OutputPanel: React.FC<OutputPanelProps> = ({
  result,
  error,
  isLoading = false,
  className = '',
}) => {
  const status = isLoading ? 'loading' : error ? 'error' : result ? 'success' : 'idle';

  return (
    <div className={`flex flex-col h-full bg-[#0a0a0a] ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800">
        <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
          Output
        </span>
        {status === 'success' && result?.executionTime && (
          <span className="text-xs text-neutral-500">
            {result.executionTime.toFixed(0)}ms
          </span>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 p-4 font-mono text-sm overflow-auto">
        {status === 'idle' && (
          <span className="text-neutral-600">
            Press Cmd+Enter to run
          </span>
        )}

        {status === 'loading' && (
          <div className="flex items-center gap-2 text-neutral-400">
            <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="3" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>Compiling...</span>
          </div>
        )}

        {status === 'success' && result?.output && (
          <pre className="whitespace-pre-wrap text-[#00ffc8]">
            {result.output}
          </pre>
        )}

        {status === 'error' && error && (
          <pre className="whitespace-pre-wrap text-red-400">
            {error}
          </pre>
        )}
      </div>
    </div>
  );
};

export default OutputPanel;
