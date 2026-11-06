import React from 'react';

type Tone = 'success' | 'warning' | 'danger' | 'primary';

const FILL: Record<Tone, string> = {
  success: 'bg-[var(--color-success)]',
  warning: 'bg-[var(--color-warning)]',
  danger: 'bg-[var(--color-danger)]',
  primary: 'bg-[var(--color-primary)]',
};

export const toneFromPercent = (percent: number): Tone =>
  percent >= 100 ? 'danger' : percent > 80 ? 'warning' : 'success';

/** Format byte ke satuan ringkas (KB/MB/GB) dengan gaya id-ID. */
export const formatBytes = (bytes: number): string => {
  if (!Number.isFinite(bytes) || bytes <= 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.min(units.length - 1, Math.floor(Math.log(bytes) / Math.log(1024)));
  const value = bytes / 1024 ** i;
  return `${new Intl.NumberFormat('id-ID', { maximumFractionDigits: 1 }).format(value)} ${units[i]}`;
};

type Props = {
  /** Persentase terpakai 0–100+. Boleh dihilangkan bila `used`+`limit` diberikan. */
  percent?: number;
  /** Alternatif: kirim byte terpakai & limit; persen dihitung otomatis. */
  used?: number;
  limit?: number;
  tone?: Tone;
  label?: string;
  /** Teks bantu di kanan, mis. "45,0 MB / 100 MB". */
  hint?: string;
  /** Teks status di bawah bar yang selalu ikut warna (NFR-4). */
  note?: string;
  className?: string;
};

/** Bar kuota sederhana: warna + teks. Nilainya statis per render, tak perlu throttle. */
export const ProgressBar: React.FC<Props> = ({
  percent,
  used,
  limit,
  tone,
  label,
  hint,
  note,
  className = '',
}) => {
  const resolvedPercent =
    percent ?? (used != null && limit != null && limit > 0 ? (used / limit) * 100 : 0);
  const resolvedHint =
    hint ??
    (used != null && limit != null && limit > 0 ? `${formatBytes(used)} / ${formatBytes(limit)}` : undefined);
  const clamped = Math.max(0, Math.min(100, resolvedPercent));
  const activeTone = tone ?? toneFromPercent(resolvedPercent);
  return (
    <div className={className}>
      {(label || resolvedHint) && (
        <div className="mb-1.5 flex items-baseline justify-between gap-2">
          {label && (
            <span className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]">
              {label}
            </span>
          )}
          {resolvedHint && (
            <span className="font-mono text-[11px] text-[var(--color-text-secondary)]">{resolvedHint}</span>
          )}
        </div>
      )}
      <div
        role="progressbar"
        aria-valuenow={Math.round(clamped)}
        aria-valuemin={0}
        aria-valuemax={100}
        className="h-2 w-full overflow-hidden rounded-full bg-[var(--color-surface-muted)]"
      >
        <div
          className={`h-full rounded-full transition-all duration-300 ${FILL[activeTone]}`}
          style={{ width: `${clamped}%` }}
        />
      </div>
      {note && <p className={`mt-1.5 font-sans text-xs text-[var(--color-${activeTone})]`}>{note}</p>}
    </div>
  );
};
