import React from 'react';
import { Link } from 'react-router-dom';
import { FileCode2, Play, Users } from 'lucide-react';
import type { Organization, Workspace, WorkspaceSummary } from '../../../lib/api/types';
import { RoleBadge } from '../RoleBadge';
import { formatBytes } from './ScriptCard';
import { ProgressBar } from './ProgressBar';

type Props = {
  workspace: Workspace;
  /** `null` = ringkasan belum termuat / gagal; kartu menampilkan placeholder. */
  summary: WorkspaceSummary | null;
  loading?: boolean;
  /** Peran user di organisasi aktif; hanya OWNER/ADMIN bisa kelola (NFR-9, backend tetap penentu). */
  orgRole: Organization['role'] | null;
  onSettings: (workspace: Workspace) => void;
};

const Metric: React.FC<{ icon: React.ReactNode; label: string; value: number | null }> = ({
  icon,
  label,
  value,
}) => (
  <div className="flex items-center gap-1.5" title={label}>
    <span className="text-[var(--color-text-muted)]" aria-hidden="true">
      {icon}
    </span>
    <span className="font-mono text-xs text-[var(--color-text-primary)]">
      {value == null ? '—' : value.toLocaleString('id-ID')}
    </span>
    <span className="font-sans text-[10px] text-[var(--color-text-muted)]">{label}</span>
  </div>
);

/**
 * ponytail: fallback bila `GET /v1/workspaces/:id/summary` belum tersedia — kartu tetap
 * menampilkan data dasar (nama/slug) tanpa angka. Naik ke summary penuh saat endpoint rilis.
 */
export const WorkspaceCard: React.FC<Props> = ({ workspace, summary, loading, orgRole, onSettings }) => {
  const canManage = orgRole === 'OWNER' || orgRole === 'ADMIN';
  const runs = summary ? summary.totals.totalRuns ?? summary.runCount : null;

  return (
    <div className="flex flex-col rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] p-4 transition-colors hover:border-[var(--color-primary)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <Link
            to={`/app/workspaces/${workspace.id}`}
            className="block truncate font-sans text-sm font-bold text-[var(--color-text-primary)] hover:text-[var(--color-primary)] hover:underline"
          >
            {workspace.name}
          </Link>
          <p className="truncate font-mono text-[10px] text-[var(--color-text-muted)]">{workspace.slug}</p>
        </div>
        {orgRole && <RoleBadge role={orgRole} />}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        <Metric icon={<Users className="h-3.5 w-3.5" />} label="anggota" value={summary?.memberCount ?? null} />
        <Metric icon={<FileCode2 className="h-3.5 w-3.5" />} label="script" value={summary?.scriptCount ?? null} />
        <Metric icon={<Play className="h-3.5 w-3.5" />} label="run" value={runs} />
      </div>

      <div className="mt-4">
        {summary ? (
          <ProgressBar
            percent={
              summary.storageLimitBytes > 0
                ? (summary.storageUsedBytes / summary.storageLimitBytes) * 100
                : 0
            }
            label="Storage"
            hint={formatBytes(summary.storageUsedBytes)}
          />
        ) : (
          <p className="font-mono text-[10px] text-[var(--color-text-muted)]">
            {loading ? 'memuat storage…' : 'storage tidak tersedia'}
          </p>
        )}
      </div>

      <div className="mt-4 flex flex-wrap gap-2 border-t border-[var(--color-border)] pt-3">
        <Link
          to={`/app/workspaces/${workspace.id}/dashboard`}
          className="inline-flex items-center rounded-md border border-[var(--color-border)] px-2.5 py-1 font-sans text-xs font-bold text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]"
        >
          Buka Dashboard
        </Link>
        <Link
          to={`/app/workspaces/${workspace.id}?tab=members`}
          className="inline-flex items-center rounded-md border border-[var(--color-border)] px-2.5 py-1 font-sans text-xs font-bold text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]"
        >
          Anggota
        </Link>
        {canManage && (
          <button
            type="button"
            onClick={() => onSettings(workspace)}
            className="inline-flex items-center rounded-md border border-[var(--color-border)] px-2.5 py-1 font-sans text-xs font-bold text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]"
          >
            Settings
          </button>
        )}
      </div>
    </div>
  );
};
