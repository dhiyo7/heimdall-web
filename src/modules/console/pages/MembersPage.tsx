import React, { useState } from 'react';
import { useAuth } from '../../../lib/auth/AuthContext';
import { useApi } from '../../../lib/useApi';
import { ApiError } from '../../../lib/api/client';
import { listMembers, removeMember, updateMemberRole } from '../../../lib/api/memberships';
import type { Member, Role } from '../../../lib/api/types';
import { Button } from '../../../components/ui/Button';
import { WindowCard } from '../../../components/ui/WindowCard';
import { ConfirmDialog } from '../ConfirmDialog';
import { DataTable, type Column } from '../DataTable';
import { EmptyState } from '../EmptyState';
import { RoleBadge } from '../RoleBadge';
import { useToast } from '../Toast';

// ponytail: teks console masih hardcode Indonesia (belum lewat I18nContext).
// Pindahkan ke kunci i18n saat console resmi ditawarkan multi-bahasa.
const MembersPage: React.FC = () => {
  const { activeOrg, role, user } = useAuth();
  const { push } = useToast();
  const { data, loading, error, reload } = useApi(
    () => (activeOrg ? listMembers(activeOrg.id) : Promise.resolve({ members: [] })),
    [activeOrg?.id],
  );
  const canManage = role === 'OWNER' || role === 'ADMIN';
  const [busy, setBusy] = useState(false);
  const [toRemove, setToRemove] = useState<Member | null>(null);

  if (!activeOrg) return <EmptyState title="Belum punya organisasi" />;

  const changeRole = async (member: Member, next: Role) => {
    try {
      await updateMemberRole(activeOrg.id, member.userId, next);
      push('Peran anggota diperbarui.');
      reload();
    } catch (err) {
      push(err instanceof ApiError ? err.message : 'Gagal mengubah peran.', 'error');
    }
  };

  const remove = async () => {
    if (!toRemove) return;
    setBusy(true);
    try {
      await removeMember(activeOrg.id, toRemove.userId);
      push('Anggota dikeluarkan.');
      setToRemove(null);
      reload();
    } catch (err) {
      push(err instanceof ApiError ? err.message : 'Gagal mengeluarkan anggota.', 'error');
    } finally {
      setBusy(false);
    }
  };

  const columns: Column<Member>[] = [
    { key: 'fullName', label: 'Nama', render: (m) => m.fullName ?? '—' },
    { key: 'email', label: 'Email', mono: true },
    { key: 'role', label: 'Peran', render: (m) => <RoleBadge role={m.role} /> },
    {
      key: 'joinedAt',
      label: 'Bergabung',
      render: (m) => new Date(m.joinedAt).toLocaleDateString('id-ID'),
    },
  ];
  if (canManage) {
    columns.push({
      key: 'actions',
      label: 'Aksi',
      render: (m) => {
        if (m.role === 'OWNER') {
          return <span className="font-mono text-xs text-[var(--color-text-muted)]">—</span>;
        }
        return (
          <div className="flex items-center gap-2">
            <select
              aria-label={`Peran ${m.email}`}
              value={m.role}
              onChange={(e) => void changeRole(m, e.target.value as Role)}
              className="h-8 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 font-mono text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)]"
            >
              <option value="ADMIN">ADMIN</option>
              <option value="MEMBER">MEMBER</option>
            </select>
            {m.userId === user?.id ? (
              <span className="font-sans text-xs text-[var(--color-text-muted)]">Anda</span>
            ) : (
              <Button
                variant="tertiary"
                size="sm"
                className="!text-[var(--color-danger)]"
                onClick={() => setToRemove(m)}
              >
                Keluarkan
              </Button>
            )}
          </div>
        );
      },
    });
  }

  return (
    <>
      <header className="mb-4">
        <h1 className="font-sans font-extrabold text-xl tracking-tight">Anggota</h1>
        <p className="font-sans text-sm text-[var(--color-text-secondary)]">
          Pemilik = pemilik platform/organisasi, Admin = mengelola workspace &amp; anggota, QA =
          anggota workspace.
        </p>
      </header>

      <WindowCard title="members.list" noPadding>
        <div className="p-4">
          {error && (
            <p role="alert" className="mb-3 font-sans text-xs text-[var(--color-danger)]">
              {error.message}
            </p>
          )}
          <DataTable
            columns={columns}
            rows={data?.members ?? []}
            rowKey={(m) => m.id}
            loading={loading}
            empty={
              <EmptyState
                title="Belum ada anggota"
                description="Undang rekan lewat halaman Undangan."
              />
            }
          />
        </div>
      </WindowCard>

      <ConfirmDialog
        open={!!toRemove}
        title="Keluarkan anggota?"
        description={`${toRemove?.email ?? ''} akan kehilangan akses ke organisasi ini.`}
        confirmLabel="Keluarkan"
        busy={busy}
        onConfirm={remove}
        onClose={() => setToRemove(null)}
      />
    </>
  );
};

export default MembersPage;
