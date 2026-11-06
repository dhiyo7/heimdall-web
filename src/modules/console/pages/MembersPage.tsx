import React, { useState } from 'react';
import { useAuth } from '../../../lib/auth/AuthContext';
import { useApi } from '../../../lib/useApi';
import { ApiError } from '../../../lib/api/client';
import { listMembers, removeMember, updateMemberRole } from '../../../lib/api/memberships';
import {
  addWorkspaceMember,
  listWorkspaceMembers,
  listWorkspaces,
  removeWorkspaceMember,
} from '../../../lib/api/workspaces';
import type { Member, Role, Workspace, WorkspaceMember } from '../../../lib/api/types';
import { Button } from '../../../components/ui/Button';
import { WindowCard } from '../../../components/ui/WindowCard';
import { ConfirmDialog } from '../ConfirmDialog';
import { DataTable, type Column } from '../DataTable';
import { EmptyState } from '../EmptyState';
import { RoleBadge } from '../RoleBadge';
import { useToast } from '../Toast';

const CHIP =
  'inline-flex items-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-0.5 font-mono text-[10px] text-[var(--color-text-secondary)]';

// ponytail: teks console masih hardcode Indonesia (belum lewat I18nContext).
// Pindahkan ke kunci i18n saat console resmi ditawarkan multi-bahasa.
const MembersPage: React.FC = () => {
  const { activeOrg, role, user } = useAuth();
  const { push } = useToast();
  // Sekali jalan: anggota org + semua workspace + assignment tiap workspace (Promise.all).
  const { data, loading, error, reload } = useApi(
    async () => {
      if (!activeOrg) {
        return {
          members: [] as Member[],
          workspaces: [] as Workspace[],
          byWorkspace: {} as Record<string, WorkspaceMember[]>,
        };
      }
      const [{ members }, { workspaces }] = await Promise.all([
        listMembers(activeOrg.id),
        listWorkspaces(activeOrg.id),
      ]);
      const lists = await Promise.all(workspaces.map((w) => listWorkspaceMembers(w.id)));
      const byWorkspace: Record<string, WorkspaceMember[]> = {};
      workspaces.forEach((w, i) => {
        byWorkspace[w.id] = lists[i].members;
      });
      return { members, workspaces, byWorkspace };
    },
    [activeOrg?.id],
  );
  const canManage = role === 'OWNER' || role === 'ADMIN';
  const [busy, setBusy] = useState(false);
  const [toRemove, setToRemove] = useState<Member | null>(null);
  const [managing, setManaging] = useState<Member | null>(null);
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  if (!activeOrg) return <EmptyState title="Belum punya organisasi" />;

  const workspaces = data?.workspaces ?? [];
  const byWorkspace = data?.byWorkspace ?? {};

  /** ID workspace yang di-assign eksplisit (implicit OWNER/ADMIN dikecualikan). */
  const explicitWorkspaceIds = (userId: string) =>
    new Set(
      workspaces
        .filter((w) => byWorkspace[w.id]?.some((x) => x.userId === userId && !x.implicit))
        .map((w) => w.id),
    );

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

  const openManage = (member: Member) => {
    const assigned = explicitWorkspaceIds(member.userId);
    setChecked(Object.fromEntries(workspaces.map((w) => [w.id, assigned.has(w.id)])));
    setManaging(member);
  };

  const saveAssignments = async () => {
    if (!managing) return;
    setBusy(true);
    try {
      const before = explicitWorkspaceIds(managing.userId);
      const jobs: Promise<unknown>[] = [];
      for (const w of workspaces) {
        const want = !!checked[w.id];
        if (want && !before.has(w.id)) jobs.push(addWorkspaceMember(w.id, managing.userId));
        if (!want && before.has(w.id)) jobs.push(removeWorkspaceMember(w.id, managing.userId));
      }
      await Promise.all(jobs);
      push('Akses workspace diperbarui.');
      setManaging(null);
      reload();
    } catch (err) {
      push(err instanceof ApiError ? err.message : 'Gagal memperbarui akses workspace.', 'error');
    } finally {
      setBusy(false);
    }
  };

  const columns: Column<Member>[] = [
    { key: 'fullName', label: 'Nama', render: (m) => m.fullName ?? '—' },
    { key: 'email', label: 'Email', mono: true },
    { key: 'role', label: 'Peran', render: (m) => <RoleBadge role={m.role} /> },
    {
      key: 'workspaces',
      label: 'Workspaces',
      render: (m) => {
        if (m.role === 'OWNER' || m.role === 'ADMIN') {
          return <span className={CHIP}>All workspaces (implicit)</span>;
        }
        const assigned = explicitWorkspaceIds(m.userId);
        const names = workspaces.filter((w) => assigned.has(w.id)).map((w) => w.name);
        if (names.length === 0) {
          return <span className="font-mono text-xs text-[var(--color-text-muted)]">—</span>;
        }
        return (
          <div className="flex flex-wrap gap-1">
            {names.map((n) => (
              <span key={n} className={CHIP}>
                {n}
              </span>
            ))}
          </div>
        );
      },
    },
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
            {m.role === 'MEMBER' && (
              <Button variant="tertiary" size="sm" onClick={() => openManage(m)}>
                Manage
              </Button>
            )}
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

      <WindowCard title="Daftar anggota" noPadding>
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

      {managing && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center bg-black/50 px-4">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Kelola akses workspace"
            className="w-full max-w-md"
          >
            <WindowCard title="Kelola akses workspace">
              <p className="mb-3 font-sans text-xs text-[var(--color-text-secondary)]">
                Akses workspace untuk{' '}
                <span className="font-mono text-[var(--color-text-primary)]">
                  {managing.email}
                </span>
                .
              </p>
              {workspaces.length === 0 ? (
                <p className="font-sans text-xs text-[var(--color-text-muted)]">
                  Belum ada workspace di organisasi ini.
                </p>
              ) : (
                <ul className="space-y-2">
                  {workspaces.map((w) => (
                    <li key={w.id} className="flex items-center gap-2">
                      <input
                        id={`wg-${w.id}`}
                        type="checkbox"
                        checked={!!checked[w.id]}
                        onChange={(e) =>
                          setChecked((prev) => ({ ...prev, [w.id]: e.target.checked }))
                        }
                        disabled={busy}
                        className="h-4 w-4 accent-[var(--color-primary)]"
                      />
                      <label htmlFor={`wg-${w.id}`} className="font-sans text-sm">
                        {w.name}{' '}
                        <span className="font-mono text-xs text-[var(--color-text-muted)]">
                          {w.slug}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              )}
              <div className="mt-5 flex justify-end gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setManaging(null)}
                  disabled={busy}
                >
                  Batal
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => void saveAssignments()}
                  disabled={busy || workspaces.length === 0}
                >
                  {busy ? 'Menyimpan…' : 'Simpan'}
                </Button>
              </div>
            </WindowCard>
          </div>
        </div>
      )}

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
