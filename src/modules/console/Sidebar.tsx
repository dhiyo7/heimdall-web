import React, { useEffect } from 'react';
import { NavLink } from 'react-router-dom';
import {
  FileBarChart,
  FileCode2,
  FolderKanban,
  LayoutDashboard,
  type LucideIcon,
  MailPlus,
  MonitorSmartphone,
  Settings,
  Users,
  X,
} from 'lucide-react';
import { useAuth } from '../../lib/auth/AuthContext';
import type { Role } from '../../lib/api/types';

type Item = {
  label: string;
  icon: LucideIcon;
  to?: string;
  roles?: Role[];
  soon?: boolean;
};

type Group = { title?: string; items: Item[] };

// ponytail: label console belum lewat I18nContext; tambahkan saat console perlu bahasa Inggris.
const GROUPS: Group[] = [
  { items: [{ label: 'Ringkasan', icon: LayoutDashboard, to: '/app' }] },
  {
    title: 'ORGANISASI',
    items: [
      { label: 'Workspace', icon: FolderKanban, to: '/app/workspaces' },
      { label: 'Anggota', icon: Users, to: '/app/members' },
      { label: 'Undangan', icon: MailPlus, to: '/app/invitations', roles: ['OWNER', 'ADMIN'] },
      { label: 'Perangkat', icon: MonitorSmartphone, to: '/app/devices' },
    ],
  },
  {
    title: 'KONTEN',
    items: [
      { label: 'Script', icon: FileCode2, to: '/app/scripts', soon: true },
      { label: 'Laporan', icon: FileBarChart, to: '/app/reports', soon: true },
    ],
  },
  {
    title: 'AKUN',
    items: [{ label: 'Pengaturan', icon: Settings, to: '/app/settings', roles: ['OWNER', 'ADMIN'] }],
  },
];

const itemClass = (active: boolean) =>
  `flex h-9 items-center gap-2.5 px-4 text-sm transition-colors ${
    active
      ? 'bg-[var(--color-surface-muted)] font-medium text-[var(--color-text-primary)] shadow-[inset_2px_0_0_var(--color-primary)]'
      : 'text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)]'
  }`;

type Props = { onNavigate?: () => void; open?: boolean; onClose?: () => void };

export const Sidebar: React.FC<Props> = ({ onNavigate, open = false, onClose }) => {
  const { role } = useAuth();

  // Drawer mobile: Esc menutup, latar tidak ikut ter-scroll.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose?.();
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [open, onClose]);

  const nav = (
    <nav className="flex h-full w-full flex-col" aria-label="Navigasi console">
      <div className="flex h-14 shrink-0 items-center gap-2 border-b border-[var(--color-border)] px-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-[var(--color-accent)] font-sans text-sm font-bold text-white">
          H
        </div>
        <span className="font-sans text-sm font-bold tracking-tight text-[var(--color-text-primary)]">
          HEIMDALL
        </span>
        {onClose && (
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup menu"
            className="ml-auto rounded-md p-1 text-[var(--color-text-muted)] hover:bg-[var(--color-surface)] hover:text-[var(--color-text-primary)] md:hidden"
          >
            <X size={16} aria-hidden="true" />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pb-4 pt-2">
        {GROUPS.map((group, gi) => {
          const items = group.items.filter((item) => !item.roles || (role && item.roles.includes(role)));
          if (items.length === 0) return null;
          return (
            <div key={group.title ?? gi} className={group.title ? 'mt-5 first:mt-0' : ''}>
              {group.title && (
                <p className="mb-1.5 px-4 font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]">
                  {group.title}
                </p>
              )}
              <div className="space-y-0.5">
                {items.map((item) => {
                  const Icon = item.icon;
                  if (item.soon || !item.to) {
                    return (
                      <span key={item.label} className={`${itemClass(false)} opacity-60`} aria-disabled="true">
                        <Icon size={16} className="shrink-0" aria-hidden="true" />
                        <span className="flex-1 truncate">{item.label}</span>
                        <span className="shrink-0 rounded border border-[var(--color-border)] px-1 py-0.5 font-mono text-[9px] leading-none">
                          Segera
                        </span>
                      </span>
                    );
                  }
                  return (
                    <NavLink
                      key={item.label}
                      to={item.to}
                      end={item.to === '/app'}
                      onClick={onNavigate}
                      className={({ isActive }) => itemClass(isActive)}
                    >
                      <Icon size={16} className="shrink-0" aria-hidden="true" />
                      <span className="flex-1 truncate">{item.label}</span>
                    </NavLink>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </nav>
  );

  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[200px] border-r border-[var(--color-border)] bg-[var(--color-background)] md:flex">
        {nav}
      </aside>

      {open && (
        <div className="fixed inset-0 z-50 md:hidden" role="dialog" aria-modal="true" aria-label="Navigasi console">
          <button
            type="button"
            aria-label="Tutup menu"
            onClick={onClose}
            className="absolute inset-0 bg-black/50"
          />
          <aside className="relative flex h-full w-[248px] max-w-[82vw] border-r border-[var(--color-border)] bg-[var(--color-background)] shadow-lg">
            {nav}
          </aside>
        </div>
      )}
    </>
  );
};
