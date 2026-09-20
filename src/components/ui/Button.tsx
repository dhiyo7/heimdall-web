import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'tertiary' | 'quaternary' | 'filled';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
  ...props
}) => {
  // WingDeck button specs from DESIGN2.md:
  // Primary: bg #A62126, text #FFFFFF, border 1px #000000, radius 7px, 48px height, font 14px/730
  // Secondary: bg #08090A, text #FFFFFF, border 1px #FFFFFF, radius 7px, 48px height
  // Tertiary: transparent, text #C8CBCC, border 1px #2B2E30, radius 999px, 38px height, font 13px/600
  // Quaternary: transparent, text #FFFFFF, border 1px #FFFFFF, radius 8px, 38px height, font 13px/700
  // Filled: bg #24975E, text #E4FFEF, border 1px #4FD18B, radius 7px, shadow, 48px height

  const sizeClasses = {
    sm: 'px-3 py-1 text-xs font-medium rounded-md',
    md: 'h-12 px-6 text-sm font-medium rounded-lg',
    lg: 'h-14 px-8 text-base font-semibold rounded-[var(--radius-lg)]',
  };

  // Light mode accessible colors: primary uses --color-primary (blue) for visibility on all backgrounds
  // secondary: transparent bg, text uses var(--color-text-primary) for contrast
  const variantClasses = {
    primary: "bg-[var(--color-primary)] text-[var(--color-background)] border border-[var(--color-primary)] font-['-apple-system'] text-sm font-extrabold tracking-tight hover:opacity-90 transition-opacity",
    secondary: "bg-transparent text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-lg font-['-apple-system'] text-sm font-bold hover:bg-[var(--color-surface)] transition-colors",
    tertiary: "bg-transparent text-[var(--color-text-muted)] border border-[var(--color-border)] rounded-full font-['-apple-system'] text-xs font-semibold hover:text-[var(--color-text-primary)] hover:border-[var(--color-surface-muted)] transition-colors",
    quaternary: "bg-transparent text-[var(--color-text-primary)] border border-[var(--color-border)] rounded-md font-['-apple-system'] text-xs font-bold hover:bg-[var(--color-surface)] transition-colors",
    filled: "bg-[var(--color-success)] text-[var(--color-text-secondary)] border border-[var(--color-success)] font-['-apple-system'] text-sm font-extrabold hover:opacity-90 transition-opacity",
  };

  return (
    <button
      className={`inline-flex items-center justify-center gap-3 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/50 ${sizeClasses[size]} ${variantClasses[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};