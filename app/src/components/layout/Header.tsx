import React, { useState, useRef, useEffect } from 'react';

interface Lesson {
  title: string;
}

interface HeaderProps {
  className?: string;
  lessons?: Lesson[];
  currentLesson?: number;
  onNavigate?: (index: number) => void;
}

export const Header: React.FC<HeaderProps> = ({ 
  className = '',
  lessons = [],
  currentLesson = 0,
  onNavigate,
}) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
    };

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  const handleNavigate = (index: number) => {
    onNavigate?.(index);
    setMenuOpen(false);
  };

  return (
    <header className={`bg-[#0a0a0a] border-b border-neutral-800 ${className}`}>
      <div className="h-12 px-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <img src="/leo-logo.svg" alt="Leo Logo" className="w-12 h-12" />
            <h1 className="text-sm font-medium text-white">
              Exploring Leo
            </h1>
          </div>
          <span className="text-xs text-neutral-500 hidden sm:block">
            Learn Leo interactively
          </span>
        </div>
        <div className="flex items-center gap-4">
          <nav className="flex items-center gap-4">
            <a
              href="https://docs.leo-lang.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-neutral-400 hover:text-white transition-colors"
            >
              Docs
            </a>
            <a
              href="https://github.com/yug49/exploring-leo"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-neutral-400 hover:text-white transition-colors"
            >
              GitHub
            </a>
          </nav>

          {/* Hamburger Menu */}
          {lessons.length > 0 && (
            <div className="relative" ref={menuRef}>
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="p-2 text-neutral-400 hover:text-white transition-colors"
                aria-label="Navigation menu"
              >
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>

              {/* Dropdown Menu */}
              {menuOpen && (
                <div className="absolute right-0 top-full mt-2 bg-[#171717] border border-neutral-800 rounded-lg shadow-xl z-50" style={{ width: '540px' }}>
                  <div className="py-2">
                    <div className="px-4 py-2 text-xs font-medium text-neutral-500 uppercase tracking-wider border-b border-neutral-800">
                      Lessons
                    </div>
                    <div className="flex">
                      {/* Left Column - First half of lessons */}
                      <div className="flex-1 border-r border-neutral-800">
                        {lessons.slice(0, Math.ceil(lessons.length / 2)).map((lesson, index) => (
                          <button
                            key={index}
                            onClick={() => handleNavigate(index)}
                            className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                              index === currentLesson
                                ? 'bg-[#00ffc8]/10 text-[#00ffc8]'
                                : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                            }`}
                          >
                            <span className="text-neutral-500 mr-2">{index + 1}.</span>
                            {lesson.title}
                          </button>
                        ))}
                      </div>
                      {/* Right Column - Second half of lessons */}
                      <div className="flex-1">
                        {lessons.slice(Math.ceil(lessons.length / 2)).map((lesson, index) => {
                          const actualIndex = index + Math.ceil(lessons.length / 2);
                          return (
                            <button
                              key={actualIndex}
                              onClick={() => handleNavigate(actualIndex)}
                              className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                                actualIndex === currentLesson
                                  ? 'bg-[#00ffc8]/10 text-[#00ffc8]'
                                  : 'text-neutral-300 hover:bg-neutral-800 hover:text-white'
                              }`}
                            >
                              <span className="text-neutral-500 mr-2">{actualIndex + 1}.</span>
                              {lesson.title}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
