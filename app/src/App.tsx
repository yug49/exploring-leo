import { Header, EditorPanel } from './components';

// Sample Leo code for demonstration
const SAMPLE_LEO_CODE = `// Welcome to Exploring Leo!
// Leo is a functional, statically-typed programming language
// designed for writing private applications using zero-knowledge proofs.

program hello.aleo {
    // A transition is the main entry point for Leo programs
    // It's like a function that can be called from outside the program
    transition main(public a: u32, b: u32) -> u32 {
        // Add two numbers and return the result
        let sum: u32 = a + b;
        return sum;
    }
}
`;

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-900">
      <Header />
      
      <main className="flex-1 p-6">
        <div className="max-w-6xl mx-auto space-y-6">
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 rounded-xl p-6 border border-indigo-500/20">
            <h2 className="text-2xl font-bold text-slate-100 mb-2">
              Welcome to Exploring Leo! 🦁
            </h2>
            <p className="text-slate-400 mb-4">
              Learn the Leo programming language interactively. Write, compile, and run Leo programs
              directly in your browser with instant feedback.
            </p>
            <div className="flex flex-wrap gap-3">
              <a
                href="https://docs.leo-lang.org"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg text-sm text-slate-200 hover:bg-slate-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Leo Documentation
              </a>
              <a
                href="https://github.com/ProvableHQ/leo"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 bg-slate-800 rounded-lg text-sm text-slate-200 hover:bg-slate-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                </svg>
                GitHub
              </a>
            </div>
          </div>

          {/* Editor Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left: Instructions */}
            <div className="space-y-4">
              <div className="bg-slate-800/50 rounded-xl p-6 border border-slate-700">
                <h3 className="text-lg font-semibold text-slate-100 mb-3">
                  Leo Basics
                </h3>
                <div className="prose prose-invert prose-sm max-w-none">
                  <p className="text-slate-400">
                    Leo is designed for building private, decentralized applications:
                  </p>
                  <ul className="text-slate-400 space-y-2 mt-3">
                    <li>
                      <code className="bg-slate-700 px-1.5 py-0.5 rounded text-indigo-300">program name.aleo</code> — Program declaration with .aleo extension
                    </li>
                    <li>
                      <code className="bg-slate-700 px-1.5 py-0.5 rounded text-indigo-300">transition</code> — Entry point functions that can be called externally
                    </li>
                    <li>
                      <code className="bg-slate-700 px-1.5 py-0.5 rounded text-indigo-300">public/private</code> — Visibility modifiers for inputs/outputs
                    </li>
                    <li>
                      <code className="bg-slate-700 px-1.5 py-0.5 rounded text-indigo-300">u32, i64, field, bool</code> — Strong typing with explicit types
                    </li>
                  </ul>
                  <p className="text-slate-400 mt-4">
                    Click <strong className="text-slate-200">Run</strong> to compile and execute the code!
                  </p>
                </div>
              </div>
            </div>

            {/* Right: Code Editor */}
            <div>
              <EditorPanel
                initialCode={SAMPLE_LEO_CODE}
                editorHeight={320}
                title="Code Editor"
              />
            </div>
          </div>

          {/* Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
              <div className="w-10 h-10 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h4 className="font-semibold text-slate-100 mb-1">Interactive Learning</h4>
              <p className="text-sm text-slate-400">
                Learn by doing with hands-on code examples you can modify and run.
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
              <div className="w-10 h-10 bg-green-500/20 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h4 className="font-semibold text-slate-100 mb-1">Privacy-First</h4>
              <p className="text-sm text-slate-400">
                Learn to build applications with built-in privacy using zero-knowledge proofs.
              </p>
            </div>

            <div className="bg-slate-800/50 rounded-xl p-5 border border-slate-700">
              <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center mb-3">
                <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h4 className="font-semibold text-slate-100 mb-1">Local Execution</h4>
              <p className="text-sm text-slate-400">
                Code compiles and runs locally via Leo CLI for fast, reliable execution.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-4 px-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between text-sm text-slate-500">
          <span>Built for learning Leo</span>
          <span>Powered by the <a href="https://provable.com" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300">Provable SDK</a></span>
        </div>
      </footer>
    </div>
  );
}

export default App;
