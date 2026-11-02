import React, { useDeferredValue, useState } from 'react';
import { FileCode2 } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { WindowCard } from '../../../components/ui/WindowCard';
import { ApiError } from '../../../lib/api/client';
import {
  addScriptVersion,
  createScript,
  deleteScript,
  getScript,
  listScripts,
  listScriptVersions,
  pullScript,
} from '../../../lib/api/scripts';
import type { Script, ScriptType, Visibility } from '../../../lib/api/types';
import { useActiveWorkspace } from '../../../lib/useActiveWorkspace';
import { useApi } from '../../../lib/useApi';
import { ConfirmDialog } from '../ConfirmDialog';
import { DataTable, type Column } from '../DataTable';
import { EmptyState } from '../EmptyState';
import { useToast } from '../Toast';

const INPUT =
  'w-full h-10 px-3 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] font-sans text-sm text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)]';
const SELECT = `${INPUT} cursor-pointer`;
const TEXTAREA =
  'w-full min-h-[140px] p-3 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] font-mono text-xs text-[var(--color-text-primary)] focus:outline-none focus:border-[var(--color-primary)]';
const LABEL =
  'mb-2 block font-mono text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]';

const TYPE_LABEL: Record<ScriptType, string> = { ui: 'UI', api: 'API' };
const VISIBILITY_LABEL: Record<Visibility, string> = {
  private: 'Pribadi',
  workspace: 'Workspace',
  link: 'Tautan',
};

const asMessage = (err: unknown, fallback: string) =>
  err instanceof ApiError ? err.message : fallback;

