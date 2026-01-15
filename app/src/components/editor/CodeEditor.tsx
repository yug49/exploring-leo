import React, { useRef, useEffect } from 'react';
import Editor, { type OnMount, type OnChange } from '@monaco-editor/react';
import type { editor } from 'monaco-editor';

interface CodeEditorProps {
  /** Current code value */
  value: string;
  /** Callback when code changes */
  onChange: (value: string) => void;
  /** Whether the editor is read-only */
  readOnly?: boolean;
  /** Editor height */
  height?: string;
  /** Additional class name */
  className?: string;
}

// Leo language configuration for Monaco
const LEO_LANGUAGE_CONFIG = {
  keywords: [
    'program', 'function', 'transition', 'async', 'inline', 'return',
    'let', 'const', 'if', 'else', 'for', 'in', 'true', 'false',
    'struct', 'record', 'mapping', 'self', 'import', 'as',
    'public', 'private', 'assert', 'assert_eq', 'assert_neq',
  ],
  typeKeywords: [
    'u8', 'u16', 'u32', 'u64', 'u128',
    'i8', 'i16', 'i32', 'i64', 'i128',
    'field', 'group', 'scalar', 'bool', 'address', 'string',
    'Future',
  ],
  operators: [
    '=', '>', '<', '!', '~', '?', ':',
    '==', '<=', '>=', '!=', '&&', '||', '++', '--',
    '+', '-', '*', '/', '&', '|', '^', '%',
    '<<', '>>', '+=', '-=', '*=', '/=', '&=', '|=',
    '^=', '%=', '<<=', '>>=', '=>', '->',
  ],
  symbols: /[=><!~?:&|+\-*\/\^%]+/,
};

export const CodeEditor: React.FC<CodeEditorProps> = ({
  value,
  onChange,
  readOnly = false,
  height = '400px',
  className = '',
}) => {
  const editorRef = useRef<editor.IStandaloneCodeEditor | null>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Register Leo language
    monaco.languages.register({ id: 'leo' });

    // Set tokenizer for Leo (similar to Rust)
    monaco.languages.setMonarchTokensProvider('leo', {
      keywords: LEO_LANGUAGE_CONFIG.keywords,
      typeKeywords: LEO_LANGUAGE_CONFIG.typeKeywords,
      operators: LEO_LANGUAGE_CONFIG.operators,
      symbols: LEO_LANGUAGE_CONFIG.symbols,

      tokenizer: {
        root: [
          // Comments
          [/\/\/.*$/, 'comment'],
          [/\/\*/, 'comment', '@comment'],

          // Strings
          [/"([^"\\]|\\.)*$/, 'string.invalid'],
          [/"/, 'string', '@string'],

          // Numbers with type suffix
          [/\d+[ui](8|16|32|64|128)/, 'number'],
          [/\d+field/, 'number'],
          [/\d+group/, 'number'],
          [/\d+scalar/, 'number'],
          [/\d+/, 'number'],

          // Identifiers and keywords
          [/[a-zA-Z_]\w*/, {
            cases: {
              '@keywords': 'keyword',
              '@typeKeywords': 'type',
              '@default': 'identifier',
            },
          }],

          // Delimiters
          [/[{}()\[\]]/, 'delimiter.bracket'],
          [/[;,.]/, 'delimiter'],

          // Operators
          [/@symbols/, {
            cases: {
              '@operators': 'operator',
              '@default': '',
            },
          }],

          // Program identifier
          [/\w+\.aleo/, 'type.identifier'],
        ],

        comment: [
          [/[^\/*]+/, 'comment'],
          [/\*\//, 'comment', '@pop'],
          [/[\/*]/, 'comment'],
        ],

        string: [
          [/[^\\"]+/, 'string'],
          [/\\./, 'string.escape'],
          [/"/, 'string', '@pop'],
        ],
      },
    });

    // Configure language
    monaco.languages.setLanguageConfiguration('leo', {
      comments: {
        lineComment: '//',
        blockComment: ['/*', '*/'],
      },
      brackets: [
        ['{', '}'],
        ['[', ']'],
        ['(', ')'],
      ],
      autoClosingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
      ],
      surroundingPairs: [
        { open: '{', close: '}' },
        { open: '[', close: ']' },
        { open: '(', close: ')' },
        { open: '"', close: '"' },
      ],
    });

    // Define custom theme
    monaco.editor.defineTheme('leo-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6A9955' },
        { token: 'keyword', foreground: 'C586C0' },
        { token: 'type', foreground: '4EC9B0' },
        { token: 'number', foreground: 'B5CEA8' },
        { token: 'string', foreground: 'CE9178' },
        { token: 'operator', foreground: 'D4D4D4' },
        { token: 'type.identifier', foreground: '4FC1FF' },
      ],
      colors: {
        'editor.background': '#1e293b',
        'editor.foreground': '#f1f5f9',
        'editor.lineHighlightBackground': '#334155',
        'editorLineNumber.foreground': '#64748b',
        'editorLineNumber.activeForeground': '#94a3b8',
        'editor.selectionBackground': '#475569',
        'editorCursor.foreground': '#f1f5f9',
      },
    });

    monaco.editor.setTheme('leo-dark');
  };

  const handleChange: OnChange = (newValue) => {
    if (newValue !== undefined) {
      onChange(newValue);
    }
  };

  // Update editor options when readOnly changes
  useEffect(() => {
    if (editorRef.current) {
      editorRef.current.updateOptions({ readOnly });
    }
  }, [readOnly]);

  return (
    <div className={`rounded-lg overflow-hidden border border-[var(--color-border)] ${className}`}>
      <Editor
        height={height}
        defaultLanguage="leo"
        value={value}
        onChange={handleChange}
        onMount={handleEditorDidMount}
        options={{
          readOnly,
          minimap: { enabled: false },
          fontSize: 14,
          fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
          lineNumbers: 'on',
          scrollBeyondLastLine: false,
          automaticLayout: true,
          tabSize: 4,
          insertSpaces: true,
          wordWrap: 'on',
          padding: { top: 16, bottom: 16 },
          renderLineHighlight: 'line',
          cursorBlinking: 'smooth',
          smoothScrolling: true,
        }}
        loading={
          <div className="h-full flex items-center justify-center bg-[var(--color-surface)]">
            <span className="text-[var(--color-text-muted)]">Loading editor...</span>
          </div>
        }
      />
    </div>
  );
};
