import React, { useCallback, useState } from 'react';
import { ArrowDownUp, Download, LayoutGrid, List, Search } from 'lucide-react';
import { Button } from '../../../components/ui/Button';

export type ViewMode = 'grid' | 'list';
export type SortKey = 'name' | 'size' | 'updatedAt';

const VIEW_KEY = 'heimdall.scripts.view';
const SORT_KEY = 'heimdall.scripts.sort';

const read = <T extends string>(key: string, fallback: T, allowed: readonly T[]): T => {
  try {
    const v = localStorage.getItem(key);
    return v && (allowed as readonly string[]).includes(v) ? (v as T) : fallback;
  } catch {
    return fallback;
  }
};

/** SPEC-32 FR-11: preferensi tampilan (grid/list + sort) persisten di localStorage. */
export function useViewPrefs() {
  const [view, setViewState] = useState<ViewMode>(() => read(VIEW_KEY, 'grid', ['grid', 'list'] as const));
  const [sort, setSortState] = useState<SortKey>(() =>
    read(SORT_KEY, 'updatedAt', ['name', 'size', 'updatedAt'] as const),
  );

  const setView = useCallback((v: ViewMode) => {
    setViewState(v);
    try {
      localStorage.setItem(VIEW_KEY, v);
    } catch {
      /* localStorage penuh/diblokir: abaikan */
    }
  }, []);

  const setSort = useCallback((s: SortKey) => {
    setSortState(s);
    try {
      localStorage.setItem(SORT_KEY, s);
    } catch {
      /* abaikan */
    }
  }, []);

  return { view, setView, sort, setSort };
}

export const SORT_LABEL: Record<SortKey, string> = {
  name: 'Nama',
  size: 'Ukuran',
  updatedAt: 'Diperbarui',
};

type Props = {
  search: string;
  onSearch: (value: string) => void;
  view: ViewMode;
  onView: (view: ViewMode) => void;
  sort: SortKey;
  onSort: (sort: SortKey) => void;
  onPull: () => void;
  pullBusy?: boolean;
  /** Tombol buka drawer folder tree (mobile). */
  onOpenTree?: () => void;
};

/** SPEC-32 FR-11: toolbar search + toggle view + sort + Pull. */
export const ScriptToolbar: React.FC<Props> = ({
  search,
  onSearch,
  view,
  onView,
  sort,
  onSort,
  onPull,
  pullBusy,
  onOpenTree,
}) => {
  const toggleBtn =
    'grid h-9 w-9 place-items-center rounded-md border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)]';
  const activeBtn = 'bg-[var(--color-primary)]/10 !text-[var(--color-primary)] !border-[var(--color-primary)]/40';

  return (
    <div className="flex flex-wrap items-center gap-2">
      {onOpenTree && (
        <Button variant="secondary" size="sm" className="md:hidden" onClick={onOpenTree}>
          Folder
        </Button>
      )}

      <div className="relative min-w-[180px] flex-1">
        <Search
          className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]"
          aria-hidden="true"
        />
        <input
          type="search"
          value={search}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Cari nama script…"
          aria-label="Cari script"
          className="h-9 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] pl-9 pr-3 font-sans text-sm text-[var(--color-text-primary)] focus:border-[var(--color-primary)] focus:outline-none"
        />
      </div>

      <label className="sr-only" htmlFor="scripts-sort">
        Urutkan
      </label>
      <div className="relative">
        <ArrowDownUp
          className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-[var(--color-text-muted)]"
          aria-hidden="true"
        />
        <select
          id="scripts-sort"
          value={sort}
          onChange={(e) => onSort(e.target.value as SortKey)}
          className="h-9 cursor-pointer rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] pl-8 pr-2 font-sans text-sm text-[var(--color-text-primary)] focus:border-[var(--color-primary)] focus:outline-none"
        >
          {(Object.keys(SORT_LABEL) as SortKey[]).map((k) => (
            <option key={k} value={k}>
              {SORT_LABEL[k]}
            </option>
          ))}
        </select>
      </div>

      <div className="flex items-center gap-1">
        <button
          type="button"
          aria-label="Tampilan grid"
          aria-pressed={view === 'grid'}
          onClick={() => onView('grid')}
          className={`${toggleBtn} ${view === 'grid' ? activeBtn : ''}`}
        >
          <LayoutGrid className="h-4 w-4" />
        </button>
        <button
          type="button"
          aria-label="Tampilan daftar"
          aria-pressed={view === 'list'}
          onClick={() => onView('list')}
          className={`${toggleBtn} ${view === 'list' ? activeBtn : ''}`}
        >
          <List className="h-4 w-4" />
        </button>
      </div>

      <Button variant="primary" size="sm" onClick={onPull} disabled={pullBusy}>
        <Download className="mr-1.5 h-4 w-4" aria-hidden="true" />
        {pullBusy ? 'Memuat…' : 'Pull'}
      </Button>
    </div>
  );
};
