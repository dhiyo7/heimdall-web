import React from 'react';
import { WindowCard } from '../../../components/ui/WindowCard';
import { ProgressBar } from './ProgressBar';

export type StatCardVariant = 'number' | 'percent' | 'progress';
export type StatCardTone = 'default' | 'success' | 'warning' | 'danger' | 'primary';

const TONE_TEXT: Record<StatCardTone, string> = {
  default: 'text-[var(--color-text-primary)]',
  success: 'text-[var(--color-success)]',
  warning: 'text-[var(--color-warning)]',
  danger: 'text-[var(--color-danger)]',
  primary: 'text-[var(--color-primary)]',
};

type Props = {
  title: string;
  label: string;
  value: React.ReactNode;
  variant?: StatCardVariant;
  tone?: StatCardTone;
  icon?: React.ReactNode;
  /** Teks kecil di bawah angka — selalu ikut supaya status terbaca tanpa warna (NFR-4). */
  caption?: string;
  /** Hanya untuk variant 'progress'. */
  progressPercent?: number;
};

/**
 * Kartu KPI console. Satu komponen menutup tiga bentuk (angka, persen, progres)
 * supaya Overview tidak bikin tiga kartu mirip.
 */
export const StatCard: React.FC<Props> = ({
  title,
  label,
  value,
  variant = 'number',
  tone = 'default',
  icon,
  caption,
  progressPercent,
}) => {
  const valueSize = variant === 'percent' ? 'text-2xl' : 'text-3xl';

  return (
    <WindowCard title={title} noPadding>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]">
            {label}
          </p>
          {icon && (
            <span className="shrink-0 text-[var(--color-text-muted)]" aria-hidden="true">
              {icon}
            </span>
          )}
        </div>

        {variant === 'progress' ? (
          <div className="mt-3">
            <ProgressBar percent={progressPercent ?? 0} />
            <p className={`mt-1 font-mono text-sm font-bold ${TONE_TEXT[tone]}`}>{value}</p>
          </div>
        ) : (
          <p className={`mt-1 font-mono ${valueSize} font-extrabold ${TONE_TEXT[tone]}`}>{value}</p>
        )}

        {caption && (
          <p className={`mt-1 font-sans text-xs ${TONE_TEXT[tone]}`}>{caption}</p>
        )}
      </div>
    </WindowCard>
  );
};
