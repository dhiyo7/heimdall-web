import React from 'react';

export type Column<T> = {
  key: string;
  label: string;
  /** Angka, slug, kode: pakai font mono seperti instrumen di landing. */
  mono?: boolean;
  render?: (row: T) => React.ReactNode;
  className?: string;
};

type Props<T> = {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  loading?: boolean;
  empty?: React.ReactNode;
  /** Bila diisi, baris bisa diklik (selain tombol di dalam sel). */
  onRowClick?: (row: T) => void;
};

export function DataTable<T>({ columns, rows, rowKey, loading, empty, onRowClick }: Props<T>) {
  if (loading) {
    return (
      <div className="space-y-2 p-1" aria-busy="true">
        {[0, 1, 2].map((i) => (
          <div key={i} className="h-10 animate-pulse rounded-md bg-[var(--color-surface-muted)]" />
        ))}
      </div>
    );
  }

  if (rows.length === 0) return <>{empty}</>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[520px] border-collapse text-left">
        <thead>
          <tr className="border-b border-[var(--color-border)]">
            {columns.map((c) => (
              <th
                key={c.key}
                scope="col"
                className="px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]"
              >
                {c.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={`border-b border-[var(--color-border)]/60 last:border-0 hover:bg-[var(--color-surface)]/60 transition-colors ${
                onRowClick ? 'cursor-pointer' : ''
              }`}
            >
              {columns.map((c) => (
                <td
                  key={c.key}
                  className={`px-3 py-3 text-sm align-middle ${c.mono ? 'font-mono text-xs' : ''} ${c.className ?? ''}`}
                >
                  {c.render ? c.render(row) : String((row as Record<string, unknown>)[c.key] ?? '—')}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
