import React from 'react';

interface WindowCardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
}

export const WindowCard: React.FC<WindowCardProps> = ({ 
  title = "untitled", 
  children, 
  className = "",
  contentClassName = "",
}) => {
  return (
    <div className={`border-2 border-black bg-white flex flex-col h-full ${className}`}>
      {/* Window Header */}
      <div className="border-b-2 border-black bg-gray-200 px-3 py-1 flex items-center">
        <div className="flex gap-1.5">
          <div className="w-3.5 h-3.5 rounded-full border border-black bg-white"></div>
          <div className="w-3.5 h-3.5 rounded-full border border-black bg-white"></div>
        </div>
        <div className="flex-grow text-center font-mono text-xs font-bold uppercase tracking-tight truncate px-4">
          {title}
        </div>
      </div>
      
      {/* Window Content */}
      <div className={`flex-grow p-4 ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
};