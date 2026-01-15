import React from 'react';
import type { ExecutionResult, ExecutionStatus } from '../../types';

interface OutputPanelProps {
  /** Current execution result */
  result: ExecutionResult | null;
  /** Current status */
  status: ExecutionStatus;
  /** Additional class name */
  className?: string;
}

const StatusIcon: React.FC<{ status: ExecutionStatus }> = ({ status }) => {
  switch (status) {
    case 'compiling':
    case 'running':
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
        <svg className="w-4 h-4 text-[var(--color-text-muted)]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      );
  }
};

const getStatusText = (status: ExecutionStatus): string => {
  switch (status) {
    case 'idle':
      return 'Ready';
    case 'compiling':
      return 'Compiling...';
    case 'running':
      return 'Running...';
    case 'success':
      return 'Success';
    case 'error':
      return 'Error';
  }
};

export const OutputPanel: React.FC<OutputPanelProps> = ({
  result,
  status,
  className = '',
}) => {
  return (
    <div className={`bg-[var(--color-surface)] rounded-lg border border-[var(--color-border)] ${className}`}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-[var(--color-border)]">
        <div className="flex items-center gap-2">
          <StatusIcon status={status} />
          <span className="text-sm font-medium text-[var(--color-text-muted)]">
            Output
          </span>
        </div>
        <span className="text-xs text-[var(--color-text-muted)]">
          {getStatusText(status)}
          {result?.executionTime && ` • ${result.executionTime.toFixed(0)}ms`}
        </span>
      </div>

      {/* Content */}
      <div className="p-4 font-mono text-sm min-h-[120px] max-h-[300px] overflow-auto">
        {status === 'idle' && !result && (
          <span className="text-[var(--color-text-muted)] italic">
            Click "Run" to execute the code
          </span>
        )}

        {(status === 'compiling' || status === 'running') && (
          <div className="flex items-center gap-2 text-[var(--color-text-muted)]">
            <span>{status === 'compiling' ? 'Compiling program...' : 'Executing...'}</span>
          </div>
        )}

        {result?.status === 'success' && result.output && (
          <pre className="whitespace-pre-wrap text-green-400">
            {result.output}
          </pre>
        )}

        {result?.status === 'error' && result.error && (
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-red-400 font-semibold">
                {result.errorType === 'compilation' ? '✗ Compilation Error' :
                 result.errorType === 'timeout' ? '✗ Timeout' :
                 '✗ Runtime Error'}
              </span>
            </div>
            <pre className="whitespace-pre-wrap text-red-300 pl-4 border-l-2 border-red-500/30">
              {result.error}
            </pre>
          </div>
        )}
      </div>
    </div>
  );
};
