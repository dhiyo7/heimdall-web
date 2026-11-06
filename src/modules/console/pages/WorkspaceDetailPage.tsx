import React, { useEffect, useState } from 'react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../../lib/auth/AuthContext';
import { useApi } from '../../../lib/useApi';
import { ApiError } from '../../../lib/api/client';
import { listMembers } from '../../../lib/api/memberships';
import {
  addWorkspaceMember,
  deleteWorkspace,
  getWorkspace,
  getWorkspaceSummary,
  listWorkspaceMembers,
  removeWorkspaceMember,
  updateWorkspace,
} from '../../../lib/api/workspaces';
import { listScripts } from '../../../lib/api/scripts';
import { listReports } from '../../../lib/api/reports';
import type { Member, ReportListItem, Script, WorkspaceMember, WorkspaceSummary } from '../../../lib/api/types';
import { Button } from '../../../components/ui/Button';
import { WindowCard } from '../../../components/ui/WindowCard';
import { ConfirmDialog } from '../ConfirmDialog';
import { DataTable, type Column } from '../DataTable';
import { EmptyState } from '../EmptyState';
import { RoleBadge } from '../RoleBadge';
import { useToast } from '../Toast';
import { formatBytes } from '../components/ScriptCard';
import { StatusBadge } from '../components/StatusBadge';

const INPUT =
  'w-full h-10 px-3 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] font-sans text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] disabled:opacity-60';
const LABEL =
  'mb-2 font-mono text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]';
const CHIP =
  'inline-flex items-center rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 py-0.5 font-mono text-[10px] text-[var(--color-text-secondary)]';

const TABS = ['overview', 'members', 'scripts', 'reports', 'settings'] as const;
type Tab = (typeof TABS)[number];
const TAB_LABEL: Record<Tab, string> = {
  overview: 'Overview',
  members: 'Members',
  scripts: 'Scripts',
  reports: 'Reports',
  settings: 'Settings',
};

const asMessage = (err: unknown, fallback: string) =>
  err instanceof ApiError ? err.message : fallback;

const Stat: React.FC<{ label: string; value: React.ReactNode }> = ({ label, value }) => (
  <div>
    <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]">
      {label}
    </p>
    <p className="font-mono text-2xl font-extrabold text-[var(--color-text-primary)]">{value}</p>
  </div>
);

