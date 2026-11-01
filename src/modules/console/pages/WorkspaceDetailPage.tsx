import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../../../lib/auth/AuthContext';
import { useApi } from '../../../lib/useApi';
import { ApiError } from '../../../lib/api/client';
import { deleteWorkspace, getWorkspace, updateWorkspace } from '../../../lib/api/workspaces';
import { Button } from '../../../components/ui/Button';
import { WindowCard } from '../../../components/ui/WindowCard';
import { ConfirmDialog } from '../ConfirmDialog';
import { EmptyState } from '../EmptyState';
import { useToast } from '../Toast';

const INPUT =
  'w-full h-10 px-3 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] font-sans text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] disabled:opacity-60';
const LABEL =
  'mb-2 font-mono text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]';

const WorkspaceDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role } = useAuth();
  const { push } = useToast();
  const { data, loading, error, reload } = useApi(() => getWorkspace(id!), [id]);
  const canManage = role === 'OWNER' || role === 'ADMIN';

  const workspace = data?.workspace ?? null;
  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);
  const [askDelete, setAskDelete] = useState(false);

  useEffect(() => {
    if (workspace) {
      setName(workspace.name);
      setSlug(workspace.slug);
    }
  }, [workspace]);

  if (loading) {
    return (
      <p className="font-mono text-sm text-[var(--color-text-muted)]">memuat workspace…</p>
    );
  }

  if (error || !workspace) {
    return (
      <EmptyState
        title={error?.status === 404 ? 'Workspace tidak ditemukan' : 'Gagal memuat workspace'}
        description={error?.message}
        actionLabel="Kembali ke daftar"
        onAction={() => navigate('/app/workspaces')}
      />
    );
  }

  const dirty = name !== workspace.name || slug !== workspace.slug;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setFormError('');
    try {
      await updateWorkspace(workspace.id, { name: name.trim(), slug: slug.trim() });
      push('Workspace diperbarui.');
      reload();
    } catch (err) {
      setFormError(
        err instanceof ApiError && err.status === 409
          ? 'Slug sudah dipakai di organisasi ini.'
          : err instanceof ApiError
            ? err.message
            : 'Gagal menyimpan workspace.',
      );
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await deleteWorkspace(workspace.id);
      push('Workspace dihapus.');
      navigate('/app/workspaces');
    } catch (err) {
      push(err instanceof ApiError ? err.message : 'Gagal menghapus workspace.', 'error');
      setBusy(false);
    }
  };

  return (
    <>
      <header className="mb-4 flex items-start justify-between gap-4">
        <div>
          <h1 className="font-sans font-extrabold text-xl tracking-tight">{workspace.name}</h1>
          <p className="font-mono text-xs text-[var(--color-text-secondary)]">{workspace.slug}</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => navigate('/app/workspaces')}>
          Kembali
        </Button>
      </header>

      <WindowCard title="workspace.detail">
        <form onSubmit={save} className="space-y-4">
          <div>
            <label htmlFor="wd-name" className={LABEL}>
              Nama
            </label>
            <input
              id="wd-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={INPUT}
              disabled={!canManage}
              required
            />
          </div>
          <div>
            <label htmlFor="wd-slug" className={LABEL}>
              Slug
            </label>
            <input
              id="wd-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className={`${INPUT} font-mono`}
              disabled={!canManage}
              required
            />
          </div>
          {formError && (
            <p role="alert" className="font-sans text-xs text-[var(--color-danger)]">
              {formError}
            </p>
          )}
          {canManage && (
            <div className="flex justify-end">
              <Button type="submit" variant="primary" size="sm" disabled={!dirty || busy}>
                {busy ? 'Menyimpan…' : 'Simpan'}
              </Button>
            </div>
          )}
        </form>
      </WindowCard>

      {canManage && (
        <WindowCard title="workspace.danger" className="mt-4 !border-[var(--color-danger)]/40">
          <p className="font-sans text-sm text-[var(--color-text-secondary)]">
            Menghapus workspace akan menghapus seluruh isinya secara permanen. Tindakan ini tidak
            bisa dibatalkan.
          </p>
          <Button
            variant="primary"
            size="sm"
            className="mt-3 !bg-[var(--color-danger)] !border-[var(--color-danger)]"
            onClick={() => setAskDelete(true)}
          >
            Hapus workspace
          </Button>
        </WindowCard>
      )}

      <ConfirmDialog
        open={askDelete}
        title="Hapus workspace?"
        description={`Workspace "${workspace.name}" akan dihapus dan isi workspace ikut terhapus.`}
        confirmLabel="Hapus"
        busy={busy}
        onConfirm={remove}
        onClose={() => setAskDelete(false)}
      />
    </>
  );
};

export default WorkspaceDetailPage;