const ScriptsPage: React.FC = () => {
  const { push } = useToast();
  const active = useActiveWorkspace();
  const [search, setSearch] = useState('');
  const deferredSearch = useDeferredValue(search);
  const [visibility, setVisibility] = useState<'' | Visibility>('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [open, setOpen] = useState(false);

  const { data, loading, error, reload } = useApi(
    () =>
      active.workspaceId
        ? listScripts(active.workspaceId, {
            search: deferredSearch.trim() || undefined,
            visibility: visibility || undefined,
          })
        : Promise.resolve({ scripts: [] }),
    [active.workspaceId, deferredSearch, visibility],
  );

  const [name, setName] = useState('');
  const [type, setType] = useState<ScriptType>('ui');
  const [newVisibility, setNewVisibility] = useState<Visibility>('private');
  const [content, setContent] = useState('');
  const [note, setNote] = useState('');
  const [formError, setFormError] = useState('');
  const [busy, setBusy] = useState(false);

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
      });
      push('Script dibuat.');
      closeCreate();
      setName('');
      setContent('');
      setNote('');
      reload();
    } catch (err) {
      setFormError(asMessage(err, 'Gagal membuat script.'));
    } finally {
      setBusy(false);
    }
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
    { key: 'type', label: 'Tipe', mono: true, render: (s) => TYPE_LABEL[s.type] ?? s.type },
    {
      key: 'visibility',
      label: 'Visibilitas',
      render: (s) => VISIBILITY_LABEL[s.visibility] ?? s.visibility,
    },
    {
      key: 'latestVersionNo',
      label: 'Versi terbaru',
      mono: true,
      render: (s) => (s.latestVersionNo != null ? `v${s.latestVersionNo}` : '—'),
    },
    {
      key: 'updatedAt',
      label: 'Diperbarui',
      mono: true,
      render: (s) => new Date(s.updatedAt).toLocaleString('id-ID'),
    },
  ];

  return (
    <div className="space-y-4">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-sans text-xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
            Script
          </h1>
          <p className="mt-1 max-w-2xl font-sans text-sm text-[var(--color-text-secondary)]">
            Pustaka script pengujian per workspace, lengkap dengan riwayat versi.
          </p>
        </div>
        <Button variant="primary" size="sm" onClick={() => setOpen(true)}>
          Skrip Baru
        </Button>
      </header>

      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-[180px] flex-1">
          <label htmlFor="script-workspace" className={LABEL}>
            Workspace
          </label>
          <select
            id="script-workspace"
            value={active.workspaceId}
            onChange={(e) => {
              setSelectedId(null);
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

        <div className="min-w-[200px] flex-[2]">
          <label htmlFor="script-search" className={LABEL}>
            Cari
          </label>
          <input
            id="script-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama script…"
            className={INPUT}
          />
        </div>

        <div className="min-w-[160px] flex-1">
          <label htmlFor="script-visibility" className={LABEL}>
            Visibilitas
          </label>
          <select
            id="script-visibility"
            value={visibility}
            onChange={(e) => setVisibility(e.target.value as '' | Visibility)}
            className={SELECT}
          >
            <option value="">Semua</option>
            <option value="private">Pribadi</option>
            <option value="workspace">Workspace</option>
            <option value="link">Tautan</option>
          </select>
        </div>
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
        <WindowCard title="Daftar script" contentClassName="p-2">
          <DataTable
            columns={columns}
            rows={data?.scripts ?? []}
            rowKey={(s) => s.id}
            loading={loading}
            onRowClick={(s) => setSelectedId(s.id)}
            empty={
              <EmptyState
                icon={<FileCode2 className="h-6 w-6" aria-hidden="true" />}
                title={search.trim() || visibility ? 'Tidak ada script yang cocok' : 'Belum ada script'}
                description={
                  search.trim() || visibility
                    ? 'Ubah kata kunci atau filter visibilitas.'
                    : 'Simpan script pengujian pertama Anda agar bisa dipakai ulang oleh perangkat.'
                }
                actionLabel={search.trim() || visibility ? undefined : 'Skrip Baru'}
                onAction={search.trim() || visibility ? undefined : () => setOpen(true)}
              />
            }
          />
        </WindowCard>
      )}

      {selectedId && (
        <ScriptDetail
          key={selectedId}
          id={selectedId}
          onClose={() => setSelectedId(null)}
          onChanged={reload}
        />
      )}

      {open && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center overflow-y-auto bg-black/50 px-4 py-8">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Skrip baru"
            className="w-full max-w-lg"
          >
            <WindowCard title="Skrip baru">
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

type DetailProps = {
  id: string;
  onClose: () => void;
  onChanged: () => void;
};

/** Panel detail di halaman yang sama: metadata, riwayat versi, pull, tambah versi, hapus. */
const ScriptDetail: React.FC<DetailProps> = ({ id, onClose, onChanged }) => {
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

  if (detail.loading) {
    return (
      <WindowCard title="Detail script">
        <p className="font-mono text-sm text-[var(--color-text-muted)]">memuat detail…</p>
      </WindowCard>
    );
  }

  if (detail.error || !script) {
    return (
      <WindowCard title="Detail script">
        <p role="alert" className="font-sans text-sm text-[var(--color-danger)]">
          {detail.error?.message ?? 'Script tidak ditemukan.'}
        </p>
        <Button variant="secondary" size="sm" className="mt-3" onClick={onClose}>
          Tutup
        </Button>
      </WindowCard>
    );
  }

  const versions = history.data?.versions ?? [];

  return (
    <>
      <WindowCard title={`script · ${script.name}`}>
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
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
              {TYPE_LABEL[script.type] ?? script.type}
            </dd>
          </div>
          <div>
            <dt className={LABEL}>Visibilitas</dt>
            <dd className="font-sans text-sm text-[var(--color-text-primary)]">
              {VISIBILITY_LABEL[script.visibility] ?? script.visibility}
            </dd>
          </div>
          <div>
            <dt className={LABEL}>Versi terbaru</dt>
            <dd className="font-mono text-sm text-[var(--color-text-primary)]">
              {script.latestVersionNo != null ? `v${script.latestVersionNo}` : '—'}
            </dd>
          </div>
          <div>
            <dt className={LABEL}>Dibuat</dt>
            <dd className="font-mono text-xs text-[var(--color-text-secondary)]">
              {new Date(script.createdAt).toLocaleString('id-ID')}
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
                <li
                  key={v.id}
                  className="flex flex-wrap items-center justify-between gap-2 px-3 py-2"
                >
                  <div className="min-w-0">
                    <p className="font-mono text-xs text-[var(--color-text-primary)]">
                      v{v.versionNo}{' '}
                      <span className="text-[var(--color-text-muted)]">
                        {v.contentHash.slice(0, 10)}
                      </span>
                    </p>
                    {v.note && (
                      <p className="font-sans text-xs text-[var(--color-text-secondary)]">
                        {v.note}
                      </p>
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
  );
};

export default ScriptsPage;
