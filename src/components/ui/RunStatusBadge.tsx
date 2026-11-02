import React from 'react';

const STYLE: Record<string, { label: string; className: string }> = {
  pass: {
    label: 'Lulus',
    className:
      'text-[var(--color-success)] border-[var(--color-success)]/40 bg-[var(--color-success)]/10',
  },
  fail: {
    label: 'Gagal',
    className:
      'text-[var(--color-danger)] border-[var(--color-danger)]/40 bg-[var(--color-danger)]/10',
  },
  running: {
    label: 'Berjalan',
    className:
      'text-[var(--color-warning)] border-[var(--color-warning)]/40 bg-[var(--color-warning)]/10',
  },
  error: {
    label: 'Error',
    className:
      'text-[var(--color-danger)] border-[var(--color-danger)]/40 bg-[var(--color-danger)]/10',
  },
  skipped: {
    label: 'Dilewati',
    className:
      'text-[var(--color-text-muted)] border-[var(--color-border)] bg-[var(--color-surface)]',
  },
};

const resolve = (status: string) => {
  const key = status.toLowerCase();
  if (key === 'passed') return STYLE.pass;
  if (key === 'failed') return STYLE.fail;
  return STYLE[key] ?? { label: status || 'Tidak diketahui', className: STYLE.skipped.className };
};

/** Teks status selalu ikut supaya tetap terbaca tanpa penglihatan warna. */
export const RunStatusBadge: React.FC<{ status: string }> = ({ status }) => {
  const style = resolve(status);
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${style.className}`}
    >
      {style.label}
    </span>
  );
};

export const formatDuration = (ms: number | null | undefined): string => {
  if (ms == null) return '—';
  if (ms < 1000) return `${ms} ms`;
  return `${(ms / 1000).toFixed(1).replace('.', ',')} dtk`;
};
