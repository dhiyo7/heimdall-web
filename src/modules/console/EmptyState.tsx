import React from 'react';
import { Button } from '../../components/ui/Button';

type Props = {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
};

export const EmptyState: React.FC<Props> = ({ title, description, actionLabel, onAction, icon }) => (
  <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-[var(--color-border)] bg-[var(--color-surface)]/40 px-6 py-12 text-center">
    {icon && <div className="text-[var(--color-text-muted)]">{icon}</div>}
    <p className="font-sans text-sm font-bold text-[var(--color-text-primary)]">{title}</p>
    {description && (
      <p className="max-w-md font-sans text-xs text-[var(--color-text-muted)]">{description}</p>
    )}
    {actionLabel && onAction && (
      <Button variant="primary" size="sm" onClick={onAction} className="mt-2">
        {actionLabel}
      </Button>
    )}
  </div>
);
