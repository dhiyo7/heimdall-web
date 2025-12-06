import React from 'react';

interface WindowCardProps {
  title?: string;
  date?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  noPadding?: boolean;
}

export const WindowCard: React.FC<WindowCardProps> = ({
  title = "untitled",
  date,
  children,
  className = "",
  contentClassName = "",
  noPadding = false,
}) => {
  return (
    <div className={`border-2 border-black dark:border-white bg-white dark:bg-black flex flex-col h-full transition-colors duration-300 ${className}`}>
      {/* Window Header */}
      <div className="border-b-2 border-black dark:border-white bg-gray-200 dark:bg-gray-900 px-3 py-2 flex items-center justify-between gap-4 transition-colors duration-300">
        <div className="flex gap-1.5 shrink-0">
          <div className="w-3.5 h-3.5 rounded-full border border-black dark:border-gray-400 bg-white dark:bg-black"></div>
          <div className="w-3.5 h-3.5 rounded-full border border-black dark:border-gray-400 bg-white dark:bg-black"></div>
        </div>
        <div className="flex-grow text-center font-mono text-xs font-bold uppercase tracking-tight truncate leading-tight dark:text-gray-200">
          {title}
        </div>
        {date && (
          <div className="font-mono text-[10px] font-bold shrink-0 opacity-60 dark:text-gray-400">
            {date}
          </div>
        )}
        {!date && <div className="w-[34px]"></div>} {/* Spacer for centering if needed, but flex-grow on title handles most */}
      </div>

      {/* Window Content */}
      <div className={`flex-grow ${noPadding ? 'p-0' : 'p-4'} text-black dark:text-white ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
};