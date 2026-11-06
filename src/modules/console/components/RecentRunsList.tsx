import React from 'react';
import type { DashboardRecentRun } from '../../../lib/api/dashboard';
import { StatusBadge } from './StatusBadge';

type RecentRun = DashboardRecentRun;

const fmt = (n: number) => new Intl.NumberFormat('id-ID').format(n);

export const RecentRunsList: React.FC<{ runs: RecentRun[] }> = ({ runs }) => (
  <div className="overflow-x-auto">
    <table className="w-full min-w-[520px] border-collapse text-left">
      <thead>
        <tr className="border-b border-[var(--color-border)]">
          {['Run', 'Status', 'Lulus/Gagal', 'Durasi', 'Perangkat'].map((h) => (
            <th
              key={h}
              scope="col"
              className="px-3 py-2 font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {runs.map((r) => (
          <tr
            key={r.id}
            className="border-b border-[var(--color-border)]/60 last:border-0 hover:bg-[var(--color-surface)]/60 transition-colors"
          >
            <td className="px-3 py-3 font-mono text-xs text-[var(--color-text-primary)]">
              {r.runRef}
            </td>
            <td className="px-3 py-3">
              <StatusBadge status={r.status} />
            </td>
            <td className="px-3 py-3 font-mono text-xs">
              {fmt(r.passed)}/{fmt(r.failed)}
            </td>
            <td className="px-3 py-3 font-mono text-xs">
              {r.durationMs != null ? `${fmt(r.durationMs)} ms` : '—'}
            </td>
            <td className="px-3 py-3 text-sm">{r.device ?? '—'}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);
