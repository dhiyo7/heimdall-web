import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'outline';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  className = '',
  ...props
}) => {
  const baseStyles = "px-6 py-2.5 font-sans font-bold text-xs uppercase tracking-wider rounded-lg transition-all duration-300 ease-out focus:outline-none focus:ring-2 focus:ring-emerald-500/50 hover:-translate-y-0.5 active:translate-y-0";

  const variants = {
    primary: "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-md hover:shadow-lg hover:shadow-emerald-500/25 border border-emerald-600 dark:border-emerald-500/30",
    outline: "bg-white/80 dark:bg-zinc-900/80 text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-800/80 shadow-sm hover:shadow-md"
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};