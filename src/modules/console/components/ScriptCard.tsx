import React from 'react';
import type { Script } from '../../../lib/api/types';
import { SyncBadge, type SyncState } from './SyncBadge';
import { ScriptTypeIcon, scriptTypeLabel } from './ScriptTypeIcon';

/** Ukuran byte → teks ringkas; "—" bila tidak tersedia. */
export const formatBytes = (bytes?: number | null): string => {
  if (bytes == null) return '—';
  if (bytes < 1024) return `${bytes} B`;
  const units = ['KB', 'MB', 'GB'];
  let value = bytes / 1024;
  let i = 0;
  while (value >= 1024 && i < units.length - 1) {
    value /= 1024;
    i += 1;
  }
  return `${value.toFixed(value < 10 ? 1 : 0)} ${units[i]}`;
};

type Props = {
  script: Script;
  syncState: SyncState;
  onOpen: (script: Script) => void;
  onContextMenu: (script: Script, position: { x: number; y: number }) => void;
};

/** SPEC-32 FR-11: kartu file ala Drive. */
export const ScriptCard: React.FC<Props> = ({ script, syncState, onOpen, onContextMenu }) => {
  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onOpen(script);
    }
    if (e.key === 'ContextMenu' || (e.shiftKey && e.key === 'F10')) {
      e.preventDefault();
      const rect = e.currentTarget.getBoundingClientRect();
      onContextMenu(script, { x: rect.left + 16, y: rect.top + 16 });
    }
  };

  return (
    <button
      type="button"
      onClick={() => onOpen(script)}
      onKeyDown={onKeyDown}
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu(script, { x: e.clientX, y: e.clientY });
      }}
      aria-label={`Buka ${script.name}`}
      className="group flex w-full flex-col gap-3 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]/40 p-3 text-left transition-colors hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-surface)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-primary)]"
    >
      <div className="flex items-start justify-between gap-2">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-md border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-primary)]">
          <ScriptTypeIcon type={script.type} />
        </span>
        <SyncBadge state={syncState} />
      </div>

      <div className="min-w-0">
        <p className="truncate font-sans text-sm font-semibold text-[var(--color-text-primary)]" title={script.name}>
          {script.name}
        </p>
        <p className="mt-0.5 truncate font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
          {scriptTypeLabel(script.type)} · v{script.latestVersionNo ?? 0}
        </p>
      </div>

      <div className="flex items-center justify-between gap-2 font-mono text-[10px] text-[var(--color-text-muted)]">
        <span>{formatBytes(script.sizeBytes)}</span>
        <span>{new Date(script.updatedAt).toLocaleDateString('id-ID')}</span>
      </div>
    </button>
  );
};
