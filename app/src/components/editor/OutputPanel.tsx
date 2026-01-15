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

const StatusIcon: React.FC<{ status: 'idle' | 'loading' | 'success' | 'error' }> = ({ status }) => {
  switch (status) {
    case 'loading':
      return (
        <svg className="w-4 h-4 animate-spin text-indigo-400" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      );
    case 'success':
      return (
        <svg className="w-4 h-4 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      );
    case 'error':
      return (
        <svg className="w-4 h-4 text-red-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      );
    default:
      return (
        <svg className="w-4 h-4 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
  }
};

export const OutputPanel: React.FC<OutputPanelProps> = ({
  result,
  error,
  isLoading = false,
  className = '',
}) => {
  // Determine current status
  const status = isLoading ? 'loading' : error ? 'error' : result ? 'success' : 'idle';
  
  const getStatusText = () => {
    switch (status) {
      case 'loading':
        return 'Executing...';
      case 'success':
        return result?.executionTime ? `Success • ${result.executionTime.toFixed(0)}ms` : 'Success';
      case 'error':
        return 'Error';
      default:
        return 'Ready';
    }
  };

  return (
    <div className={`bg-slate-800/50 rounded-lg border border-slate-700 ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-slate-700/50">
        <div className="flex items-center gap-2">
          <StatusIcon status={status} />
          <span className="text-sm font-medium text-slate-300">
            Output
          </span>
        </div>
        <span className="text-xs text-slate-500">
          {getStatusText()}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 font-mono text-sm min-h-[100px] max-h-[250px] overflow-auto">
        {status === 'idle' && (
          <span className="text-slate-500 italic">
            Click "Run" or press ⌘+Enter to execute the code
          </span>
        )}

        {status === 'loading' && (
          <div className="flex items-center gap-3 text-slate-400">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span>Compiling and executing Leo program...</span>
          </div>
        )}

        {status === 'success' && result?.output && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-green-400 font-semibold">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Execution Successful</span>
            </div>
            <pre className="whitespace-pre-wrap text-slate-300 pl-4 border-l-2 border-green-500/30 bg-green-500/5 p-3 rounded">
              {result.output}
            </pre>
          </div>
        )}

        {status === 'error' && error && (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-red-400 font-semibold">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span>Execution Failed</span>
            </div>
            <pre className="whitespace-pre-wrap text-red-300 pl-4 border-l-2 border-red-500/30 bg-red-500/5 p-3 rounded">
              {error}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default OutputPanel;
