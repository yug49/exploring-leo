/**
 * Content Panel Component
 * 
 * Left panel displaying lesson content with navigation arrows.
 */

import React from 'react';

interface ContentPanelProps {
  /** Lesson title */
  title: string;
  /** Lesson content as HTML or text */
  content: React.ReactNode;
  /** Current lesson index (1-based) */
  currentIndex: number;
  /** Total number of lessons */
  totalLessons: number;
  /** Callback for previous lesson */
  onPrevious: () => void;
  /** Callback for next lesson */
  onNext: () => void;
  /** Additional class name */
  className?: string;
}

export const ContentPanel: React.FC<ContentPanelProps> = ({
  title,
  content,
  currentIndex,
  totalLessons,
  onPrevious,
  onNext,
  className = '',
}) => {
  const canGoPrevious = currentIndex > 1;
  const canGoNext = currentIndex < totalLessons;

  return (
    <div className={`flex flex-col h-full bg-[#0a0a0a] ${className}`}>
      {/* Content Area */}
      <div className="flex-1 overflow-auto p-8">
        <h2 className="text-2xl font-semibold text-white mb-6">{title}</h2>
        <div className="prose prose-invert prose-sm max-w-none text-neutral-300 leading-relaxed">
          {content}
        </div>
      </div>

      {/* Navigation Footer */}
      <div className="flex items-center justify-between px-8 py-4 border-t border-neutral-800">
        <button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
            canGoPrevious
              ? 'text-neutral-300 hover:text-white'
              : 'text-neutral-600 cursor-not-allowed'
          }`}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Previous
        </button>

        <span className="text-sm text-neutral-500">
          {currentIndex} / {totalLessons}
        </span>

        <button
          onClick={onNext}
          disabled={!canGoNext}
          className={`flex items-center gap-2 px-4 py-2 text-sm font-medium transition-colors ${
            canGoNext
              ? 'text-neutral-300 hover:text-white'
              : 'text-neutral-600 cursor-not-allowed'
          }`}
        >
          Next
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default ContentPanel;
