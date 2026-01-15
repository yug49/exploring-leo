/**
 * Enhanced Code Editor Component for Leo Language
 * 
 * Features:
 * - Full Leo syntax highlighting
 * - Auto-completion with snippets
 * - Error markers and decorations
 * - Keyboard shortcuts
 * - Resizable editor panel
 */

import React, { useRef, useEffect, useState, useCallback } from 'react';
import Editor, { type OnMount, type OnChange } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';
import {
  leoMonarchLanguage,
  leoLanguageConfiguration,
  createLeoCompletionProvider,
  leoDarkTheme,
} from './leoLanguage';

export interface EditorError {
  line: number;
  column: number;
  message: string;
  severity: 'error' | 'warning' | 'info';
}

interface CodeEditorProps {
  /** Current code value */
  value: string;
  /** Callback when code changes */
  onChange: (value: string) => void;
  /** Callback when user presses run shortcut */
  onRun?: () => void;
  /** Errors to display in the editor */
  errors?: EditorError[];
  /** Whether the editor is read-only */
  readOnly?: boolean;
  /** Editor height (can be string or number) */
  height?: string | number;
  /** Minimum height when resizing */
  minHeight?: number;
  /** Maximum height when resizing */
  maxHeight?: number;
  /** Show line numbers */
  showLineNumbers?: boolean;
  /** Show minimap */
  showMinimap?: boolean;
  /** Font size */
  fontSize?: number;
  /** Additional class name */
  className?: string;
}

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  onRun,
  errors = [],
  readOnly = false,
  height = 400,
  minHeight = 200,
  maxHeight = 800,
  showLineNumbers = true,
  showMinimap = false,
  fontSize = 14,
  className = '',
}) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);
  const monacoRef = useRef<typeof import('monaco-editor') | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isResizing, setIsResizing] = useState(false);
  const [editorHeight, setEditorHeight] = useState<number>(
    typeof height === 'number' ? height : parseInt(height) || 400
  );
  const [isEditorReady, setIsEditorReady] = useState(false);

  // Handle editor mount
  const handleEditorDidMount: OnMount = useCallback((editor, monaco) => {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Register Leo language if not already registered
    if (!monaco.languages.getLanguages().some((lang: { id: string }) => lang.id === 'leo')) {
      monaco.languages.register({ id: 'leo', extensions: ['.leo'] });
      monaco.languages.setMonarchTokensProvider('leo', leoMonarchLanguage);
      monaco.languages.setLanguageConfiguration('leo', leoLanguageConfiguration);
      monaco.languages.registerCompletionItemProvider('leo', createLeoCompletionProvider(monaco));
    }

    // Register Leo theme
    monaco.editor.defineTheme('leo-dark', leoDarkTheme);
    monaco.editor.setTheme('leo-dark');

    // Add keyboard shortcut for running code (Cmd/Ctrl + Enter)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.Enter, () => {
      if (onRun) {
        onRun();
      }
    });

    // Prevent default save behavior (Cmd/Ctrl + S)
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS, () => {
      // No-op to prevent browser save dialog
    });

    // Focus editor on mount
    editor.focus();
    setIsEditorReady(true);
  }, [onRun]);

  // Handle code changes
  const handleChange: OnChange = useCallback((newValue) => {
    if (newValue !== undefined) {
      onChange(newValue);
    }
  }, [onChange]);

  // Update error decorations when errors change
  useEffect(() => {
    if (!editorRef.current || !monacoRef.current || !isEditorReady) return;

    const monaco = monacoRef.current;
    const editor = editorRef.current;
    const model = editor.getModel();
    
    if (!model) return;

    // Clear existing markers
    monaco.editor.setModelMarkers(model, 'leo', []);

    // Add error markers
    if (errors.length > 0) {
      const markers = errors.map(error => ({
        severity: error.severity === 'error' 
          ? monaco.MarkerSeverity.Error 
          : error.severity === 'warning' 
            ? monaco.MarkerSeverity.Warning 
            : monaco.MarkerSeverity.Info,
        message: error.message,
        startLineNumber: error.line,
        startColumn: error.column,
        endLineNumber: error.line,
        endColumn: model.getLineMaxColumn(error.line),
      }));
      monaco.editor.setModelMarkers(model, 'leo', markers);
    }
  }, [errors, isEditorReady]);

  // Handle resize drag start
  const handleResizeStart = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
  }, []);

  // Handle mouse move during resize
  useEffect(() => {
    if (!isResizing) return;

    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      
      const containerRect = containerRef.current.getBoundingClientRect();
      const newHeight = e.clientY - containerRect.top;
      
      setEditorHeight(Math.max(minHeight, Math.min(maxHeight, newHeight)));
    };

    const handleMouseUp = () => {
      setIsResizing(false);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizing, minHeight, maxHeight]);

  // Trigger editor layout when height changes
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.layout();
    }
  }, [editorHeight]);

  // Update editor options when readOnly changes
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({ readOnly });
    }
  }, [readOnly]);

  return (
    <div 
      ref={containerRef}
      className={`relative flex flex-col ${className}`}
      style={{ height: editorHeight + 8 }} // +8 for resize handle
    >
      {/* Editor Container */}
      <div 
        className="flex-1 overflow-hidden rounded-lg border border-slate-700 bg-slate-800"
        style={{ height: editorHeight }}
      >
        <Editor
          height="100%"
          language="leo"
          value={value}
          onChange={handleChange}
          onMount={handleEditorDidMount}
          theme="leo-dark"
          options={{
            readOnly,
            fontSize,
            fontFamily: "'JetBrains Mono', 'Fira Code', 'SF Mono', Monaco, Consolas, monospace",
            fontLigatures: true,
            lineNumbers: showLineNumbers ? 'on' : 'off',
            minimap: { enabled: showMinimap },
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 4,
            insertSpaces: true,
            wordWrap: 'on',
            wrappingIndent: 'indent',
            lineDecorationsWidth: 10,
            lineNumbersMinChars: 3,
            glyphMargin: true,
            folding: true,
            foldingStrategy: 'indentation',
            renderLineHighlight: 'all',
            renderWhitespace: 'selection',
            cursorBlinking: 'smooth',
            cursorSmoothCaretAnimation: 'on',
            smoothScrolling: true,
            contextmenu: true,
            quickSuggestions: {
              other: true,
              comments: false,
              strings: false,
            },
            suggestOnTriggerCharacters: true,
            acceptSuggestionOnEnter: 'on',
            tabCompletion: 'on',
            snippetSuggestions: 'top',
            formatOnPaste: true,
            formatOnType: true,
            autoIndent: 'full',
            bracketPairColorization: {
              enabled: true,
            },
            guides: {
              bracketPairs: true,
              indentation: true,
            },
            padding: { top: 16, bottom: 16 },
            overviewRulerLanes: 3,
            hideCursorInOverviewRuler: false,
            scrollbar: {
              vertical: 'auto',
              horizontal: 'auto',
              useShadows: false,
              verticalScrollbarSize: 10,
              horizontalScrollbarSize: 10,
            },
          }}
          loading={
            <div className="flex h-full items-center justify-center bg-slate-800">
              <div className="flex items-center gap-3 text-slate-400">
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                <span>Loading editor...</span>
              </div>
            </div>
          }
        />
      </div>

      {/* Resize Handle */}
      <div
        className={`
          h-2 cursor-row-resize rounded-b transition-colors
          bg-slate-700/50 hover:bg-indigo-500/50
          ${isResizing ? 'bg-indigo-500/50' : ''}
        `}
        onMouseDown={handleResizeStart}
      >
        <div className="mx-auto mt-1 h-0.5 w-12 rounded-full bg-slate-500" />
      </div>

      {/* Keyboard Shortcuts Hint */}
      {onRun && (
        <div className="absolute bottom-4 right-3 flex items-center gap-1 text-xs text-slate-500 pointer-events-none">
          <kbd className="rounded bg-slate-700/80 px-1.5 py-0.5 font-mono text-[10px]">⌘</kbd>
          <span>+</span>
          <kbd className="rounded bg-slate-700/80 px-1.5 py-0.5 font-mono text-[10px]">↵</kbd>
          <span className="ml-1">to run</span>
        </div>
      )}
    </div>
  );
};
