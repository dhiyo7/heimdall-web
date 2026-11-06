import React from 'react';
import { ChevronRight, Home } from 'lucide-react';

export type Crumb = { label: string; path: string | null };

type Props = {
  /** Path folder aktif (null/kosong = root workspace). */
  path: string | null;
  onNavigate: (path: string | null) => void;
};

/** SPEC-32 FR-10: breadcrumb dari `Folder.path`; tiap segmen klikabel. */
export const BreadcrumbBar: React.FC<Props> = ({ path, onNavigate }) => {
  const segments = (path ?? '').split('/').filter(Boolean);

  return (
    <nav aria-label="Breadcrumb" className="flex flex-wrap items-center gap-1 font-mono text-xs">
      <button
        type="button"
        onClick={() => onNavigate(null)}
        className="inline-flex items-center gap-1 rounded-md px-1.5 py-1 text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-primary)]"
      >
        <Home className="h-3.5 w-3.5" aria-hidden="true" />
        Semua script
      </button>
      {segments.map((seg, i) => {
        const isLast = i === segments.length - 1;
        const segPath = segments.slice(0, i + 1).join('/');
        return (
          <React.Fragment key={segPath}>
            <ChevronRight className="h-3.5 w-3.5 text-[var(--color-text-muted)]" aria-hidden="true" />
            <button
              type="button"
              onClick={() => onNavigate(segPath)}
              aria-current={isLast ? 'location' : undefined}
              className={`rounded-md px-1.5 py-1 hover:bg-[var(--color-surface)] ${
                isLast
                  ? 'font-semibold text-[var(--color-text-primary)]'
                  : 'text-[var(--color-text-secondary)] hover:text-[var(--color-primary)]'
              }`}
            >
              {seg}
            </button>
          </React.Fragment>
        );
      })}
    </nav>
  );
};
