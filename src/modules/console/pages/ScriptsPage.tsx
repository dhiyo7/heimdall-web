import React, { useDeferredValue, useEffect, useMemo, useState } from 'react';
import { FileCode2, Folder as FolderIcon, Plus } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { WindowCard } from '../../../components/ui/WindowCard';
import { ApiError } from '../../../lib/api/client';
import {
  addScriptVersion,
  createScript,
  deleteScript,
  getScript,
  listFolders,
  listScripts,
  listScriptVersions,
  pullScript,
  updateScript,
} from '../../../lib/api/scripts';
import type { Folder, Script, ScriptType, Visibility } from '../../../lib/api/types';
import { useActiveWorkspace } from '../../../lib/useActiveWorkspace';
import { useApi } from '../../../lib/useApi';
import { useAuth } from '../../../lib/auth/AuthContext';
import { ConfirmDialog } from '../ConfirmDialog';
import { DataTable, type Column } from '../DataTable';
import { EmptyState } from '../EmptyState';
import { useToast } from '../Toast';
import { BreadcrumbBar } from '../components/BreadcrumbBar';
import { ContextMenu, type ContextMenuPosition, type ContextMenuItem } from '../components/ContextMenu';
import { FolderTree } from '../components/FolderTree';
import { ScriptGrid } from '../components/ScriptGrid';
import { ScriptToolbar, useViewPrefs } from '../components/ScriptToolbar';
import { SyncBadge, type SyncState } from '../components/SyncBadge';
import { scriptTypeLabel } from '../components/ScriptTypeIcon';

const INPUT =
  'w-full h-10 px-3 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] font-sans text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)]';
const SELECT = `${INPUT} cursor-pointer`;
const TEXTAREA =
  'w-full min-h-[140px] p-3 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] font-mono text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)]';
const LABEL =
  'mb-2 block font-mono text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]';

const VISIBILITY_LABEL: Record<Visibility, string> = {
  private: 'Pribadi',
  workspace: 'Workspace',
  link: 'Tautan',
};

const asMessage = (err: unknown, fallback: string) =>
  err instanceof ApiError ? err.message : fallback;

/** Sinkronisasi belum dilacak backend → script dengan versi = tersinkron, tanpa versi = lokal. */
const syncStateOf = (s: Script): SyncState => (s.latestVersionNo ? 'synced' : 'local');

