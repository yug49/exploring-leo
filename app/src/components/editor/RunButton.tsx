import React from 'react';

interface RunButtonProps {
  /** Callback when button is clicked */
  onClick: () => void;
  /** Whether execution is in progress */
  isLoading?: boolean;
  /** Whether button is disabled */
  disabled?: boolean;
  /** Additional class name */
  className?: string;
}

export const RunButton: React.FC<RunButtonProps> = ({
  onClick,
  isLoading = false,
  disabled = false,
  className = '',
}) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={`
        inline-flex items-center justify-center gap-1.5
        px-3 py-1.5 rounded
        bg-[#00ffc8] hover:bg-[#00e6b4]
        disabled:bg-neutral-700 disabled:text-neutral-500 disabled:cursor-not-allowed
        text-black font-medium text-xs
        transition-colors duration-150
        ${className}
      `}
    >
      {isLoading ? (
        <>
          <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
          </svg>
          <span>Running</span>
        </>
      ) : (
        <>
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
          <span>Run</span>
        </>
      )}
    </button>
  );
};
