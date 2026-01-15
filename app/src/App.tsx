import { useState, useCallback } from 'react';
import { Header, CodeEditor, OutputPanel, RunButton } from './components';
import { useLeoExecutor } from './hooks';

// Sample Leo code for demonstration
const SAMPLE_LEO_CODE = `// Welcome to Exploring Leo!
// This is a simple Leo program that adds two numbers.

program hello.aleo {
    // A transition is the main entry point of a Leo program.
    // It can take inputs and produce outputs.
    transition main(public a: u32, b: u32) -> u32 {
        let sum: u32 = a + b;
        return sum;
    }
}
`;

function App() {
  const [code, setCode] = useState(SAMPLE_LEO_CODE);
  const { result, status, isExecuting, execute } = useLeoExecutor();

  const handleRunCode = useCallback(async () => {
    await execute(code);
  }, [code, execute]);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl p-6 border border-indigo-500/20">
            <h2 className="text-2xl font-bold text-[var(--color-text)] mb-2">
              Welcome to Exploring Leo! 🦁
            </h2>
            <p className="text-[var(--color-text-muted)] mb-4">
              Learn the Leo programming language through interactive tutorials. 
              Leo is designed for building private applications on the Aleo blockchain 
              using zero-knowledge proofs.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://docs.leo-lang.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-surface)] rounded-lg text-sm text-[var(--color-text)] hover:bg-[var(--color-surface-light)] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Leo Documentation
              </a>
              <a
                href="https://play.leo-lang.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-[var(--color-surface)] rounded-lg text-sm text-[var(--color-text)] hover:bg-[var(--color-surface-light)] transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Leo Playground
              </a>
            </div>
          </div>

          {/* Editor Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Instructions */}
            <div className="space-y-4">
              <div className="bg-[var(--color-surface)] rounded-xl p-6 border border-[var(--color-border)]">
                <h3 className="text-lg font-semibold text-[var(--color-text)] mb-3">
                  Try It Out
                </h3>
                <div className="prose prose-invert prose-sm max-w-none">
                  <p className="text-[var(--color-text-muted)]">
                    This is a simple Leo program that demonstrates the basic structure:
                  </p>
                  <ul className="text-[var(--color-text-muted)] space-y-2 mt-3">
                    <li>
                      <code className="bg-[var(--color-surface-light)] px-1.5 py-0.5 rounded text-indigo-300">program name.aleo</code> — Every Leo program starts with a program declaration
                    </li>
                    <li>
                      <code className="bg-[var(--color-surface-light)] px-1.5 py-0.5 rounded text-indigo-300">transition</code> — The main entry point that can create zero-knowledge proofs
                    </li>
                    <li>
                      <code className="bg-[var(--color-surface-light)] px-1.5 py-0.5 rounded text-indigo-300">public</code> — Marks a parameter as publicly visible
                    </li>
                    <li>
                      <code className="bg-[var(--color-surface-light)] px-1.5 py-0.5 rounded text-indigo-300">u32</code> — An unsigned 32-bit integer type
                    </li>
                  </ul>
                  <p className="text-[var(--color-text-muted)] mt-4">
                    Click <strong>Run</strong> to compile and validate the program!
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Code Editor */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-[var(--color-text-muted)]">
                  Code Editor
                </span>
                <RunButton 
                  onClick={handleRunCode} 
                  isLoading={isExecuting}
                />
              </div>
              <CodeEditor
                value={code}
                onChange={setCode}
                height="300px"
              />
              <OutputPanel
                result={result}
                status={status}
              />
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-[var(--color-surface)] rounded-xl p-5 border border-[var(--color-border)]">
              <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h4 className="font-semibold text-[var(--color-text)] mb-1">Interactive Learning</h4>
              <p className="text-sm text-[var(--color-text-muted)]">
                Learn by doing with hands-on code examples you can modify and run.
              </p>
            </div>

            <div className="bg-[var(--color-surface)] rounded-xl p-5 border border-[var(--color-border)]">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="font-semibold text-[var(--color-text)] mb-1">Privacy-First</h4>
              <p className="text-sm text-[var(--color-text-muted)]">
                Learn to build applications with built-in privacy using zero-knowledge proofs.
              </p>
            </div>

            <div className="bg-[var(--color-surface)] rounded-xl p-5 border border-[var(--color-border)]">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-semibold text-[var(--color-text)] mb-1">Browser-Based</h4>
              <p className="text-sm text-[var(--color-text-muted)]">
                No installation needed. Everything runs directly in your browser.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-[var(--color-border)] py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-[var(--color-text-muted)]">
          <span>Built for learning Leo</span>
          <span>Powered by the <a href="https://provable.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">Provable SDK</a></span>
        </div>
      </footer>
    </div>
  );
}

export default App;
