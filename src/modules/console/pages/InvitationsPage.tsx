import React, { useState } from 'react';
import { useAuth, RequireRole } from '../../../lib/auth/AuthContext';
import { useApi } from '../../../lib/useApi';
import { ApiError } from '../../../lib/api/client';
import {
  cancelInvitation,
  createInvitation,
  listInvitations,
} from '../../../lib/api/memberships';
import type { CreatedInvitation, Invitation, Role } from '../../../lib/api/types';
import { Button } from '../../../components/ui/Button';
import { WindowCard } from '../../../components/ui/WindowCard';
import { ConfirmDialog } from '../ConfirmDialog';
import { DataTable, type Column } from '../DataTable';
import { EmptyState } from '../EmptyState';
import { RoleBadge } from '../RoleBadge';
import { useToast } from '../Toast';

const INPUT =
  'w-full h-10 px-3 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] font-sans text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)]';
const LABEL =
  'mb-2 font-mono text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]';

const InvitationsContent: React.FC = () => {
  const { activeOrg } = useAuth();
  const { push } = useToast();
  const { data, loading, error, reload } = useApi(
    () => (activeOrg ? listInvitations(activeOrg.id) : Promise.resolve({ invitations: [] })),
    [activeOrg?.id],
  );

  const [email, setEmail] = useState('');
  const [inviteRole, setInviteRole] = useState<Role>('MEMBER');
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);
  const [created, setCreated] = useState<CreatedInvitation | null>(null);
  const [toCancel, setToCancel] = useState<Invitation | null>(null);

  if (!activeOrg) return <EmptyState title="Belum punya organisasi" />;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setFormError('');
    try {
      const { invitation } = await createInvitation(activeOrg.id, {
        email: email.trim(),
        role: inviteRole,
      });
      setCreated(invitation);
      setEmail('');
      push('Undangan dikirim.');
      reload();
    } catch (err) {
      if (err instanceof ApiError && err.status === 409) {
        setFormError('Email tersebut sudah menjadi anggota.');
      } else if (err instanceof ApiError && err.status === 400) {
        setFormError(err.details.map((d) => d.message).join(' ') || err.message);
      } else {
        setFormError(err instanceof ApiError ? err.message : 'Gagal mengirim undangan.');
      }
    } finally {
      setBusy(false);
    }
  };

  const copy = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url);
      push('Tautan disalin.');
    } catch {
      push('Gagal menyalin tautan.', 'error');
    }
  };

  const cancel = async () => {
    if (!toCancel) return;
    setBusy(true);
    try {
      await cancelInvitation(activeOrg.id, toCancel.id);
      push('Undangan dibatalkan.');
      setToCancel(null);
      reload();
    } catch (err) {
      push(err instanceof ApiError ? err.message : 'Gagal membatalkan undangan.', 'error');
    } finally {
      setBusy(false);
    }
  };

  const columns: Column<Invitation>[] = [
    { key: 'email', label: 'Email', mono: true },
    { key: 'role', label: 'Peran', render: (i) => <RoleBadge role={i.role} /> },
    {
      key: 'expiresAt',
      label: 'Kedaluwarsa',
      render: (i) => new Date(i.expiresAt).toLocaleDateString('id-ID'),
    },
    {
      key: 'actions',
      label: 'Aksi',
      render: (i) => (
        <Button variant="tertiary" size="sm" onClick={() => setToCancel(i)}>
          Batalkan
        </Button>
      ),
    },
  ];

  return (
    <>
      <header className="mb-4">
        <h1 className="font-sans font-extrabold text-xl tracking-tight">Undangan</h1>
        <p className="font-sans text-sm text-[var(--color-text-secondary)]">
          Undang rekan bergabung ke organisasi aktif.
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-[380px_1fr]">
        <WindowCard title="Buat undangan">
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label htmlFor="inv-email" className={LABEL}>
                Email
              </label>
              <input
                id="inv-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={INPUT}
                required
              />
            </div>
            <div>
              <label htmlFor="inv-role" className={LABEL}>
                Peran
              </label>
              <select
                id="inv-role"
                value={inviteRole}
                onChange={(e) => setInviteRole(e.target.value as Role)}
                className={`${INPUT} font-mono`}
              >
                <option value="ADMIN">ADMIN</option>
                <option value="MEMBER">MEMBER</option>
              </select>
            </div>
            {formError && (
              <p role="alert" className="font-sans text-xs text-[var(--color-danger)]">
                {formError}
              </p>
            )}
            <Button type="submit" variant="primary" size="sm" disabled={busy}>
              {busy ? 'Mengirim…' : 'Kirim undangan'}
            </Button>
          </form>

          {created && (
            <div className="mt-4 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-3">
              <p className={LABEL}>Tautan undangan</p>
              <p className="break-all font-mono text-xs text-[var(--color-text-primary)]">
                {created.acceptUrl}
              </p>
              <Button
                variant="secondary"
                size="sm"
                className="mt-3"
                onClick={() => void copy(created.acceptUrl)}
              >
                Salin tautan
              </Button>
            </div>
          )}
        </WindowCard>

        <WindowCard title="Daftar undangan" noPadding>
          <div className="p-4">
            {error && (
              <p role="alert" className="mb-3 font-sans text-xs text-[var(--color-danger)]">
                {error.message}
              </p>
            )}
            <DataTable
              columns={columns}
              rows={data?.invitations ?? []}
              rowKey={(i) => i.id}
              loading={loading}
              empty={
                <EmptyState
                  title="Tidak ada undangan menunggu"
                  description="Undangan kedaluwarsa dalam 7 hari."
                />
              }
            />
          </div>
        </WindowCard>
      </div>

      <ConfirmDialog
        open={!!toCancel}
        title="Batalkan undangan?"
        description={`Undangan untuk ${toCancel?.email ?? ''} tidak bisa dipakai lagi.`}
        confirmLabel="Batalkan"
        busy={busy}
        onConfirm={cancel}
        onClose={() => setToCancel(null)}
      />
    </>
  );
};

const InvitationsPage: React.FC = () => {
  const { role } = useAuth();
  if (role === 'MEMBER') {
    return (
      <RequireRole roles={['OWNER', 'ADMIN']}>
        <InvitationsContent />
      </RequireRole>
    );
  }
  return <InvitationsContent />;
};

export default InvitationsPage;
