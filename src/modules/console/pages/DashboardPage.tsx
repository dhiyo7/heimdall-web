import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useApi } from '../../../lib/useApi';
import { getDashboard } from '../../../lib/api/dashboard';
import { Button } from '../../../components/ui/Button';
import { WindowCard } from '../../../components/ui/WindowCard';
import { EmptyState } from '../EmptyState';

const fmt = (n: number) => new Intl.NumberFormat('id-ID').format(n);

const Card: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <WindowCard title={label} noPadding>
    <div className="p-4">
      <p className="font-mono text-2xl font-extrabold text-[var(--color-text-primary)]">{value}</p>
    </div>
  </WindowCard>
);

const DashboardPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, loading, error, reload } = useApi(() => getDashboard(id!), [id]);

  if (error) {
    return (
      <EmptyState
        title="Gagal memuat dashboard"
        description={error.message}
        actionLabel="Coba lagi"
        onAction={reload}
      />
    );
  }

  const passRate =
    data && data.totals.passed + data.totals.failed > 0
      ? Math.round((data.totals.passed / (data.totals.passed + data.totals.failed)) * 100)
      : 0;
  const maxDay = data ? Math.max(1, ...data.last7Days.map((d) => d.runs)) : 1;

  return (
    <div>
      <header className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-sans font-extrabold text-xl tracking-tight">Dashboard</h1>
          <p className="font-mono text-xs text-[var(--color-text-secondary)]">
            Aktivitas tim 7 hari terakhir
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => navigate(`/app/workspaces/${id}`)}>
          Kembali
        </Button>
      </header>

      {loading && (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-5" aria-busy="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <div key={i} className="h-20 animate-pulse rounded-lg bg-[var(--color-surface-muted)]" />
          ))}
        </div>
      )}

      {data && (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-5">
            <Card label="Run" value={fmt(data.totals.runs)} />
            <Card label="Pass rate" value={`${passRate}%`} />
            <Card label="Gagal" value={fmt(data.totals.failed)} />
            <Card label="Script" value={fmt(data.totals.scripts)} />
            <Card label="Artifact" value={fmt(data.totals.artifacts)} />
          </div>

          <div className="mt-4">
            <WindowCard title="Run per hari (7 hari terakhir)">
              <div className="flex h-32 items-end gap-3">
                {data.last7Days.map((d) => (
                  <div key={d.date} className="flex flex-1 flex-col items-center gap-1">
                    <div
                      className="w-full rounded-t bg-[var(--color-primary)]/70"
                      style={{ height: `${(d.runs / maxDay) * 100}%`, minHeight: d.runs > 0 ? 4 : 1 }}
                      title={`${d.date}: ${d.runs} run, ${d.passed} lulus, ${d.failed} gagal`}
                    />
                    <span className="font-mono text-[10px] text-[var(--color-text-muted)]">
                      {d.date.slice(5)}
                    </span>
                  </div>
                ))}
              </div>
            </WindowCard>
          </div>

          <div className="mt-4">
            <WindowCard title="Run terbaru" noPadding>
              {data.recentRuns.length === 0 ? (
                <div className="p-4">
                  <EmptyState
                    title="Belum ada run"
                    description="Run dari Desktop akan muncul di sini setelah perangkat terhubung."
                  />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-[520px] w-full text-left text-sm">
                    <thead>
                      <tr className="border-b border-[var(--color-border)] font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]">
                        <th className="px-4 py-2">Run</th>
                        <th className="px-4 py-2">Status</th>
                        <th className="px-4 py-2">Lulus/Gagal</th>
                        <th className="px-4 py-2">Durasi</th>
                        <th className="px-4 py-2">Perangkat</th>
                      </tr>
                    </thead>
                    <tbody>
                      {data.recentRuns.map((r) => (
                        <tr key={r.id} className="border-b border-[var(--color-border)] last:border-0">
                          <td className="px-4 py-2 font-mono text-xs">{r.runRef}</td>
                          <td className="px-4 py-2">{r.status}</td>
                          <td className="px-4 py-2">
                            {r.passed}/{r.failed}
                          </td>
                          <td className="px-4 py-2 font-mono text-xs">
                            {r.durationMs != null ? `${r.durationMs} ms` : '-'}
                          </td>
                          <td className="px-4 py-2">{r.device ?? '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </WindowCard>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPage;
