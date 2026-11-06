import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Activity, HardDrive, ListChecks, MonitorSmartphone, Play, XCircle } from 'lucide-react';
import { useAuth } from '../../../lib/auth/AuthContext';
import { useApi } from '../../../lib/useApi';
import { getDashboard } from '../../../lib/api/dashboard';
import { getWorkspaceSummary, listWorkspaces } from '../../../lib/api/workspaces';
import type { WorkspaceSummary } from '../../../lib/api/types';
import { listDevices } from '../../../lib/api/devices';
import { Button } from '../../../components/ui/Button';
import { WindowCard } from '../../../components/ui/WindowCard';
import { EmptyState } from '../EmptyState';
import { StatCard, type StatCardTone } from '../components/StatCard';
import { TrendChart, type TrendDay } from '../components/TrendChart';
import { RecentRunsList } from '../components/RecentRunsList';
import { ProgressBar, toneFromPercent, formatBytes as fmtBytes } from '../components/ProgressBar';

const fmt = (n: number) => new Intl.NumberFormat('id-ID').format(n);

const passRateTone = (rate: number): StatCardTone =>
  rate >= 90 ? 'success' : rate >= 70 ? 'warning' : 'danger';

const passRate = (passed: number, failed: number) =>
  passed + failed > 0 ? Math.round((passed / (passed + failed)) * 100) : 0;

/** Blok error seragam dengan tombol coba lagi (NFR-8). */
const ErrorBlock: React.FC<{ message: string; onRetry: () => void }> = ({ message, onRetry }) => (
  <div
    role="alert"
    className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--color-danger)]/40 bg-[var(--color-danger)]/10 px-4 py-3"
  >
    <p className="font-sans text-sm text-[var(--color-danger)]">{message}</p>
    <Button variant="secondary" size="sm" onClick={onRetry}>
      Coba lagi
    </Button>
  </div>
);

const LoadingBlock: React.FC<{ rows?: number }> = ({ rows = 3 }) => (
  <div className="space-y-2" aria-busy="true">
    {Array.from({ length: rows }).map((_, i) => (
      <div key={i} className="h-12 animate-pulse rounded-lg bg-[var(--color-surface-muted)]" />
    ))}
  </div>
);

/** Blok kuota storage dengan ambang warning/danger + label teks dan CTA upgrade. */
const StorageQuota: React.FC<{ used: number; limit: number }> = ({ used, limit }) => {
  const percent = limit > 0 ? (used / limit) * 100 : 0;
  const tone = toneFromPercent(percent);
  return (
    <div className="space-y-3">
      <ProgressBar
        percent={percent}
        tone={tone}
        hint={`${fmtBytes(used)} / ${fmtBytes(limit)}`}
        note={tone === 'danger' ? 'Storage penuh.' : tone === 'warning' ? 'Hampir penuh.' : undefined}
      />
      <p className="font-sans text-xs text-[var(--color-text-muted)]">
        Kuota {fmtBytes(limit)} (limit global). Terpakai {Math.round(percent)}%.
      </p>
      {tone === 'danger' && (
        <Button variant="secondary" size="sm" disabled title="Upgrade segera tersedia">
          Upgrade storage
        </Button>
      )}
    </div>
  );
};

