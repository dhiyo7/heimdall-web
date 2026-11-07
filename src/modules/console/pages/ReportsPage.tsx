import React, { useState } from 'react';
import { FileBarChart } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { RunStatusBadge, formatDuration } from '../../../components/ui/RunStatusBadge';
import { WindowCard } from '../../../components/ui/WindowCard';
import { ApiError } from '../../../lib/api/client';
import { listReports, publishReport, unpublishReport } from '../../../lib/api/reports';
import type { ReportListItem } from '../../../lib/api/types';
import { useActiveWorkspace } from '../../../lib/useActiveWorkspace';
import { useApi } from '../../../lib/useApi';
import { DataTable, type Column } from '../DataTable';
import { EmptyState } from '../EmptyState';
import { useToast } from '../Toast';

const INPUT =
  'w-full h-10 px-3 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] font-sans text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)]';
const SELECT = `${INPUT} cursor-pointer`;
const LABEL =
  'mb-2 block font-mono text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]';

const asMessage = (err: unknown, fallback: string) =>
  err instanceof ApiError ? err.message : fallback;

const ReportsPage: React.FC = () => {
  const { push } = useToast();
  const active = useActiveWorkspace();
  const { data, loading, error, reload } = useApi(
    () => (active.workspaceId ? listReports(active.workspaceId) : Promise.resolve({ items: [] })),
    [active.workspaceId],
  );

  const [busyRun, setBusyRun] = useState<string | null>(null);
  // SPEC-34: run yang sedang diisi opsinya + toggle & password opsional.
  const [protectRun, setProtectRun] = useState<string | null>(null);
  const [protect, setProtect] = useState(false);
  const [password, setPassword] = useState('');

  if (active.loading) {
    return <p className="font-mono text-sm text-[var(--color-text-muted)]">memuat workspace…</p>;
  }

  if (active.error) {
    return (
      <EmptyState
        title="Gagal memuat workspace"
        description={active.error.message}
        actionLabel="Coba lagi"
        onAction={active.reload}
      />
    );
  }

  if (!active.workspaceId) {
    return (
      <EmptyState
        title="Belum ada workspace"
        description="Buat workspace terlebih dahulu di menu Workspace sebelum membagikan laporan."
      />
    );
  }

  const publish = async (item: ReportListItem) => {
    setBusyRun(item.id);
    try {
      await publishReport(item.id, protect && password ? { password } : {});
      push('Laporan dipublikasikan.');
      setProtectRun(null);
      setProtect(false);
      setPassword('');
      reload();
    } catch (err) {
      push(asMessage(err, 'Gagal mempublikasikan laporan.'), 'error');
    } finally {
      setBusyRun(null);
    }
  };

  const unpublish = async (item: ReportListItem) => {
    if (!item.report) return;
    setBusyRun(item.id);
    try {
      await unpublishReport(item.report.id);
      push('Publikasi ditarik.');
      reload();
    } catch (err) {
      push(asMessage(err, 'Gagal menarik publikasi.'), 'error');
    } finally {
      setBusyRun(null);
    }
  };

  const copy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      push('Tautan disalin.');
    } catch {
      push('Gagal menyalin. Salin tautan secara manual.', 'error');
    }
  };

  const columns: Column<ReportListItem>[] = [
    {
      key: 'runRef',
      label: 'Run',
      mono: true,
      render: (r) => (
        <span className="font-semibold text-[var(--color-text-primary)]">{r.runRef}</span>
      ),
    },
    {
      key: 'status',
      label: 'Status',
      render: (r) => <RunStatusBadge status={r.status} />,
    },
    {
      key: 'counts',
      label: 'Lulus / Gagal',
      mono: true,
      render: (r) => `${r.passed} / ${r.failed}`,
    },
    {
      key: 'durationMs',
      label: 'Durasi',
      mono: true,
      render: (r) => formatDuration(r.durationMs),
    },
    {
      key: 'device',
      label: 'Perangkat',
      render: (r) => r.device ?? '—',
    },
    {
      key: 'time',
      label: 'Waktu',
      mono: true,
      render: (r) => new Date(r.createdAt).toLocaleString('id-ID'),
    },
    {
      key: 'actions',
      label: 'Aksi',
      render: (r) => {
        const report = r.report;
        if (report?.isPublished && report.shareToken) {
          const shareUrl = `${window.location.origin}/r/${report.shareToken}`;
          return (
            <div className="flex flex-col gap-1">
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center rounded-md border border-[var(--color-success)]/40 bg-[var(--color-success)]/10 px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--color-success)]">
                  Publik
                </span>
                {report.hasPassword && (
                  <span
                    title="Dilindungi password"
                    className="inline-flex items-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-0.5 font-mono text-[10px] font-semibold text-[var(--color-text-muted)]"
                  >
                    🔒 Password
                  </span>
                )}
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => copy(shareUrl)}
                >
                  Salin tautan
                </Button>
                <Button
                  variant="tertiary"
                  size="sm"
                  onClick={() => unpublish(r)}
                  disabled={busyRun === r.id}
                >
                  {busyRun === r.id ? 'Menarik…' : 'Tarik'}
                </Button>
              </div>
              <a
                href={shareUrl}
                target="_blank"
                rel="noreferrer"
                className="break-all font-mono text-[10px] text-[var(--color-primary)] hover:underline"
              >
                {shareUrl}
              </a>
              {report.expiresAt && (
                <span className="font-mono text-[10px] text-[var(--color-text-muted)]">
                  Kedaluwarsa {new Date(report.expiresAt).toLocaleDateString('id-ID')}
                </span>
              )}
            </div>
          );
        }
        // SPEC-34: opsi lindungi password sebelum publikasi.
        if (protectRun === r.id) {
          return (
            <div className="flex flex-col gap-2">
              <label className="flex items-center gap-2 font-sans text-xs text-[var(--color-text-secondary)]">
                <input type="checkbox" checked={protect} onChange={(e) => setProtect(e.target.checked)} />
                Lindungi dengan password
              </label>
              {protect && (
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="min 6 karakter"
                  autoFocus
                  className={INPUT}
                />
              )}
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => publish(r)}
                  disabled={busyRun === r.id || (protect && password.length < 6)}
                >
                  {busyRun === r.id ? 'Mempublikasikan…' : 'Publikasikan'}
                </Button>
                <Button
                  variant="tertiary"
                  size="sm"
                  onClick={() => {
                    setProtectRun(null);
                    setProtect(false);
                    setPassword('');
                  }}
                  disabled={busyRun === r.id}
                >
                  Batal
                </Button>
              </div>
            </div>
          );
        }
        return (
          <Button
            variant="primary"
            size="sm"
            onClick={() => {
              setProtectRun(r.id);
              setProtect(false);
              setPassword('');
            }}
            disabled={busyRun === r.id}
          >
            {busyRun === r.id ? 'Mempublikasikan…' : 'Publikasikan'}
          </Button>
        );
      },
    },
  ];

  return (
    <div className="space-y-4">
      <header>
        <h1 className="font-sans text-xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
          Laporan
        </h1>
        <p className="mt-1 max-w-2xl font-sans text-sm text-[var(--color-text-secondary)]">
          Publikasikan hasil pengujian sebagai tautan yang bisa dibuka tanpa login.
        </p>
      </header>

      <div className="max-w-sm">
        <label htmlFor="report-workspace" className={LABEL}>
          Workspace
        </label>
        <select
          id="report-workspace"
          value={active.workspaceId}
          onChange={(e) => active.setWorkspaceId(e.target.value)}
          className={SELECT}
        >
          {active.workspaces.map((w) => (
            <option key={w.id} value={w.id}>
              {w.name}
            </option>
          ))}
        </select>
      </div>

      {error ? (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--color-danger)]/40 bg-[var(--color-danger)]/10 px-4 py-3"
        >
          <p className="font-sans text-sm text-[var(--color-danger)]">{error.message}</p>
          <Button variant="secondary" size="sm" onClick={reload}>
            Coba lagi
          </Button>
        </div>
      ) : (
        <WindowCard title="Daftar run" contentClassName="p-2">
          <DataTable
            columns={columns}
            rows={data?.items ?? []}
            rowKey={(r) => r.id}
            loading={loading}
            empty={
              <EmptyState
                icon={<FileBarChart className="h-6 w-6" aria-hidden="true" />}
                title="Belum ada run"
                description="Run akan muncul setelah aplikasi Desktop mengunggah hasil pengujian ke cloud."
              />
            }
          />
        </WindowCard>
      )}
    </div>
  );
};

export default ReportsPage;
