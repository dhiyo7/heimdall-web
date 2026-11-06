import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../lib/auth/AuthContext';
import { useApi } from '../../../lib/useApi';
import { ApiError } from '../../../lib/api/client';
import {
  createWorkspace,
  deleteWorkspace,
  getWorkspaceSummary,
  listWorkspaceMembers,
  listWorkspaces,
} from '../../../lib/api/workspaces';
import { listScripts } from '../../../lib/api/scripts';
import type { Workspace, WorkspaceSummary } from '../../../lib/api/types';
import { Button } from '../../../components/ui/Button';
import { WindowCard } from '../../../components/ui/WindowCard';
import { ConfirmDialog } from '../ConfirmDialog';
import { EmptyState } from '../EmptyState';
import { useToast } from '../Toast';
import { WorkspaceCard } from '../components/WorkspaceCard';

const INPUT =
  'w-full h-10 px-3 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] font-sans text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)]';
const LABEL =
  'mb-2 font-mono text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]';

/**
 * ponytail: fallback sebelum `GET /v1/workspaces/:id/summary` tersedia — paralel hitung
 * anggota & script, field storage/totals dibiarkan 0. Ganti begitu endpoint rilis.
 */
async function loadSummary(id: string): Promise<WorkspaceSummary | null> {
  try {
    return await getWorkspaceSummary(id);
  } catch {
    try {
      const [members, scripts] = await Promise.all([listWorkspaceMembers(id), listScripts(id)]);
      return {
        memberCount: members.members.length,
        scriptCount: scripts.scripts.length,
        runCount: 0,
        storageUsedBytes: 0,
        storageLimitBytes: 0,
        totals: { totalRuns: 0, passCount: 0, failCount: 0, passRate: 0 },
      };
    } catch {
      return null;
    }
  }
}

const WorkspacesPage: React.FC = () => {
  const { activeOrg, role } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();
  const { data, loading, error, reload } = useApi(
    () => (activeOrg ? listWorkspaces(activeOrg.id) : Promise.resolve({ workspaces: [] })),
    [activeOrg?.id],
  );
  const canManage = role === 'OWNER' || role === 'ADMIN';
  const workspaces = data?.workspaces ?? [];

  const [summaries, setSummaries] = useState<Record<string, WorkspaceSummary | null>>({});
  const [summariesLoading, setSummariesLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (workspaces.length === 0) {
      setSummaries({});
      return;
    }
    setSummariesLoading(true);
    Promise.all(workspaces.map((w) => loadSummary(w.id).then((s) => [w.id, s] as const))).then(
      (entries) => {
        if (cancelled) return;
        setSummaries(Object.fromEntries(entries));
        setSummariesLoading(false);
      },
    );
    return () => {
      cancelled = true;
    };
  }, [workspaces]);

  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);
  const [toDelete, setToDelete] = useState<Workspace | null>(null);

  if (!activeOrg) return <EmptyState title="Belum punya organisasi" />;

  const close = () => {
    setOpen(false);
    setFormError('');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setFormError('Nama workspace wajib diisi.');
      return;
    }
    setBusy(true);
    setFormError('');
    try {
      await createWorkspace({ orgId: activeOrg.id, name: name.trim(), slug: slug.trim() || undefined });
      push('Workspace dibuat.');
      close();
      setName('');
      setSlug('');
      reload();
    } catch (err) {
      setFormError(
        err instanceof ApiError && err.status === 409
          ? 'Slug sudah dipakai di organisasi ini.'
          : err instanceof ApiError
            ? err.message
            : 'Gagal membuat workspace.',
      );
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    if (!toDelete) return;
    setBusy(true);
    try {
      await deleteWorkspace(toDelete.id);
      push('Workspace dihapus.');
      setToDelete(null);
      reload();
    } catch (err) {
      push(err instanceof ApiError ? err.message : 'Gagal menghapus workspace.', 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <header className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-sans text-xl font-extrabold tracking-tight">Workspace</h1>
          <p className="font-sans text-sm text-[var(--color-text-secondary)]">
            Pisahkan pekerjaan per tim atau per produk dalam satu organisasi.
          </p>
        </div>
        {canManage && (
          <Button variant="primary" size="sm" onClick={() => setOpen(true)}>
            + Buat Workspace
          </Button>
        )}
      </header>

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
      ) : loading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3" aria-busy="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-52 animate-pulse rounded-lg bg-[var(--color-surface-muted)]" />
          ))}
        </div>
      ) : workspaces.length === 0 ? (
        <EmptyState
          title="Belum ada workspace"
          description="Workspace memisahkan pekerjaan per tim atau per produk."
          actionLabel={canManage ? 'Buat workspace' : undefined}
          onAction={canManage ? () => setOpen(true) : undefined}
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {workspaces.map((w) => (
            <WorkspaceCard
              key={w.id}
              workspace={w}
              summary={summaries[w.id] ?? null}
              loading={summariesLoading}
              orgRole={role}
              onSettings={(ws) => navigate(`/app/workspaces/${ws.id}?tab=settings`)}
            />
          ))}
        </div>
      )}

      {open && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 px-4">
          <div role="dialog" aria-modal="true" aria-label="Buat workspace" className="w-full max-w-md">
            <WindowCard title="Buat workspace">
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label htmlFor="ws-name" className={LABEL}>
                    Nama
                  </label>
                  <input
                    id="ws-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={INPUT}
                    required
                    autoFocus
                  />
                </div>
                <div>
                  <label htmlFor="ws-slug" className={LABEL}>
                    Slug
                  </label>
                  <input
                    id="ws-slug"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value)}
                    placeholder="otomatis dari nama"
                    className={`${INPUT} font-mono`}
                  />
                </div>
                {formError && (
                  <p role="alert" className="font-sans text-xs text-[var(--color-danger)]">
                    {formError}
                  </p>
                )}
                <div className="flex justify-end gap-2">
                  <Button type="button" variant="secondary" size="sm" onClick={close} disabled={busy}>
                    Batal
                  </Button>
                  <Button type="submit" variant="primary" size="sm" disabled={busy}>
                    {busy ? 'Menyimpan…' : 'Buat'}
                  </Button>
                </div>
              </form>
            </WindowCard>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!toDelete}
        title="Hapus workspace?"
        description={`Workspace "${toDelete?.name ?? ''}" akan dihapus dan isi workspace ikut terhapus.`}
        confirmLabel="Hapus"
        busy={busy}
        onConfirm={remove}
        onClose={() => setToDelete(null)}
      />
    </>
  );
};

export default WorkspacesPage;
