/**
 * Leo Language Configuration for Monaco Editor
 * 
 * Comprehensive syntax highlighting, auto-completion, and language features
 * for the Leo programming language.
 */

import type { languages, editor } from 'monaco-editor';

// Leo Keywords
export const LEO_KEYWORDS = [
  // Control flow
  'if', 'else', 'for', 'in', 'return',
  // Declarations
  'let', 'const', 'program', 'import', 'as',
  // Function types
  'function', 'transition', 'inline', 'async',
  // Data structures
  'struct', 'record', 'mapping',
  // Visibility
  'public', 'private',
  // Boolean literals
  'true', 'false',
  // Self reference
  'self',
  // Assertions
  'assert', 'assert_eq', 'assert_neq',
];

// Leo Types
export const LEO_TYPES = [
  // Unsigned integers
  'u8', 'u16', 'u32', 'u64', 'u128',
  // Signed integers
  'i8', 'i16', 'i32', 'i64', 'i128',
  // Special types
  'field', 'group', 'scalar', 'bool', 'address', 'string',
  // Async types
  'Future',
];

// Leo Built-in Functions and Constants
export const LEO_BUILTINS = [
  // Self properties
  'self.caller', 'self.signer', 'self.program',
  // Block context
  'block.height',
  // Mapping operations
  'Mapping::get', 'Mapping::get_or_use', 'Mapping::set', 
  'Mapping::contains', 'Mapping::remove',
  // Hash functions
  'BHP256::hash_to_field', 'BHP256::hash_to_group',
  'BHP512::hash_to_field', 'BHP512::hash_to_group',
  'BHP768::hash_to_field', 'BHP768::hash_to_group',
  'BHP1024::hash_to_field', 'BHP1024::hash_to_group',
  'Pedersen64::hash_to_field', 'Pedersen64::hash_to_group',
  'Pedersen128::hash_to_field', 'Pedersen128::hash_to_group',
  'Poseidon2::hash_to_field', 'Poseidon2::hash_to_group',
  'Poseidon4::hash_to_field', 'Poseidon4::hash_to_group',
  'Poseidon8::hash_to_field', 'Poseidon8::hash_to_group',
  'Keccak256::hash_to_field', 'Keccak256::hash_to_group',
  'Keccak384::hash_to_field', 'Keccak384::hash_to_group',
  'Keccak512::hash_to_field', 'Keccak512::hash_to_group',
  'SHA3_256::hash_to_field', 'SHA3_256::hash_to_group',
  'SHA3_384::hash_to_field', 'SHA3_384::hash_to_group',
  'SHA3_512::hash_to_field', 'SHA3_512::hash_to_group',
  // Commit functions
  'BHP256::commit_to_field', 'BHP256::commit_to_group',
  'BHP512::commit_to_field', 'BHP512::commit_to_group',
  'BHP768::commit_to_field', 'BHP768::commit_to_group',
  'BHP1024::commit_to_field', 'BHP1024::commit_to_group',
  'Pedersen64::commit_to_field', 'Pedersen64::commit_to_group',
  'Pedersen128::commit_to_field', 'Pedersen128::commit_to_group',
  // Random
  'ChaCha::rand_field', 'ChaCha::rand_bool',
  'ChaCha::rand_u8', 'ChaCha::rand_u16', 'ChaCha::rand_u32',
  'ChaCha::rand_u64', 'ChaCha::rand_u128',
  'ChaCha::rand_i8', 'ChaCha::rand_i16', 'ChaCha::rand_i32',
  'ChaCha::rand_i64', 'ChaCha::rand_i128',
  'ChaCha::rand_address', 'ChaCha::rand_group', 'ChaCha::rand_scalar',
  // Signature
  'signature::verify',
];

