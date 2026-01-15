/**
 * Editor Panel Component
 * 
 * A complete editor panel that combines:
 * - Code editor with Leo syntax highlighting
 * - Run button with loading state
 * - Output panel for results/errors
 * - Status bar with execution info
 */

import React, { useState, useCallback } from 'react';
import { CodeEditor, type EditorError } from './CodeEditor';
import { OutputPanel } from './OutputPanel';
import { RunButton } from './RunButton';
import { useLeoExecutor } from '../../hooks/useLeoExecutor';

interface EditorPanelProps {
  /** Initial code to display */
  initialCode?: string;
  /** Whether to auto-run on first load */
  autoRun?: boolean;
  /** Callback when code changes */
  onCodeChange?: (code: string) => void;
  /** Callback when execution completes */
  onExecutionComplete?: (success: boolean) => void;
  /** Whether to show the output panel */
  showOutput?: boolean;
  /** Additional class name */
  className?: string;
  /** Editor height */
  editorHeight?: number;
  /** Title to display above the editor */
  title?: string;
  /** Description/instructions to display */
  description?: string;
}

export const EditorPanel: React.FC<EditorPanelProps> = ({
  initialCode = '',
  autoRun = false,
  onCodeChange,
  onExecutionComplete,
  showOutput = true,
  className = '',
  editorHeight = 350,
  title,
  description,
}) => {
  const [code, setCode] = useState(initialCode);
  const [hasRun, setHasRun] = useState(false);
  const { execute, isExecuting, result, error, clearResult } = useLeoExecutor();

  // Convert execution errors to editor errors
  const editorErrors: EditorError[] = React.useMemo(() => {
    if (!error) return [];
    
    // Try to parse line numbers from error message
    const lineMatch = error.match(/line (\d+)/i);
    const columnMatch = error.match(/column (\d+)/i);
    
    return [{
      line: lineMatch ? parseInt(lineMatch[1]) : 1,
      column: columnMatch ? parseInt(columnMatch[1]) : 1,
      message: error,
      severity: 'error' as const,
    }];
  }, [error]);

  // Handle code changes
  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
    onCodeChange?.(newCode);
    // Clear previous results when code changes
    if (hasRun) {
      clearResult();
    }
  }, [onCodeChange, hasRun, clearResult]);

  // Handle running code
  const handleRun = useCallback(async () => {
    setHasRun(true);
    const success = await execute(code);
    onExecutionComplete?.(success);
  }, [code, execute, onExecutionComplete]);

  // Auto-run on mount if enabled
  React.useEffect(() => {
    if (autoRun && !hasRun && code) {
      handleRun();
    }
  }, [autoRun, hasRun, code, handleRun]);

  return (
    <div className={`flex flex-col gap-4 ${className}`}>
      {/* Header */}
      {(title || description) && (
        <div className="space-y-1">
          {title && (
            <h3 className="text-lg font-semibold text-slate-200">{title}</h3>
          )}
          {description && (
            <p className="text-sm text-slate-400">{description}</p>
          )}
        </div>
      )}

      {/* Editor with Run Button */}
      <div className="relative">
        <CodeEditor
          value={code}
          onChange={handleCodeChange}
          onRun={handleRun}
          errors={editorErrors}
          height={editorHeight}
        />
        
        {/* Run Button - Positioned in top-right of editor */}
        <div className="absolute top-3 right-3 z-10">
          <RunButton
            onClick={handleRun}
            isLoading={isExecuting}
            disabled={!code.trim()}
          />
        </div>
      </div>

      {/* Output Panel */}
      {showOutput && (hasRun || result || error) && (
        <OutputPanel
          result={result}
          error={error}
          isLoading={isExecuting}
        />
      )}

      {/* Status Bar */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className={`h-2 w-2 rounded-full ${
              error ? 'bg-red-500' : 
              result ? 'bg-green-500' : 
              'bg-slate-600'
            }`} />
            {error ? 'Error' : result ? 'Success' : 'Ready'}
          </span>
          {code && (
            <span>{code.split('\n').length} lines</span>
          )}
        </div>
        <span>Leo Language</span>
      </div>
    </div>
  );
};

export default EditorPanel;
