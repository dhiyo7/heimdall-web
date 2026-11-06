import React from 'react';

export type TrendDay = { date: string; passRate: number; total: number };

const toneOf = (passRate: number): { fill: string; label: string } =>
  passRate >= 90
    ? { fill: 'bg-[var(--color-success)]', label: 'Baik' }
    : passRate >= 70
      ? { fill: 'bg-[var(--color-warning)]', label: 'Perlu perhatian' }
      : { fill: 'bg-[var(--color-danger)]', label: 'Kritis' };

/**
 * Bar 7 hari buatan sendiri (div flex) — tanpa dependency chart.
 * ponytail: tanpa tooltip interaktif/zoom/sumbu-Y presisi; nilai per hari
 * hanya lewat <title> bawaan browser. Naik ke recharts saat butuh tooltip
 * hover, zoom rentang waktu, atau banyak seri (pass/fail bertumpuk).
 */
export const TrendChart: React.FC<{ data: TrendDay[] }> = ({ data }) => {
  if (data.length === 0) return null;

  return (
    <div className="flex h-32 items-end gap-2 sm:gap-3">
      {data.map((d) => {
        const tone = toneOf(d.passRate);
        return (
          <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
            <span className="font-mono text-[10px] text-[var(--color-text-muted)]">
              {d.total > 0 ? `${Math.round(d.passRate)}%` : '–'}
            </span>
            <div
              className={`w-full rounded-t ${tone.fill}`}
              style={{ height: `${Math.max(2, (d.passRate / 100) * 100)}%` }}
              title={`${d.date}: ${Math.round(d.passRate)}% lulus dari ${d.total} run (${tone.label})`}
            />
            <span className="font-mono text-[10px] text-[var(--color-text-muted)]">
              {d.date.slice(5)}
            </span>
          </div>
        );
      })}
    </div>
  );
};