// Monarch tokenizer for Leo syntax highlighting
export const leoMonarchLanguage: languages.IMonarchLanguage = {
  defaultToken: '',
  tokenPostfix: '.leo',
  
  keywords: LEO_KEYWORDS,
  typeKeywords: LEO_TYPES,
  
  operators: [
    '=', '>', '<', '!', '~', '?', ':',
    '==', '<=', '>=', '!=', '&&', '||',
    '+', '-', '*', '/', '&', '|', '^', '%',
    '<<', '>>', '+=', '-=', '*=', '/=', '&=', '|=',
    '^=', '%=', '<<=', '>>=', '=>', '->',
    '**', // Power operator
  ],

  symbols: /[=><!~?:&|+\-*\/\^%]+/,
  escapes: /\\(?:[abfnrtv\\"']|x[0-9A-Fa-f]{1,4}|u[0-9A-Fa-f]{4}|U[0-9A-Fa-f]{8})/,
  
  tokenizer: {
    root: [
      // Whitespace
      [/[ \t\r\n]+/, ''],
      
      // Comments
      [/\/\/.*$/, 'comment'],
      [/\/\*/, 'comment', '@comment'],
      
      // Program identifier (e.g., program.aleo)
      [/[a-zA-Z_]\w*\.aleo/, 'type.identifier'],
      
      // Annotations
      [/@[a-zA-Z_]\w*/, 'annotation'],
      
      // Numbers with type suffixes
      [/\d+[ui](8|16|32|64|128)\b/, 'number.typed'],
      [/\d+field\b/, 'number.field'],
      [/\d+group\b/, 'number.group'],
      [/\d+scalar\b/, 'number.scalar'],
      [/0x[0-9a-fA-F]+/, 'number.hex'],
      [/\d+/, 'number'],
      
      // Strings
      [/"([^"\\]|\\.)*$/, 'string.invalid'],
      [/"/, 'string', '@string'],
      
      // Identifiers and keywords
      [/[a-zA-Z_]\w*/, {
        cases: {
          '@keywords': 'keyword',
          '@typeKeywords': 'type',
          'owner': 'variable.predefined',
          '@default': 'identifier',
        },
      }],
      
      // Delimiters and operators
      [/[{}()\[\]]/, '@brackets'],
      [/[;,.]/, 'delimiter'],
      [/@symbols/, {
        cases: {
          '@operators': 'operator',
          '@default': '',
        },
      }],
    ],
    
    comment: [
      [/[^\/*]+/, 'comment'],
      [/\*\//, 'comment', '@pop'],
      [/[\/*]/, 'comment'],
    ],
    
    string: [
      [/[^\\"]+/, 'string'],
      [/@escapes/, 'string.escape'],
      [/\\./, 'string.escape.invalid'],
      [/"/, 'string', '@pop'],
    ],
  },
};

// Language configuration for brackets, comments, etc.
export const leoLanguageConfiguration: languages.LanguageConfiguration = {
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
    { open: '"', close: '"', notIn: ['string'] },
  ],
  surroundingPairs: [
    { open: '{', close: '}' },
    { open: '[', close: ']' },
    { open: '(', close: ')' },
    { open: '"', close: '"' },
  ],
  folding: {
    markers: {
      start: /^\s*\/\/\s*#?region\b/,
      end: /^\s*\/\/\s*#?endregion\b/,
    },
  },
  indentationRules: {
    increaseIndentPattern: /^.*\{[^}"']*$/,
    decreaseIndentPattern: /^(.*\*\/)?\s*\}.*$/,
  },
  onEnterRules: [
    {
      beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
      afterText: /^\s*\*\/$/,
      action: { indentAction: 2, appendText: ' * ' }, // IndentAction.IndentOutdent = 2
    },
    {
      beforeText: /^\s*\/\*\*(?!\/)([^\*]|\*(?!\/))*$/,
      action: { indentAction: 0, appendText: ' * ' }, // IndentAction.None = 0
    },
    {
      beforeText: /^(\t|[ ])*[ ]\*([ ]([^\*]|\*(?!\/))*)?$/,
      action: { indentAction: 0, appendText: '* ' },
    },
  ],
};

// Auto-completion suggestions
export function createLeoCompletionProvider(monaco: typeof import('monaco-editor')): languages.CompletionItemProvider {
  return {
    provideCompletionItems: (model, position) => {
      const word = model.getWordUntilPosition(position);
      const range = {
        startLineNumber: position.lineNumber,
        endLineNumber: position.lineNumber,
        startColumn: word.startColumn,
        endColumn: word.endColumn,
      };

      const suggestions: languages.CompletionItem[] = [];

      // Add keyword completions
      LEO_KEYWORDS.forEach(keyword => {
        suggestions.push({
          label: keyword,
          kind: monaco.languages.CompletionItemKind.Keyword,
          insertText: keyword,
          range,
          detail: 'keyword',
        });
      });

      // Add type completions
      LEO_TYPES.forEach(type => {
        suggestions.push({
          label: type,
          kind: monaco.languages.CompletionItemKind.TypeParameter,
          insertText: type,
          range,
          detail: 'type',
        });
      });

      // Add snippet completions
      const snippets: Array<{ label: string; insertText: string; detail: string; documentation?: string }> = [
        {
          label: 'program',
          insertText: 'program ${1:name}.aleo {\n\t$0\n}',
          detail: 'Program declaration',
          documentation: 'Create a new Leo program',
        },
        {
          label: 'transition',
          insertText: 'transition ${1:name}(${2:params}) -> ${3:ReturnType} {\n\t$0\n}',
          detail: 'Transition function',
          documentation: 'Create a transition (entry point)',
        },
        {
          label: 'function',
          insertText: 'function ${1:name}(${2:params}) -> ${3:ReturnType} {\n\t$0\n}',
          detail: 'Helper function',
          documentation: 'Create a helper function',
        },
        {
          label: 'async transition',
          insertText: 'async transition ${1:name}(${2:params}) -> Future {\n\treturn ${3:finalize_name}($4);\n}',
          detail: 'Async transition',
          documentation: 'Create an async transition that calls a finalize function',
        },
        {
          label: 'async function',
          insertText: 'async function ${1:name}(${2:params}) {\n\t$0\n}',
          detail: 'Async function (finalize)',
          documentation: 'Create an async function for on-chain logic',
        },
        {
          label: 'struct',
          insertText: 'struct ${1:Name} {\n\t${2:field}: ${3:Type},\n}',
          detail: 'Struct definition',
          documentation: 'Create a custom struct type',
        },
        {
          label: 'record',
          insertText: 'record ${1:Name} {\n\towner: address,\n\t${2:field}: ${3:Type},\n}',
          detail: 'Record definition',
          documentation: 'Create a record (private state)',
        },
        {
          label: 'mapping',
          insertText: 'mapping ${1:name}: ${2:KeyType} => ${3:ValueType};',
          detail: 'Mapping declaration',
          documentation: 'Create an on-chain key-value mapping',
        },
        {
          label: 'if',
          insertText: 'if ${1:condition} {\n\t$0\n}',
          detail: 'If statement',
          documentation: 'Conditional branching',
        },
        {
          label: 'if-else',
          insertText: 'if ${1:condition} {\n\t$2\n} else {\n\t$0\n}',
          detail: 'If-else statement',
          documentation: 'Conditional branching with else',
        },
        {
          label: 'for',
          insertText: 'for ${1:i}: ${2:u32} in ${3:0u32}..${4:10u32} {\n\t$0\n}',
          detail: 'For loop',
          documentation: 'Bounded loop iteration',
        },
        {
          label: 'let',
          insertText: 'let ${1:name}: ${2:Type} = ${3:value};',
          detail: 'Variable declaration',
          documentation: 'Declare a variable with explicit type',
        },
        {
          label: 'const',
          insertText: 'const ${1:NAME}: ${2:Type} = ${3:value};',
          detail: 'Constant declaration',
          documentation: 'Declare a compile-time constant',
        },
        {
          label: 'assert',
          insertText: 'assert(${1:condition});',
          detail: 'Assert statement',
          documentation: 'Runtime assertion check',
        },
        {
          label: 'assert_eq',
          insertText: 'assert_eq(${1:left}, ${2:right});',
          detail: 'Assert equality',
          documentation: 'Assert two values are equal',
        },
        {
          label: 'Mapping::get',
          insertText: 'Mapping::get(${1:mapping_name}, ${2:key})',
          detail: 'Get mapping value',
          documentation: 'Retrieve a value from a mapping (fails if not found)',
        },
        {
          label: 'Mapping::get_or_use',
          insertText: 'Mapping::get_or_use(${1:mapping_name}, ${2:key}, ${3:default})',
          detail: 'Get mapping value or default',
          documentation: 'Retrieve a value from a mapping with default',
        },
        {
          label: 'Mapping::set',
          insertText: 'Mapping::set(${1:mapping_name}, ${2:key}, ${3:value});',
          detail: 'Set mapping value',
          documentation: 'Store a value in a mapping',
        },
        {
          label: 'Mapping::contains',
          insertText: 'Mapping::contains(${1:mapping_name}, ${2:key})',
          detail: 'Check mapping contains key',
          documentation: 'Check if a key exists in a mapping',
        },
        {
          label: 'Mapping::remove',
          insertText: 'Mapping::remove(${1:mapping_name}, ${2:key});',
          detail: 'Remove from mapping',
          documentation: 'Remove a key-value pair from a mapping',
        },
        {
          label: 'BHP256::hash',
          insertText: 'BHP256::hash_to_${1|field,group|}(${2:value})',
          detail: 'BHP256 hash',
          documentation: 'Hash using BHP256 algorithm',
        },
        {
          label: 'Poseidon2::hash',
          insertText: 'Poseidon2::hash_to_${1|field,group|}(${2:value})',
          detail: 'Poseidon2 hash',
          documentation: 'Hash using Poseidon2 algorithm',
        },
      ];

      snippets.forEach(snippet => {
        suggestions.push({
          label: snippet.label,
          kind: monaco.languages.CompletionItemKind.Snippet,
          insertText: snippet.insertText,
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          range,
          detail: snippet.detail,
          documentation: snippet.documentation,
        });
      });

      return { suggestions };
    },
  };
}

// Leo dark theme configuration - minimal black theme
export const leoDarkTheme: editor.IStandaloneThemeData = {
  base: 'vs-dark',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '525252', fontStyle: 'italic' },
    { token: 'keyword', foreground: '00ffc8', fontStyle: 'bold' },
    { token: 'type', foreground: '00ffc8' },
    { token: 'type.identifier', foreground: '00ffc8', fontStyle: 'bold' },
    { token: 'number', foreground: 'a78bfa' },
    { token: 'number.typed', foreground: 'a78bfa' },
    { token: 'number.field', foreground: 'a78bfa' },
    { token: 'number.group', foreground: 'a78bfa' },
    { token: 'number.scalar', foreground: 'a78bfa' },
    { token: 'number.hex', foreground: 'a78bfa' },
    { token: 'string', foreground: 'fbbf24' },
    { token: 'string.escape', foreground: 'fbbf24' },
    { token: 'string.invalid', foreground: 'ff4444' },
    { token: 'operator', foreground: '737373' },
    { token: 'delimiter', foreground: '737373' },
    { token: 'identifier', foreground: 'e5e5e5' },
    { token: 'variable.predefined', foreground: '00ffc8' },
    { token: 'annotation', foreground: 'fbbf24' },
  ],
  colors: {
    'editor.background': '#0a0a0a',
    'editor.foreground': '#e5e5e5',
    'editor.lineHighlightBackground': '#171717',
    'editor.lineHighlightBorder': '#00000000',
    'editorLineNumber.foreground': '#404040',
    'editorLineNumber.activeForeground': '#737373',
    'editor.selectionBackground': '#00ffc830',
    'editor.selectionHighlightBackground': '#00ffc815',
    'editorCursor.foreground': '#00ffc8',
    'editorIndentGuide.background': '#262626',
    'editorIndentGuide.activeBackground': '#404040',
    'editorBracketMatch.background': '#00ffc820',
    'editorBracketMatch.border': '#00ffc8',
    'editorError.foreground': '#ff4444',
    'editorWarning.foreground': '#fbbf24',
    'editorInfo.foreground': '#00ffc8',
    'editorGutter.background': '#0a0a0a',
    'editorWidget.background': '#171717',
    'editorWidget.border': '#262626',
    'editorSuggestWidget.background': '#171717',
    'editorSuggestWidget.border': '#262626',
    'editorSuggestWidget.selectedBackground': '#262626',
    'editorSuggestWidget.highlightForeground': '#00ffc8',
    'scrollbarSlider.background': '#26262680',
    'scrollbarSlider.hoverBackground': '#404040',
    'scrollbarSlider.activeBackground': '#525252',
  },
};

// Leo light theme configuration
export const leoLightTheme: editor.IStandaloneThemeData = {
  base: 'vs',
  inherit: true,
  rules: [
    { token: 'comment', foreground: '008000', fontStyle: 'italic' },
    { token: 'keyword', foreground: 'AF00DB', fontStyle: 'bold' },
    { token: 'type', foreground: '267F99' },
    { token: 'type.identifier', foreground: '0070C1', fontStyle: 'bold' },
    { token: 'number', foreground: '098658' },
    { token: 'number.typed', foreground: '098658' },
    { token: 'number.field', foreground: '795E26' },
    { token: 'number.group', foreground: '795E26' },
    { token: 'number.scalar', foreground: '795E26' },
    { token: 'number.hex', foreground: '098658' },
    { token: 'string', foreground: 'A31515' },
    { token: 'string.escape', foreground: 'EE0000' },
    { token: 'operator', foreground: '000000' },
    { token: 'identifier', foreground: '001080' },
    { token: 'variable.predefined', foreground: '0070C1' },
    { token: 'annotation', foreground: '795E26' },
  ],
  colors: {
    'editor.background': '#ffffff',
    'editor.foreground': '#1e293b',
    'editor.lineHighlightBackground': '#f1f5f9',
    'editorLineNumber.foreground': '#94a3b8',
    'editor.selectionBackground': '#add6ff',
    'editorCursor.foreground': '#1e293b',
  },
};
