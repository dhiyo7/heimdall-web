import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { useAuth } from '../../lib/auth/AuthContext';
import { RoleBadge } from './RoleBadge';

const SWITCHER_BTN =
  'flex h-8 items-center gap-1 rounded-md border border-[var(--color-border)] px-2 text-xs font-sans hover:bg-[var(--color-surface)]';

export const OrgSwitcher: React.FC = () => {
  const { orgs, activeOrg, setActiveOrg } = useAuth();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  if (!activeOrg) return null;

  if (orgs.length <= 1) {
    return (
      <span className="hidden font-mono text-xs text-[var(--color-text-muted)] sm:inline">
        {activeOrg.name}
      </span>
    );
  }

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={SWITCHER_BTN}
      >
        <span className="max-w-[88px] truncate sm:max-w-[140px]">{activeOrg.name}</span>
        <ChevronDown size={14} aria-hidden="true" />
      </button>

      {open && (
        <div
          role="menu"
          className="absolute right-0 mt-2 w-64 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-1 shadow-md"
        >
          {orgs.map((org) => (
            <button
              key={org.id}
              type="button"
              role="menuitem"
              onClick={() => {
                setActiveOrg(org.id);
                setOpen(false);
              }}
              className="flex w-full items-center justify-between gap-2 rounded-md px-2 py-1.5 text-left text-xs text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]"
            >
              <span className="truncate">{org.name}</span>
              <RoleBadge role={org.role} />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
