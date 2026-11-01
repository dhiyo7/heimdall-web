import React from 'react';
import { Button } from '../../components/ui/Button';

type Props = {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  busy?: boolean;
  onConfirm: () => void;
  onClose: () => void;
};

/** Dialog konfirmasi untuk aksi merusak (hapus/keluarkan). Esc menutup. */
export const ConfirmDialog: React.FC<Props> = ({
  open,
  title,
  description,
  confirmLabel = 'Ya, lanjutkan',
  busy,
  onConfirm,
  onClose,
}) => {
  React.useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-black/50 px-4">
      <div
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className="w-full max-w-sm rounded-xl border border-[var(--color-border)] bg-[var(--color-background)] p-5 shadow-lg"
      >
        <h2 className="font-sans text-base font-extrabold text-[var(--color-text-primary)]">{title}</h2>
        <p className="mt-2 font-sans text-xs text-[var(--color-text-secondary)]">{description}</p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="secondary" size="sm" onClick={onClose} disabled={busy}>
            Batal
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={onConfirm}
            disabled={busy}
            className="!bg-[var(--color-danger)] !border-[var(--color-danger)]"
          >
            {busy ? 'Memproses…' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  );
};
