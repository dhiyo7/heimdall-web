import React, { useEffect, useRef } from 'react';

export type ContextMenuItem = {
  id: string;
  label: string;
  onSelect: () => void;
  /** Merah (hapus). */
  danger?: boolean;
  disabled?: boolean;
};

export type ContextMenuPosition = { x: number; y: number };

type Props = {
  position: ContextMenuPosition | null;
  items: ContextMenuItem[];
  onClose: () => void;
  ariaLabel?: string;
};

/**
 * SPEC-32 FR-13, NFR-4: menu klik-kanan reusable. Terbuka via klik-kanan atau
 * keyboard (Enter/Space pada item); ditutup `Esc`, klik luar, atau pilihan.
 * Aksi tanpa izin cukup tidak dimasukkan ke `items` (NFR-9).
 */
export const ContextMenu: React.FC<Props> = ({ position, items, onClose, ariaLabel = 'Menu aksi' }) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!position) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose();
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('mousedown', onDown);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('mousedown', onDown);
    };
  }, [position, onClose]);

  useEffect(() => {
    if (!position) return;
    // Fokus item pertama supaya navigasi keyboard langsung jalan.
    ref.current?.querySelector<HTMLButtonElement>('button:not([disabled])')?.focus();
  }, [position]);

  if (!position || items.length === 0) return null;

  return (
    <div
      ref={ref}
      role="menu"
      aria-label={ariaLabel}
      style={{ top: position.y, left: position.x }}
      className="fixed z-[85] min-w-[180px] rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] py-1 shadow-lg"
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          role="menuitem"
          disabled={item.disabled}
          onClick={() => {
            item.onSelect();
            onClose();
          }}
          className={`block w-full px-3 py-2 text-left font-sans text-sm hover:bg-[var(--color-surface)] disabled:cursor-not-allowed disabled:opacity-50 ${
            item.danger ? 'text-[var(--color-danger)]' : 'text-[var(--color-text-primary)]'
          }`}
        >
          {item.label}
        </button>
      ))}
    </div>
  );
};
