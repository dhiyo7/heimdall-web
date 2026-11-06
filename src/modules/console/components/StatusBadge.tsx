import React from 'react';

/** Status run dari backend; UI memetakan yang dikenal dan memakai nilai mentah lainnya. */
type Status = 'passed' | 'failed' | 'running' | string;

const STYLE: Record<string, { label: string; className: string }> = {
  passed: {
    label: 'Lulus',
    className:
      'text-[var(--color-success)] border-[var(--color-success)]/40 bg-[var(--color-success)]/10',
  },
  failed: {
    label: 'Gagal',
    className:
      'text-[var(--color-danger)] border-[var(--color-danger)]/40 bg-[var(--color-danger)]/10',
  },
  running: {
    label: 'Berjalan',
    className:
      'text-[var(--color-warning)] border-[var(--color-warning)]/40 bg-[var(--color-warning)]/10',
  },
};

/** Teks status selalu ikut, bukan hanya warna — tetap terbaca tanpa penglihatan warna (NFR-4). */
export const StatusBadge: React.FC<{ status: Status }> = ({ status }) => {
  const key = status?.toLowerCase();
  const style = STYLE[key] ?? {
    label: status || 'Tidak diketahui',
    className:
      'text-[var(--color-text-muted)] border-[var(--color-border)] bg-[var(--color-surface)]',
  };
  return (
    <span
      className={`inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${style.className}`}
    >
      {style.label}
    </span>
  );
};
