import { useState, useCallback } from 'react';
import { Header, ContentPanel } from './components';
import { CodeEditor } from './components/editor/CodeEditor';
import { OutputPanel } from './components/editor/OutputPanel';
import { RunButton } from './components/editor/RunButton';
import { useLeoExecutor } from './hooks/useLeoExecutor';

// Lesson data
const lessons = [
  {
    title: 'Welcome to Leo',
    content: (
      <>
        <p>
          Leo is a statically-typed programming language designed for writing 
          private applications on the Aleo blockchain.
        </p>
        <p className="mt-4">
          In this interactive tutorial, you will learn the fundamentals of Leo
          by writing and running real code.
        </p>
        <p className="mt-4">Key features of Leo:</p>
        <ul className="mt-2">
          <li><code>program</code> - declares a program with an .aleo name</li>
          <li><code>transition</code> - entry point functions callable externally</li>
          <li><code>public/private</code> - visibility modifiers for inputs</li>
          <li>Strong typing with <code>u32</code>, <code>i64</code>, <code>field</code>, <code>bool</code></li>
        </ul>
        <p className="mt-4">
          Try running the code on the right to see Leo in action.
        </p>
      </>
    ),
    code: `program hello.aleo {
    transition main() -> u32 {
        let a: u32 = 5u32;
        let b: u32 = 10u32;
        let sum: u32 = a + b;
        return sum;
    }
}`,
  },
  {
    title: 'Variables and Types',
    content: (
      <>
        <p>
          Leo is statically typed. Every variable must have an explicit type.
        </p>
        <p className="mt-4">Common types in Leo:</p>
        <ul className="mt-2">
          <li><code>bool</code> - true or false</li>
          <li><code>u8, u16, u32, u64, u128</code> - unsigned integers</li>
          <li><code>i8, i16, i32, i64, i128</code> - signed integers</li>
          <li><code>field</code> - field element (for cryptographic operations)</li>
          <li><code>address</code> - Aleo address</li>
        </ul>
        <p className="mt-4">
          Use <code>let</code> to declare variables. Type annotations are required.
        </p>
      </>
    ),
    code: `program types.aleo {
    transition main() -> bool {
        let a: u32 = 100u32;
        let b: i64 = -50i64;
        let flag: bool = true;
        
        return flag;
    }
}`,
  },
  {
    title: 'Arithmetic Operations',
    content: (
      <>
        <p>
          Leo supports standard arithmetic operations on numeric types.
        </p>
        <p className="mt-4">Available operators:</p>
        <ul className="mt-2">
          <li><code>+</code> - addition</li>
          <li><code>-</code> - subtraction</li>
          <li><code>*</code> - multiplication</li>
          <li><code>/</code> - division</li>
          <li><code>%</code> - remainder</li>
          <li><code>**</code> - exponentiation</li>
        </ul>
        <p className="mt-4">
          Note: Operations must be between the same types. No implicit conversions.
        </p>
      </>
    ),
    code: `program math.aleo {
    transition main() -> u32 {
        let x: u32 = 5u32;
        let y: u32 = 3u32;
        let sum: u32 = x + y;
        let product: u32 = x * y;
        let power: u32 = x ** 2u32;
        
        return sum + product;
    }
}`,
  },
];

// Export lessons for Header navigation
export { lessons };

function App() {
  const [currentLesson, setCurrentLesson] = useState(0);
  const [code, setCode] = useState(lessons[0].code);
  const { execute, isExecuting, result, error, clearResult } = useLeoExecutor();

  const handleLessonChange = useCallback((index: number) => {
    setCurrentLesson(index);
    setCode(lessons[index].code);
    clearResult();
  }, [clearResult]);

  const handlePrevious = useCallback(() => {
    if (currentLesson > 0) {
      handleLessonChange(currentLesson - 1);
    }
  }, [currentLesson, handleLessonChange]);

  const handleNext = useCallback(() => {
    if (currentLesson < lessons.length - 1) {
      handleLessonChange(currentLesson + 1);
    }
  }, [currentLesson, handleLessonChange]);

  const handleRun = useCallback(async () => {
    await execute(code);
  }, [code, execute]);

  const handleCodeChange = useCallback((newCode: string) => {
    setCode(newCode);
  }, []);

  const lesson = lessons[currentLesson];

  return (
    <div className="h-screen flex flex-col bg-black">
      <Header 
        lessons={lessons}
        currentLesson={currentLesson}
        onNavigate={handleLessonChange}
      />
      
      <main className="flex-1 flex min-h-0">
        {/* Left Panel - Content */}
        <div className="w-1/2 border-r border-neutral-800">
          <ContentPanel
            title={lesson.title}
            content={lesson.content}
            currentIndex={currentLesson + 1}
            totalLessons={lessons.length}
            onPrevious={handlePrevious}
            onNext={handleNext}
          />
        </div>

        {/* Right Panel - Editor & Output */}
        <div className="w-1/2 flex flex-col">
          {/* Code Editor */}
          <div className="flex-2 flex flex-col min-h-0 border-b border-neutral-800">
            <div className="flex items-center justify-between px-4 py-2 border-b border-neutral-800">
              <span className="text-xs font-medium text-neutral-400 uppercase tracking-wider">
                Editor
              </span>
              <RunButton
                onClick={handleRun}
                isLoading={isExecuting}
                disabled={!code.trim()}
              />
            </div>
            <div className="flex-1 min-h-0">
              <CodeEditor
                value={code}
                onChange={handleCodeChange}
                onRun={handleRun}
                height="100%"
              />
            </div>
          </div>

          {/* Output Panel */}
          <div className="flex-1 min-h-37.5">
            <OutputPanel
              result={result}
              error={error}
              isLoading={isExecuting}
            />
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