const WorkspaceDetailPage: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { activeOrg, role } = useAuth();
  const { push } = useToast();
  const [params, setParams] = useSearchParams();
  const canManage = role === 'OWNER' || role === 'ADMIN';

  const rawTab = params.get('tab');
  const tab: Tab = (TABS as readonly string[]).includes(rawTab ?? '') ? (rawTab as Tab) : 'overview';
  const setTab = (next: Tab) => {
    const p = new URLSearchParams(params);
    p.set('tab', next);
    setParams(p, { replace: true });
  };

  const { data, loading, error, reload } = useApi(() => getWorkspace(id!), [id]);
  const workspace = data?.workspace ?? null;

  const summaryApi = useApi(
    () => (id ? getWorkspaceSummary(id).catch(() => null) : Promise.resolve(null)),
    [id],
  );
  const summary: WorkspaceSummary | null = summaryApi.data;

  const membersApi = useApi(() => listWorkspaceMembers(id!), [id]);
  const orgMembersApi = useApi(
    () => (activeOrg ? listMembers(activeOrg.id) : Promise.resolve({ members: [] as Member[] })),
    [activeOrg?.id],
  );
  const scriptsApi = useApi(
    () => (id ? listScripts(id).catch(() => ({ scripts: [] as Script[] })) : Promise.resolve({ scripts: [] })),
    [id],
  );
  const reportsApi = useApi(
    () => (id ? listReports(id).catch(() => ({ items: [] as ReportListItem[] })) : Promise.resolve({ items: [] })),
    [id],
  );

  const [name, setName] = useState('');
  const [slug, setSlug] = useState('');
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);
  const [askDelete, setAskDelete] = useState(false);
  const [membersBusy, setMembersBusy] = useState(false);
  const [toUnassign, setToUnassign] = useState<WorkspaceMember | null>(null);
  const [addUserId, setAddUserId] = useState('');

  useEffect(() => {
    if (workspace) {
      setName(workspace.name);
      setSlug(workspace.slug);
    }
  }, [workspace]);

  if (loading) {
    return <p className="font-mono text-sm text-[var(--color-text-muted)]">memuat workspace…</p>;
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
          : asMessage(err, 'Gagal menyimpan workspace.'),
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
      push(asMessage(err, 'Gagal menghapus workspace.'), 'error');
      setBusy(false);
    }
  };

  const unassign = async () => {
    if (!toUnassign) return;
    setMembersBusy(true);
    try {
      await removeWorkspaceMember(workspace.id, toUnassign.userId);
      push('Akses anggota dilepas.');
      setToUnassign(null);
      membersApi.reload();
    } catch (err) {
      push(asMessage(err, 'Gagal melepas akses anggota.'), 'error');
    } finally {
      setMembersBusy(false);
    }
  };

  const addMember = async () => {
    if (!addUserId) return;
    setMembersBusy(true);
    try {
      await addWorkspaceMember(workspace.id, addUserId);
      push('Anggota ditambahkan ke workspace.');
      setAddUserId('');
      membersApi.reload();
    } catch (err) {
      push(asMessage(err, 'Gagal menambahkan anggota.'), 'error');
    } finally {
      setMembersBusy(false);
    }
  };

  const workspaceMembers = membersApi.data?.members ?? [];
  const assignedIds = new Set(workspaceMembers.map((m) => m.userId));
  const candidates = (orgMembersApi.data?.members ?? []).filter((m) => !assignedIds.has(m.userId));

  const passRate =
    summary?.totals.passRate != null ? Math.round(summary.totals.passRate * (summary.totals.passRate <= 1 ? 100 : 1)) : null;

  const recentRuns = (reportsApi.data?.items ?? []).slice(0, 3);
  const scripts = scriptsApi.data?.scripts ?? [];

  return (
    <>
      <header className="mb-4 flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-sans text-xl font-extrabold tracking-tight">{workspace.name}</h1>
            {role && <RoleBadge role={role} />}
          </div>
          <p className="font-mono text-xs text-[var(--color-text-secondary)]">{workspace.slug}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="secondary" size="sm" onClick={() => navigate(`/app/workspaces/${workspace.id}/dashboard`)}>
            Dashboard
          </Button>
          <Button variant="secondary" size="sm" onClick={() => navigate('/app/workspaces')}>
            Kembali
          </Button>
        </div>
      </header>

      {summary ? (
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
          <Stat label="Anggota" value={summary.memberCount} />
          <Stat label="Script" value={summary.scriptCount} />
          <Stat label="Run" value={summary.totals.totalRuns ?? summary.runCount} />
          <Stat label="Pass rate" value={passRate == null ? '—' : `${passRate}%`} />
          <Stat label="Storage" value={formatBytes(summary.storageUsedBytes)} />
        </div>
      ) : (
        <p className="mb-4 font-mono text-xs text-[var(--color-text-muted)]">
          {summaryApi.loading ? 'memuat ringkasan…' : 'ringkasan tidak tersedia'}
        </p>
      )}

      <div role="tablist" aria-label="Bagian workspace" className="mb-4 flex flex-wrap gap-1 border-b border-[var(--color-border)]">
        {TABS.map((t) => (
          <button
            key={t}
            role="tab"
            aria-selected={tab === t}
            onClick={() => setTab(t)}
            className={`-mb-px border-b-2 px-3 py-2 font-sans text-sm font-bold transition-colors ${
              tab === t
                ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                : 'border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            {TAB_LABEL[t]}
          </button>
        ))}
      </div>

      {tab === 'overview' && (
        <>
          <WindowCard title="Run terbaru" noPadding>
            <div className="p-4">
              {reportsApi.error ? (
                <RetryBlock message={reportsApi.error.message} onRetry={reportsApi.reload} />
              ) : (
                <DataTable
                  columns={[
                    { key: 'runRef', label: 'Run', mono: true },
                    { key: 'status', label: 'Status' },
                    { key: 'counts', label: 'Lulus / Gagal', mono: true, render: (r) => `${r.passed} / ${r.failed}` },
                    {
                      key: 'createdAt',
                      label: 'Waktu',
                      mono: true,
                      render: (r) => new Date(r.createdAt).toLocaleString('id-ID'),
                    },
                  ] as Column<ReportListItem>[]}
                  rows={recentRuns}
                  rowKey={(r) => r.id}
                  loading={reportsApi.loading}
                  empty={<EmptyState title="Belum ada run" description="Run muncul setelah perangkat mengunggah hasil." />}
                />
              )}
            </div>
          </WindowCard>
          {summary && summary.totals.totalRuns > 0 && (
            <WindowCard title="Tren singkat" className="mt-4">
              <p className="font-mono text-xs text-[var(--color-text-secondary)]">
                total {summary.totals.totalRuns} run · lulus {summary.totals.passCount} · gagal {summary.totals.failCount} · pass rate {passRate}%
              </p>
            </WindowCard>
          )}
        </>
      )}

      {tab === 'members' && (
        <WindowCard title="Members" noPadding>
          <div className="p-4">
            {membersApi.error && (
              <p role="alert" className="mb-3 font-sans text-xs text-[var(--color-danger)]">
                {membersApi.error.message} ·{' '}
                <button type="button" className="underline" onClick={membersApi.reload}>
                  Coba lagi
                </button>
              </p>
            )}
            {canManage && (
              <div className="mb-3 flex items-center gap-2">
                <label htmlFor="wd-add-member" className="sr-only">
                  Tambah member
                </label>
                <select
                  id="wd-add-member"
                  value={addUserId}
                  onChange={(e) => setAddUserId(e.target.value)}
                  disabled={membersBusy || candidates.length === 0}
                  className="h-8 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-2 font-mono text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)] disabled:opacity-60"
                >
                  <option value="">
                    {candidates.length === 0 ? 'Semua anggota sudah punya akses' : 'Pilih anggota…'}
                  </option>
                  {candidates.map((m) => (
                    <option key={m.userId} value={m.userId}>
                      {m.email}
                    </option>
                  ))}
                </select>
                <Button variant="primary" size="sm" onClick={() => void addMember()} disabled={!addUserId || membersBusy}>
                  {membersBusy ? 'Memproses…' : 'Tambah member'}
                </Button>
              </div>
            )}
            <DataTable
              columns={[
                { key: 'email', label: 'Email', mono: true },
                { key: 'role', label: 'Peran', render: (m) => <RoleBadge role={m.role} /> },
                {
                  key: 'access',
                  label: 'Akses',
                  render: (m) =>
                    m.implicit ? (
                      <span className={CHIP}>implicit — All workspaces</span>
                    ) : (
                      <span className="font-mono text-xs text-[var(--color-text-muted)]">eksplisit</span>
                    ),
                },
                ...(canManage
                  ? [
                      {
                        key: 'actions',
                        label: 'Aksi',
                        render: (m: WorkspaceMember) =>
                          m.implicit ? (
                            <span className="font-mono text-xs text-[var(--color-text-muted)]">—</span>
                          ) : (
                            <Button
                              variant="tertiary"
                              size="sm"
                              className="!text-[var(--color-danger)]"
                              onClick={() => setToUnassign(m)}
                            >
                              Unassign
                            </Button>
                          ),
                      } satisfies Column<WorkspaceMember>,
                    ]
                  : []),
              ]}
              rows={workspaceMembers}
              rowKey={(m) => m.userId}
              loading={membersApi.loading}
              empty={
                <EmptyState
                  title="Belum ada anggota eksplisit"
                  description="Pemilik dan admin organisasi selalu punya akses ke semua workspace."
                />
              }
            />
          </div>
        </WindowCard>
      )}

      {tab === 'scripts' && (
        <WindowCard title="Scripts" noPadding>
          <div className="p-4">
            {scriptsApi.error ? (
              <RetryBlock message={scriptsApi.error.message} onRetry={scriptsApi.reload} />
            ) : (
              <DataTable
                columns={[
                  {
                    key: 'name',
                    label: 'Nama',
                    render: (s) => (
                      <Link
                        to={`/app/scripts?workspaceId=${workspace.id}&scriptId=${s.id}`}
                        className="font-sans font-semibold text-[var(--color-primary)] hover:underline"
                      >
                        {s.name}
                      </Link>
                    ),
                  },
                  { key: 'slug', label: 'Slug', mono: true },
                  { key: 'type', label: 'Tipe', mono: true },
                  {
                    key: 'latestVersionNo',
                    label: 'Versi',
                    mono: true,
                    render: (s) => (s.latestVersionNo != null ? `v${s.latestVersionNo}` : '—'),
                  },
                ] as Column<Script>[]}
                rows={scripts}
                rowKey={(s) => s.id}
                loading={scriptsApi.loading}
                empty={
                  <EmptyState
                    title="Belum ada script"
                    description="Simpan script pengujian dari halaman Script."
                  />
                }
              />
            )}
          </div>
        </WindowCard>
      )}

      {tab === 'reports' && (
        <WindowCard title="Reports" noPadding>
          <div className="p-4">
            {reportsApi.error ? (
              <RetryBlock message={reportsApi.error.message} onRetry={reportsApi.reload} />
            ) : (
              <DataTable
                columns={[
                  { key: 'runRef', label: 'Run', mono: true },
                  { key: 'status', label: 'Status', render: (r) => <StatusBadge status={r.status} /> },
                  { key: 'counts', label: 'Lulus / Gagal', mono: true, render: (r) => `${r.passed} / ${r.failed}` },
                  {
                    key: 'createdAt',
                    label: 'Waktu',
                    mono: true,
                    render: (r) => new Date(r.createdAt).toLocaleString('id-ID'),
                  },
                  {
                    key: 'link',
                    label: 'Laporan',
                    render: (r) =>
                      r.report?.isPublished && r.report.shareToken ? (
                        <Link
                          to={`/r/${r.report.shareToken}`}
                          className="font-mono text-xs text-[var(--color-primary)] hover:underline"
                        >
                          /r/{r.report.shareToken.slice(0, 8)}…
                        </Link>
                      ) : (
                        <span className="font-mono text-xs text-[var(--color-text-muted)]">belum publik</span>
                      ),
                  },
                ] as Column<ReportListItem>[]}
                rows={reportsApi.data?.items ?? []}
                rowKey={(r) => r.id}
                loading={reportsApi.loading}
                empty={
                  <EmptyState
                    title="Belum ada report"
                    description="Report muncul setelah perangkat mengunggah hasil pengujian."
                  />
                }
              />
            )}
          </div>
        </WindowCard>
      )}

      {tab === 'settings' &&
        (canManage ? (
          <>
            <WindowCard title="Pengaturan workspace">
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
                    required
                  />
                </div>
                {formError && (
                  <p role="alert" className="font-sans text-xs text-[var(--color-danger)]">
                    {formError}
                  </p>
                )}
                <div className="flex justify-end">
                  <Button type="submit" variant="primary" size="sm" disabled={!dirty || busy}>
                    {busy ? 'Menyimpan…' : 'Simpan'}
                  </Button>
                </div>
              </form>
            </WindowCard>

            <WindowCard title="Zona berbahaya" className="mt-4 !border-[var(--color-danger)]/40">
              <p className="font-sans text-sm text-[var(--color-text-secondary)]">
                Menghapus workspace akan menghapus seluruh isinya secara permanen. Tindakan ini tidak bisa
                dibatalkan.
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
          </>
        ) : (
          <EmptyState
            title="Tidak punya akses"
            description="Hanya pemilik atau admin organisasi yang bisa mengubah pengaturan workspace."
          />
        ))}

      <ConfirmDialog
        open={askDelete}
        title="Hapus workspace?"
        description={`Workspace "${workspace.name}" akan dihapus dan isi workspace ikut terhapus.`}
        confirmLabel="Hapus"
        busy={busy}
        onConfirm={remove}
        onClose={() => setAskDelete(false)}
      />

      <ConfirmDialog
        open={!!toUnassign}
        title="Lepas akses anggota?"
        description={`${toUnassign?.email ?? ''} tidak lagi punya akses ke workspace ini.`}
        confirmLabel="Unassign"
        busy={membersBusy}
        onConfirm={unassign}
        onClose={() => setToUnassign(null)}
      />
    </>
  );
};

const RetryBlock: React.FC<{ message: string; onRetry: () => void }> = ({ message, onRetry }) => (
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

export default WorkspaceDetailPage;