const OverviewPage: React.FC = () => {
  const { activeOrg, role } = useAuth();
  const navigate = useNavigate();
  const orgId = activeOrg?.id;

  // Daftar workspace org aktif — menentukan workspace "utama" untuk KPI & tren.
  const ws = useApi(() => (orgId ? listWorkspaces(orgId) : Promise.resolve(null)), [orgId]);
  const workspaces = ws.data?.workspaces ?? [];
  const primaryId = workspaces[0]?.id;
  const primaryName = workspaces[0]?.name;

  const summary = useApi(
    () => (primaryId ? getWorkspaceSummary(primaryId) : Promise.resolve(null)),
    [primaryId],
  );
  const dashboard = useApi(
    () => (primaryId ? getDashboard(primaryId) : Promise.resolve(null)),
    [primaryId],
  );
  const devices = useApi(() => listDevices(), []);

  if (!activeOrg) {
    return (
      <EmptyState
        title="Belum punya organisasi"
        description="Buat organisasi dulu untuk mulai memakai console."
      />
    );
  }

  const retryAll = () => {
    ws.reload();
    summary.reload();
    dashboard.reload();
    devices.reload();
  };

  const activeDevices = (devices.data?.devices ?? []).filter((d) => d.orgId === activeOrg.id)
    .length;

  const renderKpi = () => {
    if (ws.loading || summary.loading || devices.loading) return <LoadingBlock rows={2} />;
    if (ws.error) return <ErrorBlock message={ws.error.message} onRetry={retryAll} />;

    if (workspaces.length === 0) {
      return (
        <EmptyState
          title="Belum ada workspace"
          description="Workspace memisahkan pengujian per produk atau tim. Buat yang pertama untuk melihat KPI."
          actionLabel="Buat workspace pertama"
          onAction={() => navigate('/app/workspaces')}
        />
      );
    }

    // KPI tetap tampil (0) walau summary/dashboard gagal — angka nol bukan nol palsu,
    // hanya penanda "belum terhitung"; blok tren & run yang menampilkan galatnya.
    const s: WorkspaceSummary | null = summary.data;
    const d = dashboard.data;

    const totalRuns = s?.totals.totalRuns ?? d?.totals.runs ?? 0;
    const failCount = s?.totals.failCount ?? d?.totals.failed ?? 0;
    const passCount = s?.totals.passCount ?? d?.totals.passed ?? 0;
    const rate = s ? Math.round(s.totals.passRate) : passRate(passCount, failCount);
    const scriptCount = s?.scriptCount ?? d?.totals.scripts ?? 0;
    const storagePercent =
      s && s.storageLimitBytes > 0 ? (s.storageUsedBytes / s.storageLimitBytes) * 100 : 0;

    const storageCaption =
      s && s.storageLimitBytes > 0
        ? `${fmtBytes(s.storageUsedBytes)} dari ${fmtBytes(s.storageLimitBytes)}`
        : 'Belum ada data kuota';

    return (
      <div>
        {summary.error && (
          <div className="mb-3">
            <ErrorBlock message={`Ringkasan kuota gagal dimuat: ${summary.error.message}`} onRetry={summary.reload} />
          </div>
        )}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <StatCard
            title="Total run"
            label="Total run"
            value={fmt(totalRuns)}
            icon={<Play size={14} />}
          />
          <StatCard
            title="Pass rate"
            label="Pass rate"
            value={`${rate}%`}
            variant="percent"
            tone={passRateTone(rate)}
            caption={
              rate >= 90 ? 'Sehat (≥90%)' : rate >= 70 ? 'Perlu perhatian (70–89%)' : 'Kritis (<70%)'
            }
            icon={<Activity size={14} />}
          />
          <StatCard
            title="Gagal"
            label="Gagal"
            value={fmt(failCount)}
            tone={failCount > 0 ? 'danger' : 'default'}
            icon={<XCircle size={14} />}
          />
          <StatCard
            title="Script"
            label="Jumlah script"
            value={fmt(scriptCount)}
            icon={<ListChecks size={14} />}
          />
          <StatCard
            title="Perangkat aktif"
            label="Device aktif"
            value={fmt(activeDevices)}
            icon={<MonitorSmartphone size={14} />}
          />
          <StatCard
            title="Storage terpakai"
            label="Storage terpakai"
            value={storageCaption}
            variant="progress"
            progressPercent={storagePercent}
            icon={<HardDrive size={14} />}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-sans text-xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
            Overview
          </h1>
          <p className="mt-0.5 font-mono text-xs text-[var(--color-text-muted)]">
            {activeOrg.name}
            {primaryName ? ` • ${primaryName}` : ''}
          </p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => navigate('/app/workspaces')}>
          Kelola workspace
        </Button>
      </div>

      {renderKpi()}

      {workspaces.length > 0 && (
        <WindowCard title="Tren 7 hari (pass rate)">
          {dashboard.loading ? (
            <LoadingBlock rows={3} />
          ) : dashboard.error ? (
            <ErrorBlock message={dashboard.error.message} onRetry={dashboard.reload} />
          ) : dashboard.data && dashboard.data.last7Days.length > 0 ? (
            <TrendChart
              data={dashboard.data.last7Days.map<TrendDay>((d) => ({
                date: d.date,
                passRate: passRate(d.passed, d.failed),
                total: d.runs,
              }))}
            />
          ) : (
            <EmptyState
              title="Belum ada run"
              description="Belum ada run — jalankan skenario dari Desktop."
            />
          )}
        </WindowCard>
      )}

      {workspaces.length > 0 && (
        <WindowCard title="Run terbaru" noPadding>
          <div className="p-4">
            {dashboard.loading ? (
              <LoadingBlock rows={4} />
            ) : dashboard.error ? (
              <ErrorBlock message={dashboard.error.message} onRetry={dashboard.reload} />
            ) : dashboard.data && dashboard.data.recentRuns.length > 0 ? (
              <RecentRunsList runs={dashboard.data.recentRuns} />
            ) : (
              <EmptyState
                title="Belum ada run"
                description="Belum ada run — jalankan skenario dari Desktop."
              />
            )}
          </div>
        </WindowCard>
      )}

      {workspaces.length > 0 && summary.data && summary.data.storageLimitBytes > 0 && (
        <WindowCard title="Kuota storage">
          <StorageQuota
            used={summary.data.storageUsedBytes}
            limit={summary.data.storageLimitBytes}
          />
        </WindowCard>
      )}

      <WindowCard title="Aksi cepat">
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" size="sm" onClick={() => navigate('/app/workspaces')}>
            Buat workspace
          </Button>
          {role !== 'MEMBER' && (
            <Button variant="secondary" size="sm" onClick={() => navigate('/app/invitations')}>
              Undang anggota
            </Button>
          )}
          <Button variant="secondary" size="sm" onClick={() => navigate('/app/devices')}>
            Tautkan perangkat
          </Button>
        </div>
      </WindowCard>
    </div>
  );
};

export default OverviewPage;
