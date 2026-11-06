import React from 'react';
import { AlertTriangle, Cloud, HardDrive } from 'lucide-react';

export type SyncState = 'synced' | 'conflict' | 'local';

/** SPEC-32 FR-12: status sinkronisasi. Warna + TEKS (bukan hanya warna). */
const STYLE: Record<SyncState, { label: string; className: string; Icon: typeof Cloud }> = {
  synced: {
    label: 'Tersinkron',
    className: 'text-[var(--color-success)] border-[var(--color-success)]/40 bg-[var(--color-success)]/10',
    Icon: Cloud,
  },
  conflict: {
    label: 'Konflik',
    className: 'text-[var(--color-warning)] border-[var(--color-warning)]/40 bg-[var(--color-warning)]/10',
    Icon: AlertTriangle,
  },
  local: {
    label: 'Lokal',
    className: 'text-[var(--color-text-muted)] border-[var(--color-border)] bg-[var(--color-surface-muted)]',
    Icon: HardDrive,
  },
};

export const SyncBadge: React.FC<{ state: SyncState; className?: string }> = ({
  state,
  className = '',
}) => {
  const { label, className: tone, Icon } = STYLE[state];
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${tone} ${className}`}
    >
      <Icon className="h-3 w-3" aria-hidden="true" />
      {label}
    </span>
  );
};
