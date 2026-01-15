import React from 'react';

interface HeaderProps {
  className?: string;
}

export const Header: React.FC<HeaderProps> = ({ className = '' }) => {
  return (
    <header className={`bg-slate-800 border-b border-slate-700 ${className}`}>
      <div className="h-14 px-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">L</span>
          </div>
          <h1 className="text-lg font-semibold text-slate-100">
            Exploring Leo
          </h1>
        </div>
        <nav className="flex items-center gap-4">
          <a
            href="https://docs.leo-lang.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
          >
            Docs
          </a>
          <a
            href="https://github.com/ProvableHQ/leo"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
          >
            GitHub
          </a>
        </nav>
      </div>
    </header>
  );
};
