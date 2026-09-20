import React from 'react';

export type WindowCardVariant = 'default' | 'dark' | 'highlight' | 'muted';

interface WindowCardProps {
  title?: string;
  subtitle?: string;
  date?: string;
  children: React.ReactNode;
  className?: string;
  contentClassName?: string;
  noPadding?: boolean;
  variant?: WindowCardVariant;
}

export const WindowCard: React.FC<WindowCardProps> = ({
  title = 'untitled',
  subtitle,
  date,
  children,
  className = '',
  contentClassName = '',
  noPadding = false,
  variant = 'default',
}) => {
  // WingDeck card specs from DESIGN2.md:
  // Default   → bg #101213, text #F7F7F5, 1px border #2B2E30, radius 8px
  // Dark      → bg #0D0F11, no border, radius 12px, shadow md
  // Highlight → bg #181A1B, 1px border #333638, radius 8px, shadow-inner
  // Muted     → bg #050606, 1px border #FFFFFF, radius 7px

  const containerClasses = `
    flex flex-col h-full
    overflow-hidden
    transition-all duration-200
    hover:border-[var(--color-primary)]
  `;

  const variantClasses: Record<WindowCardVariant, string> = {
    default:
      'bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-lg',
    dark:
      'bg-[var(--color-background)] border-none rounded-xl shadow-md',
    highlight:
      'bg-[var(--color-surface)] border border-[#333638] rounded-xl shadow-inner',
    muted:
      'bg-[#050606] border border-white rounded-md',
  };

  return (
    <div className={`${containerClasses} ${variantClasses[variant]} ${className}`}>
      {/* Window Header */}
      <div className="border-b border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-2.5 flex items-center justify-between gap-4 transition-colors duration-200">
        <div className="flex gap-1.5 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-danger)]" aria-hidden="true" />
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-warning)]" aria-hidden="true" />
          <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-success)]" aria-hidden="true" />
        </div>

        <div className="flex-grow text-center min-w-0">
          <div className="font-mono text-xs font-semibold text-[var(--color-text-muted)] tracking-tight truncate leading-tight">
            {title}
          </div>
          {subtitle && (
            <div className="font-mono text-[10px] font-medium text-[var(--color-text-muted)] shrink-0 pt-0.5 truncate">
              {subtitle}
            </div>
          )}
        </div>

        {date ? (
          <div className="font-mono text-[10px] font-medium text-[var(--color-text-muted)] shrink-0">
            {date}
          </div>
        ) : (
          <div className="w-[34px] shrink-0" />
        )}
      </div>

      {/* Window Content */}
      <div
        className={`
          flex-grow
          ${noPadding ? 'p-0' : 'p-5'}
          text-[var(--color-text-secondary)]
          ${contentClassName}
        `}
      >
        {children}
      </div>
    </div>
  );
};