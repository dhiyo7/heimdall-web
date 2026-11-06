import React, { useMemo, useRef, useState } from 'react';
import { ChevronRight, Folder as FolderIcon, FolderOpen } from 'lucide-react';
import type { Folder } from '../../../lib/api/types';

type Props = {
  folders: Folder[];
  /** Path folder aktif (null = root). */
  activePath: string | null;
  onSelect: (path: string | null) => void;
};

type Node = Folder & { children: Node[] };

function buildTree(folders: Folder[]): Node[] {
  const byId = new Map<string, Node>();
  folders.forEach((f) => byId.set(f.id, { ...f, children: [] }));
  const roots: Node[] = [];
  byId.forEach((node) => {
    const parent = node.parentId ? byId.get(node.parentId) : null;
    if (parent) parent.children.push(node);
    else roots.push(node);
  });
  const sort = (nodes: Node[]) => {
    nodes.sort((a, b) => a.name.localeCompare(b.name, 'id'));
    nodes.forEach((n) => sort(n.children));
  };
  sort(roots);
  return roots;
}

/** SPEC-32 FR-9, NFR-4: tree folder TMS dengan expand lazy (anak hanya saat dibuka). */
export const FolderTree: React.FC<Props> = ({ folders, activePath, onSelect }) => {
  const tree = useMemo(() => buildTree(folders), [folders]);
  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const ref = useRef<HTMLUListElement>(null);

  const toggle = (id: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  const flat = useMemo(() => {
    const out: Node[] = [];
    const walk = (nodes: Node[]) =>
      nodes.forEach((n) => {
        out.push(n);
        if (expanded.has(n.id)) walk(n.children);
      });
    walk(tree);
    return out;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tree, expanded]);

  const focusItem = (folderId: string) =>
    ref.current?.querySelector<HTMLElement>(`[data-folder-id="${folderId}"]`)?.focus();

  const onKeyDown = (e: React.KeyboardEvent, node: Node) => {
    const idx = flat.findIndex((n) => n.id === node.id);
    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();
        if (node.children.length > 0 && !expanded.has(node.id)) toggle(node.id);
        break;
      case 'ArrowLeft':
        e.preventDefault();
        if (expanded.has(node.id)) toggle(node.id);
        else if (node.parentId) focusItem(node.parentId);
        break;
      case 'ArrowDown':
        e.preventDefault();
        if (idx >= 0 && idx < flat.length - 1) focusItem(flat[idx + 1].id);
        break;
      case 'ArrowUp':
        e.preventDefault();
        if (idx > 0) focusItem(flat[idx - 1].id);
        break;
      case 'Enter':
      case ' ':
        e.preventDefault();
        onSelect(node.path);
        break;
      default:
        break;
    }
  };

  const renderNode = (node: Node) => {
    const hasChildren = node.children.length > 0;
    const isOpen = expanded.has(node.id);
    const isActive = activePath === node.path;
    return (
      <li key={node.id} role="treeitem" aria-expanded={hasChildren ? isOpen : undefined} aria-selected={isActive}>
        <div className="flex items-center gap-0.5">
          {hasChildren ? (
            <button
              type="button"
              tabIndex={-1}
              aria-label={isOpen ? `Tutup ${node.name}` : `Buka ${node.name}`}
              onClick={() => toggle(node.id)}
              className="grid h-6 w-6 shrink-0 place-items-center rounded-md text-[var(--color-text-muted)] hover:bg-[var(--color-surface)]"
            >
              <ChevronRight className={`h-3.5 w-3.5 transition-transform ${isOpen ? 'rotate-90' : ''}`} />
            </button>
          ) : (
            <span className="w-6 shrink-0" aria-hidden="true" />
          )}
          <button
            type="button"
            data-folder-id={node.id}
            onKeyDown={(e) => onKeyDown(e, node)}
            onClick={() => onSelect(node.path)}
            title={node.path}
            className={`flex min-w-0 flex-1 items-center gap-2 rounded-md px-2 py-1.5 text-left font-sans text-sm ${
              isActive
                ? 'bg-[var(--color-primary)]/10 font-semibold text-[var(--color-primary)]'
                : 'text-[var(--color-text-secondary)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)]'
            }`}
          >
            {isOpen ? (
              <FolderOpen className="h-4 w-4 shrink-0" aria-hidden="true" />
            ) : (
              <FolderIcon className="h-4 w-4 shrink-0" aria-hidden="true" />
            )}
            <span className="truncate">{node.name}</span>
          </button>
        </div>
        {hasChildren && isOpen && (
          <ul role="group" className="ml-3 border-l border-[var(--color-border)] pl-1">
            {node.children.map(renderNode)}
          </ul>
        )}
      </li>
    );
  };

  if (tree.length === 0) {
    return (
      <p className="px-2 py-3 font-sans text-xs text-[var(--color-text-muted)]">
        Belum ada folder. Folder mengikuti hierarki pengujian dari Desktop.
      </p>
    );
  }

  return (
    <ul ref={ref} role="tree" aria-label="Folder script" className="space-y-0.5">
      {tree.map(renderNode)}
    </ul>
  );
};
