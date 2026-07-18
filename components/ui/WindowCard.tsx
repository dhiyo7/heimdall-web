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
    <div className={`border border-slate-200/80 dark:border-zinc-800/80 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md rounded-xl flex flex-col h-full overflow-hidden transition-all duration-300 hover:border-slate-300 dark:hover:border-zinc-700/85 ${className}`}>
      {/* Window Header */}
      <div className="border-b border-slate-100 dark:border-zinc-900 bg-slate-50/70 dark:bg-zinc-900/30 px-4 py-2.5 flex items-center justify-between gap-4 transition-colors duration-300">
        <div className="flex gap-1.5 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-red-400/80 dark:bg-red-500/40"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-amber-400/80 dark:bg-amber-500/40"></div>
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400/80 dark:bg-emerald-500/40"></div>
        </div>
        <div className="flex-grow text-center font-mono text-xs font-semibold text-slate-500 dark:text-zinc-400 tracking-tight truncate leading-tight">
          {title}
        </div>
        {date && (
          <div className="font-mono text-[10px] font-medium text-slate-400 dark:text-zinc-500 shrink-0">
            {date}
          </div>
        )}
        {!date && <div className="w-[34px]"></div>}
      </div>

      {/* Window Content */}
      <div className={`flex-grow ${noPadding ? 'p-0' : 'p-5'} text-slate-700 dark:text-zinc-300 ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
};