const ScriptsPage: React.FC = () => {
  const { push } = useToast();
  const { user, role } = useAuth();
  const active = useActiveWorkspace();
  const { view, setView, sort, setSort } = useViewPrefs();

  // `?folder=` di URL supaya deep-link ke folder tertentu.
  const [folderPath, setFolderPath] = useState<string | null>(
    () => new URLSearchParams(window.location.search).get('folder') || null,
  );
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [menu, setMenu] = useState<{ script: Script; position: ContextMenuPosition } | null>(null);
  const [treeOpen, setTreeOpen] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const url = new URL(window.location.href);
    if (folderPath) url.searchParams.set('folder', folderPath);
    else url.searchParams.delete('folder');
    window.history.replaceState(null, '', url.toString());
  }, [folderPath]);

  const foldersApi = useApi(
    () => (active.workspaceId ? listFolders(active.workspaceId) : Promise.resolve({ folders: [] })),
    [active.workspaceId],
  );

  const scriptsApi = useApi(
    () =>
      active.workspaceId
        ? listScripts(active.workspaceId, { folderPath: folderPath ?? undefined })
        : Promise.resolve({ scripts: [] }),
    [active.workspaceId, folderPath],
  );

  const folders = foldersApi.data?.folders ?? [];
  const allScripts = scriptsApi.data?.scripts ?? [];

  // Anak langsung dari folder aktif (untuk tile subfolder); root = folder tanpa parent.
  const childFolders = useMemo(
    () => folders.filter((f) => (f.parentId ?? null) === (activeFolderId(folders, folderPath) ?? null)),
    [folders, folderPath],
  );

  const visibleScripts = useMemo(() => {
    const term = deferredSearch.trim().toLowerCase();
    const filtered = term
      ? allScripts.filter((s) => s.name.toLowerCase().includes(term))
      : [...allScripts];
    filtered.sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name, 'id');
      if (sort === 'size') return (b.sizeBytes ?? 0) - (a.sizeBytes ?? 0);
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });
    return filtered;
  }, [allScripts, deferredSearch, sort]);

  const canManage = role === 'OWNER' || role === 'ADMIN';
  const canEdit = (s: Script) => canManage || s.ownerUserId === user?.id;

  const [name, setName] = useState('');
  const [type, setType] = useState<ScriptType>('ui');
  const [newVisibility, setNewVisibility] = useState<Visibility>('private');
  const [content, setContent] = useState('');
  const [note, setNote] = useState('');
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

  const [pullBusy, setPullBusy] = useState(false);

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
        description="Buat workspace terlebih dahulu di menu Workspace sebelum menyimpan script."
      />
    );
  }

  const closeCreate = () => {
    setOpen(false);
    setFormError('');
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) {
      setFormError('Nama dan konten script wajib diisi.');
      return;
    }
    setBusy(true);
    setFormError('');
    try {
      await createScript(active.workspaceId!, {
        name: name.trim(),
        type,
        visibility: newVisibility,
        content,
        note: note.trim() || undefined,
        folderPath: folderPath ?? undefined,
      });
      push('Script dibuat.');
      closeCreate();
      setName('');
      setContent('');
      setNote('');
      // FolderPath bisa menciptakan folder baru → reload tree juga (section dinamis).
      scriptsApi.reload();
      foldersApi.reload();
    } catch (err) {
      setFormError(asMessage(err, 'Gagal membuat script.'));
    } finally {
      setBusy(false);
    }
  };

  const pullLatest = async () => {
    const target = visibleScripts[0];
    if (!target) {
      push('Tidak ada script untuk di-pull pada folder ini.', 'error');
      return;
    }
    setPullBusy(true);
    try {
      const result = await pullScript(target.id);
      push(`Konten ${target.name} versi ${result.versionNo} dimuat.`);
      scriptsApi.reload();
    } catch (err) {
      push(asMessage(err, 'Gagal menarik konten terbaru.'), 'error');
    } finally {
      setPullBusy(false);
    }
  };

  const rename = async (script: Script) => {
    const next = window.prompt('Nama script baru:', script.name);
    if (!next || next.trim() === script.name || !next.trim()) return;
    try {
      await updateScript(script.id, { name: next.trim() });
      push('Nama script diperbarui.');
      scriptsApi.reload();
    } catch (err) {
      push(asMessage(err, 'Gagal mengganti nama.'), 'error');
    }
  };

  const remove = async (script: Script) => {
    if (!window.confirm(`Hapus script "${script.name}" beserta seluruh riwayat versinya?`)) return;
    try {
      await deleteScript(script.id);
      push('Script dihapus.');
      scriptsApi.reload();
    } catch (err) {
      push(asMessage(err, 'Gagal menghapus script.'), 'error');
    }
  };

  const share = async (script: Script) => {
    const url = `${window.location.origin}/app/scripts?folder=${encodeURIComponent(script.folderPath ?? '')}`;
    try {
      await navigator.clipboard.writeText(url);
      push('Tautan folder script disalin.');
    } catch {
      push('Gagal menyalin tautan.', 'error');
    }
  };

  const menuItems = (script: Script): ContextMenuItem[] => {
    const items: ContextMenuItem[] = [
      { id: 'open', label: 'Buka', onSelect: () => setSelectedId(script.id) },
    ];
    if (canEdit(script)) {
      items.push({ id: 'rename', label: 'Rename', onSelect: () => rename(script) });
    }
    items.push({ id: 'share', label: 'Bagikan', onSelect: () => share(script) });
    if (canEdit(script)) {
      items.push({ id: 'delete', label: 'Hapus', danger: true, onSelect: () => remove(script) });
    }
    return items;
  };

  const columns: Column<Script>[] = [
    {
      key: 'name',
      label: 'Nama',
      render: (s) => (
        <button
          type="button"
          onClick={() => setSelectedId(s.id)}
          className="text-left font-sans font-semibold text-[var(--color-primary)] hover:underline"
        >
          {s.name}
        </button>
      ),
    },
    { key: 'type', label: 'Tipe', mono: true, render: (s) => scriptTypeLabel(s.type) },
    {
      key: 'folderPath',
      label: 'Folder',
      mono: true,
      render: (s) => s.folderPath ?? '—',
    },
    {
      key: 'latestVersionNo',
      label: 'Versi',
      mono: true,
      render: (s) => (s.latestVersionNo != null ? `v${s.latestVersionNo}` : '—'),
    },
    { key: 'sync', label: 'Sinkron', render: (s) => <SyncBadge state={syncStateOf(s)} /> },
    {
      key: 'updatedAt',
      label: 'Diperbarui',
      mono: true,
      render: (s) => new Date(s.updatedAt).toLocaleString('id-ID'),
    },
  ];

  const listError = scriptsApi.error || foldersApi.error;

  return (
    <div className="flex flex-col gap-4 md:h-[calc(100dvh-6.5rem)]">
      <header className="flex shrink-0 flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-sans text-xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
            Script
          </h1>
          <p className="mt-1 max-w-2xl font-sans text-sm text-[var(--color-text-secondary)]">
            Pustaka script pengujian per workspace, mengikuti hierarki folder dari Desktop.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setOpen(true)}>
          <Plus className="mr-1 h-4 w-4" aria-hidden="true" />
          Skrip Baru
        </Button>
      </header>

      <div className="flex shrink-0 flex-wrap items-end gap-3">
        <div className="min-w-[180px] flex-1">
          <label htmlFor="script-workspace" className={LABEL}>
            Workspace
          </label>
          <select
            id="script-workspace"
            value={active.workspaceId}
            onChange={(e) => {
              setSelectedId(null);
              setFolderPath(null);
              active.setWorkspaceId(e.target.value);
            }}
            className={SELECT}
          >
            {active.workspaces.map((w) => (
              <option key={w.id} value={w.id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {listError ? (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--color-danger)]/40 bg-[var(--color-danger)]/10 px-4 py-3"
        >
          <p className="font-sans text-sm text-[var(--color-danger)]">{listError.message}</p>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => {
              scriptsApi.reload();
              foldersApi.reload();
            }}
          >
            Coba lagi
          </Button>
        </div>
      ) : (
        <div className="flex min-h-0 flex-1 gap-4">
          {/* Folder tree: kolom tetap di desktop, drawer di <768px */}
          <aside className="hidden w-60 shrink-0 flex-col md:flex">
            <WindowCard title="Folder" contentClassName="p-2 overflow-y-auto min-h-0">
              {foldersApi.loading ? (
                <p className="px-2 py-3 font-mono text-xs text-[var(--color-text-muted)]">memuat folder…</p>
              ) : (
                <FolderTree
                  folders={folders}
                  activePath={folderPath}
                  onSelect={(p) => {
                    setFolderPath(p);
                    setTreeOpen(false);
                  }}
                />
              )}
            </WindowCard>
          </aside>

          <div className="flex min-h-0 min-w-0 flex-1 flex-col gap-3">
            <BreadcrumbBar path={folderPath} onNavigate={setFolderPath} />

            <ScriptToolbar
              search={search}
              onSearch={setSearch}
              view={view}
              onView={setView}
              sort={sort}
              onSort={setSort}
              onPull={pullLatest}
              pullBusy={pullBusy}
              onOpenTree={() => setTreeOpen(true)}
            />

            <WindowCard title={folderPath ?? 'Semua script'} className="min-h-0 flex-1" contentClassName="p-3 overflow-y-auto">
              {scriptsApi.loading ? (
                <p className="p-2 font-mono text-sm text-[var(--color-text-muted)]">memuat script…</p>
              ) : visibleScripts.length === 0 && childFolders.length === 0 ? (
                <EmptyState
                  icon={<FileCode2 className="h-6 w-6" aria-hidden="true" />}
                  title={search.trim() ? 'Tidak ada script yang cocok' : 'Folder ini masih kosong'}
                  description={
                    search.trim()
                      ? 'Ubah kata kunci pencarian.'
                      : 'Tarik script dari Desktop lewat tombol Pull, atau buat skrip baru untuk memulai.'
                  }
                  actionLabel={search.trim() ? undefined : 'Skrip Baru'}
                  onAction={search.trim() ? undefined : () => setOpen(true)}
                />
              ) : (
                <div className="space-y-3">
                  {childFolders.length > 0 && (
                    <div className="grid grid-cols-2 gap-2 md:grid-cols-3 xl:grid-cols-4">
                      {childFolders.map((f) => (
                        <button
                          key={f.id}
                          type="button"
                          onClick={() => setFolderPath(f.path)}
                          className="flex items-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)]/40 p-3 text-left hover:border-[var(--color-primary)]/40 hover:bg-[var(--color-surface)]"
                        >
                          <FolderIcon className="h-4 w-4 shrink-0 text-[var(--color-primary)]" aria-hidden="true" />
                          <span className="truncate font-sans text-sm text-[var(--color-text-primary)]">
                            {f.name}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}

                  {view === 'grid' ? (
                    <ScriptGrid
                      scripts={visibleScripts}
                      syncStateOf={syncStateOf}
                      onOpen={(s) => setSelectedId(s.id)}
                      onContextMenu={(s, position) => setMenu({ script: s, position })}
                    />
                  ) : (
                    <DataTable
                      columns={columns}
                      rows={visibleScripts}
                      rowKey={(s) => s.id}
                      onRowClick={(s) => setSelectedId(s.id)}
                    />
                  )}
                </div>
              )}
            </WindowCard>
          </div>
        </div>
      )}

      {/* Drawer folder tree untuk layar kecil */}
      {treeOpen && (
        <div className="fixed inset-0 z-[80] flex md:hidden">
          <div
            className="absolute inset-0 bg-black/50"
            onClick={() => setTreeOpen(false)}
            aria-hidden="true"
          />
          <div className="relative z-10 h-full w-72 max-w-[80vw] overflow-y-auto border-r border-[var(--color-border)] bg-[var(--color-background)] p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                Folder
              </span>
              <Button variant="tertiary" size="sm" onClick={() => setTreeOpen(false)}>
                Tutup
              </Button>
            </div>
            <FolderTree
              folders={folders}
              activePath={folderPath}
              onSelect={(p) => {
                setFolderPath(p);
                setTreeOpen(false);
              }}
            />
          </div>
        </div>
      )}

      <ContextMenu
        position={menu?.position ?? null}
        items={menu ? menuItems(menu.script) : []}
        onClose={() => setMenu(null)}
        ariaLabel={menu ? `Aksi untuk ${menu.script.name}` : 'Menu aksi'}
      />

      {selectedId && (
        <ScriptDetailPanel
          key={selectedId}
          id={selectedId}
          onClose={() => setSelectedId(null)}
          onChanged={scriptsApi.reload}
        />
      )}

      {open && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-black/50 px-4 py-8">
          <div role="dialog" aria-modal="true" aria-label="Skrip baru" className="w-full max-w-lg">
            <WindowCard title={folderPath ? `Skrip baru · ${folderPath}` : 'Skrip baru'}>
              <form onSubmit={submit} className="space-y-4">
                <div>
                  <label htmlFor="script-name" className={LABEL}>
                    Nama
                  </label>
                  <input
                    id="script-name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className={INPUT}
                    required
                    autoFocus
                  />
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="script-type" className={LABEL}>
                      Tipe
                    </label>
                    <select
                      id="script-type"
                      value={type}
                      onChange={(e) => setType(e.target.value as ScriptType)}
                      className={SELECT}
                    >
                      <option value="ui">UI</option>
                      <option value="api">API</option>
                    </select>
                  </div>
                  <div>
                    <label htmlFor="script-new-visibility" className={LABEL}>
                      Visibilitas
                    </label>
                    <select
                      id="script-new-visibility"
                      value={newVisibility}
                      onChange={(e) => setNewVisibility(e.target.value as Visibility)}
                      className={SELECT}
                    >
                      <option value="private">Pribadi</option>
                      <option value="workspace">Workspace</option>
                      <option value="link">Tautan</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label htmlFor="script-content" className={LABEL}>
                    Konten
                  </label>
                  <textarea
                    id="script-content"
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    className={TEXTAREA}
                    placeholder="Tempel isi script di sini…"
                    required
                  />
                </div>

                <div>
                  <label htmlFor="script-note" className={LABEL}>
                    Catatan
                  </label>
                  <input
                    id="script-note"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    placeholder="Opsional, misalnya tujuan perubahan"
                    className={INPUT}
                  />
                </div>

                {formError && (
                  <p role="alert" className="font-sans text-xs text-[var(--color-danger)]">
                    {formError}
                  </p>
                )}

                <div className="flex justify-end gap-2">
                  <Button type="button" variant="secondary" size="sm" onClick={closeCreate} disabled={busy}>
                    Batal
                  </Button>
                  <Button type="submit" variant="primary" size="sm" disabled={busy}>
                    {busy ? 'Menyimpan…' : 'Simpan'}
                  </Button>
                </div>
              </form>
            </WindowCard>
          </div>
        </div>
      )}
    </div>
  );
};

/** Folder aktif (id) dari path; null bila root. */
function activeFolderId(folders: Folder[], path: string | null): string | null {
  if (!path) return null;
  return folders.find((f) => f.path === path)?.id ?? null;
}

type DetailProps = {
  id: string;
  onClose: () => void;
  onChanged: () => void;
};

/** Modal detail: metadata, riwayat versi, pull, tambah versi, hapus (fungsi lama dipertahankan). */
const ScriptDetailPanel: React.FC<DetailProps> = ({ id, onClose, onChanged }) => {
  const { push } = useToast();
  const detail = useApi(() => getScript(id), [id]);
  const history = useApi(() => listScriptVersions(id), [id]);

  const [pulled, setPulled] = useState<{ content: string; versionNo: number } | null>(null);
  const [pullBusy, setPullBusy] = useState(false);
  const [addOpen, setAddOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const [note, setNote] = useState('');
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);
  const [askDelete, setAskDelete] = useState(false);

  const script = detail.data?.script ?? null;

  const pull = async () => {
    setPullBusy(true);
    try {
      const result = await pullScript(id);
      setPulled({ content: result.content, versionNo: result.versionNo });
      push(`Konten versi ${result.versionNo} dimuat.`);
    } catch (err) {
      push(asMessage(err, 'Gagal mengambil konten.'), 'error');
    } finally {
      setPullBusy(false);
    }
  };

  const addVersion = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!draft.trim()) {
      setFormError('Konten versi wajib diisi.');
      return;
    }
    setBusy(true);
    setFormError('');
    try {
      const result = await addScriptVersion(id, {
        content: draft,
        note: note.trim() || undefined,
      });
      push(
        result.unchanged
          ? 'Konten sama dengan versi terbaru; versi baru tidak dibuat.'
          : 'Versi baru tersimpan.',
      );
      setAddOpen(false);
      setDraft('');
      setNote('');
      detail.reload();
      history.reload();
      onChanged();
    } catch (err) {
      setFormError(asMessage(err, 'Gagal menyimpan versi baru.'));
    } finally {
      setBusy(false);
    }
  };

  const remove = async () => {
    setBusy(true);
    try {
      await deleteScript(id);
      push('Script dihapus.');
      onChanged();
      onClose();
    } catch (err) {
      push(asMessage(err, 'Gagal menghapus script.'), 'error');
      setBusy(false);
    }
  };

  const versions = history.data?.versions ?? [];

  return (
    <div className="fixed inset-0 z-[85] flex items-start justify-center overflow-y-auto bg-black/50 px-4 py-8">
      <div role="dialog" aria-modal="true" aria-label="Detail script" className="w-full max-w-2xl">
        {detail.loading ? (
          <WindowCard title="Detail script">
            <p className="font-mono text-sm text-[var(--color-text-muted)]">memuat detail…</p>
          </WindowCard>
        ) : detail.error || !script ? (
          <WindowCard title="Detail script">
            <p role="alert" className="font-sans text-sm text-[var(--color-danger)]">
              {detail.error?.message ?? 'Script tidak ditemukan.'}
            </p>
            <Button variant="secondary" size="sm" className="mt-3" onClick={onClose}>
              Tutup
            </Button>
          </WindowCard>
        ) : (
          <>
            <WindowCard title={`script · ${script.name}`}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <h2 className="font-sans text-lg font-extrabold tracking-tight text-[var(--color-text-primary)]">
                    {script.name}
                  </h2>
                  <p className="mt-0.5 font-mono text-xs text-[var(--color-text-muted)]">{script.slug}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="secondary" size="sm" onClick={pull} disabled={pullBusy}>
                    {pullBusy ? 'Mengambil…' : 'Ambil konten'}
                  </Button>
                  <Button variant="primary" size="sm" onClick={() => setAddOpen((v) => !v)}>
                    Tambah Versi
                  </Button>
                  <Button variant="tertiary" size="sm" onClick={onClose}>
                    Tutup
                  </Button>
                </div>
              </div>

              <dl className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                <div>
                  <dt className={LABEL}>Tipe</dt>
                  <dd className="font-mono text-sm text-[var(--color-text-primary)]">
                    {scriptTypeLabel(script.type)}
                  </dd>
                </div>
                <div>
                  <dt className={LABEL}>Visibilitas</dt>
                  <dd className="font-sans text-sm text-[var(--color-text-primary)]">
                    {VISIBILITY_LABEL[script.visibility] ?? script.visibility}
                  </dd>
                </div>
                <div>
                  <dt className={LABEL}>Folder</dt>
                  <dd className="font-mono text-xs text-[var(--color-text-primary)]">
                    {script.folderPath ?? '—'}
                  </dd>
                </div>
                <div>
                  <dt className={LABEL}>Versi terbaru</dt>
                  <dd className="font-mono text-sm text-[var(--color-text-primary)]">
                    {script.latestVersionNo != null ? `v${script.latestVersionNo}` : '—'}
                  </dd>
                </div>
                <div>
                  <dt className={LABEL}>Diperbarui</dt>
                  <dd className="font-mono text-xs text-[var(--color-text-secondary)]">
                    {new Date(script.updatedAt).toLocaleString('id-ID')}
                  </dd>
                </div>
                <div>
                  <dt className={LABEL}>Tag</dt>
                  <dd className="font-mono text-xs text-[var(--color-text-secondary)]">
                    {script.tags.length > 0 ? script.tags.join(', ') : '—'}
                  </dd>
                </div>
              </dl>

              {pulled && (
                <div className="mt-5">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
                      Konten versi {pulled.versionNo}
                    </span>
                    <Button variant="tertiary" size="sm" onClick={() => setPulled(null)}>
                      Sembunyikan
                    </Button>
                  </div>
                  <pre className="max-h-80 overflow-auto whitespace-pre-wrap rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] p-3 font-mono text-xs text-[var(--color-text-primary)]">
                    {pulled.content}
                  </pre>
                </div>
              )}

              {addOpen && (
                <form
                  onSubmit={addVersion}
                  className="mt-5 space-y-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)]/60 p-4"
                >
                  <div>
                    <label htmlFor="script-version-content" className={LABEL}>
                      Konten versi baru
                    </label>
                    <textarea
                      id="script-version-content"
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      className={TEXTAREA}
                      placeholder="Tempel isi versi baru…"
                      required
                    />
                  </div>
                  <div>
                    <label htmlFor="script-version-note" className={LABEL}>
                      Catatan
                    </label>
                    <input
                      id="script-version-note"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="Opsional, misalnya alasan perubahan"
                      className={INPUT}
                    />
                  </div>
                  {formError && (
                    <p role="alert" className="font-sans text-xs text-[var(--color-danger)]">
                      {formError}
                    </p>
                  )}
                  <div className="flex justify-end gap-2">
                    <Button
                      type="button"
                      variant="secondary"
                      size="sm"
                      onClick={() => setAddOpen(false)}
                      disabled={busy}
                    >
                      Batal
                    </Button>
                    <Button type="submit" variant="primary" size="sm" disabled={busy}>
                      {busy ? 'Menyimpan…' : 'Simpan versi'}
                    </Button>
                  </div>
                </form>
              )}

              <div className="mt-5">
                <p className={LABEL}>Riwayat versi</p>
                {history.loading ? (
                  <p className="font-mono text-xs text-[var(--color-text-muted)]">memuat riwayat…</p>
                ) : history.error ? (
                  <p role="alert" className="font-sans text-xs text-[var(--color-danger)]">
                    {history.error.message}
                  </p>
                ) : versions.length === 0 ? (
                  <p className="font-sans text-xs text-[var(--color-text-muted)]">Belum ada versi.</p>
                ) : (
                  <ul className="divide-y divide-[var(--color-border)] rounded-md border border-[var(--color-border)]">
                    {versions.map((v) => (
                      <li key={v.id} className="flex flex-wrap items-center justify-between gap-2 px-3 py-2">
                        <div className="min-w-0">
                          <p className="font-mono text-xs text-[var(--color-text-primary)]">
                            v{v.versionNo}{' '}
                            <span className="text-[var(--color-text-muted)]">
                              {v.contentHash.slice(0, 10)}
                            </span>
                          </p>
                          {v.note && (
                            <p className="font-sans text-xs text-[var(--color-text-secondary)]">{v.note}</p>
                          )}
                        </div>
                        <p className="shrink-0 font-mono text-[10px] text-[var(--color-text-muted)]">
                          {new Date(v.createdAt).toLocaleString('id-ID')}
                        </p>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="mt-6 border-t border-[var(--color-border)] pt-4">
                <Button
                  variant="tertiary"
                  size="sm"
                  className="!text-[var(--color-danger)]"
                  onClick={() => setAskDelete(true)}
                >
                  Hapus script
                </Button>
              </div>
            </WindowCard>

            <ConfirmDialog
              open={askDelete}
              title="Hapus script?"
              description={`Script "${script.name}" beserta seluruh riwayat versinya akan dihapus permanen.`}
              confirmLabel="Hapus"
              busy={busy}
              onConfirm={remove}
              onClose={() => setAskDelete(false)}
            />
          </>
        )}
      </div>
    </div>
  );
};

export default ScriptsPage;
