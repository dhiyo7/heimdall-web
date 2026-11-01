import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { RequireRole, useAuth } from '../../../lib/auth/AuthContext';
import { ApiError } from '../../../lib/api/client';
import { deleteOrganization, updateOrganization } from '../../../lib/api/organizations';
import { Button } from '../../../components/ui/Button';
import { WindowCard } from '../../../components/ui/WindowCard';
import { ConfirmDialog } from '../ConfirmDialog';
import { EmptyState } from '../EmptyState';
import { useToast } from '../Toast';

const INPUT =
  'w-full h-10 px-3 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] font-sans text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)]';
const LABEL =
  'mb-2 font-mono text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]';

const SettingsContent: React.FC = () => {
  const { activeOrg, role, reloadOrgs } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);
  const [confirmSlug, setConfirmSlug] = useState('');
  const [askDelete, setAskDelete] = useState(false);

  useEffect(() => {
    if (activeOrg) {
      setName(activeOrg.name);
      setSlug(activeOrg.slug);
    }
  }, [activeOrg]);

  if (!activeOrg) return <EmptyState title="Belum punya organisasi" />;

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setFormError('');
    try {
      await updateOrganization(activeOrg.id, { name: name.trim(), slug: slug.trim() });
      push('Organisasi diperbarui.');
      await reloadOrgs();
    } catch (err) {
      setFormError(
        err instanceof ApiError && err.status === 409
          ? 'Slug sudah dipakai di organisasi lain.'
          : err instanceof ApiError
            ? err.message
            : 'Gagal menyimpan organisasi.',
      );
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await deleteOrganization(activeOrg.id);
      push('Organisasi dihapus.');
      await reloadOrgs();
      navigate('/app');
    } catch (err) {
      push(err instanceof ApiError ? err.message : 'Gagal menghapus organisasi.', 'error');
      setBusy(false);
    }
  };

  return (
    <>
      <header className="mb-4">
        <h1 className="font-sans font-extrabold text-xl tracking-tight">Pengaturan</h1>
        <p className="font-sans text-sm text-[var(--color-text-secondary)]">
          Kelola identitas organisasi aktif.
        </p>
      </header>

      <WindowCard title="Organisasi">
        <form onSubmit={save} className="space-y-4">
          <div>
            <label htmlFor="org-name" className={LABEL}>
              Nama
            </label>
            <input
              id="org-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={INPUT}
              required
            />
          </div>
          <div>
            <label htmlFor="org-slug" className={LABEL}>
              Slug
            </label>
            <input
              id="org-slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              className={`${INPUT} font-mono`}
              required
            />
          </div>
          {formError && (
            <p role="alert" className="font-sans text-xs text-[var(--color-danger)]">
              {formError}
            </p>
          )}
          <div className="flex justify-end">
            <Button type="submit" variant="primary" size="sm" disabled={busy}>
              {busy ? 'Menyimpan…' : 'Simpan'}
            </Button>
          </div>
        </form>
      </WindowCard>

      <WindowCard title="Langganan & Pembayaran" className="mt-4">
        <p className="font-sans text-sm text-[var(--color-text-secondary)]">
          Langganan &amp; pembayaran belum tersedia.
        </p>
        <span className="mt-2 inline-block rounded-md border border-[var(--color-border)] px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
          SEGERA (SPEC-16)
        </span>
      </WindowCard>

      {role === 'OWNER' && (
        <WindowCard title="Zona berbahaya" className="mt-4 !border-[var(--color-danger)]/40">
          <p className="font-sans text-sm text-[var(--color-text-secondary)]">
            Menghapus organisasi akan menghapus seluruh workspace, anggota, dan data di dalamnya
            secara permanen.
          </p>
          <div className="mt-4 max-w-md">
            <label htmlFor="org-confirm" className={LABEL}>
              Ketik {activeOrg.slug} untuk konfirmasi
            </label>
            <input
              id="org-confirm"
              value={confirmSlug}
              onChange={(e) => setConfirmSlug(e.target.value)}
              className={`${INPUT} font-mono`}
              autoComplete="off"
            />
          </div>
          <Button
            variant="primary"
            size="sm"
            className="mt-3 !bg-[var(--color-danger)] !border-[var(--color-danger)]"
            disabled={confirmSlug !== activeOrg.slug || busy}
            onClick={() => setAskDelete(true)}
          >
            Hapus organisasi
          </Button>
        </WindowCard>
      )}

      <ConfirmDialog
        open={askDelete}
        title="Hapus organisasi?"
        description={`Organisasi ${activeOrg.name} beserta seluruh workspace dan anggotanya akan dihapus permanen.`}
        confirmLabel="Hapus"
        busy={busy}
        onConfirm={remove}
        onClose={() => setAskDelete(false)}
      />
    </>
  );
};

const SettingsPage: React.FC = () => {
  const { role } = useAuth();
  if (role === 'MEMBER') {
    return (
      <RequireRole roles={['OWNER', 'ADMIN']}>
        <SettingsContent />
      </RequireRole>
    );
  }
  return <SettingsContent />;
};

export default SettingsPage;
