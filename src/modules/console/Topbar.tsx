import React, { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { useAuth } from '../../lib/auth/AuthContext';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { RoleBadge } from './RoleBadge';
import { OrgSwitcher } from './OrgSwitcher';

const PAGE_LABEL: Record<string, string> = {
  '/app': 'Ringkasan',
  '/app/workspaces': 'Workspace',
  '/app/members': 'Anggota',
  '/app/invitations': 'Undangan',
  '/app/devices': 'Perangkat',
  '/app/settings': 'Pengaturan',
};

const pageLabel = (pathname: string) =>
  pathname.startsWith('/app/workspaces/')
    ? 'Detail workspace'
    : PAGE_LABEL[pathname] ?? 'Ringkasan';

type Props = { onOpenSidebar: () => void };

export const Topbar: React.FC<Props> = ({ onOpenSidebar }) => {
  const { user, activeOrg, logout } = useAuth();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuOpen) return;
    const onDown = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMenuOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDown);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const handleLogout = async () => {
    try {
      await logout();
    } catch {
      // sesi lokal sudah dibersihkan di dalam logout
    }
    navigate('/login');
  };

  const displayName = user?.fullName || user?.email || '?';
  const initial = displayName.charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-2 border-b border-[var(--color-border)] bg-[var(--color-background)] px-3 sm:gap-3 sm:px-4 md:px-6">
      <div className="flex min-w-0 items-center gap-2">
        <button
          type="button"
          onClick={onOpenSidebar}
          aria-label="Buka menu"
          className="shrink-0 rounded-md border border-[var(--color-border)] p-1.5 text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] md:hidden"
        >
          <Menu size={18} aria-hidden="true" />
        </button>

        <p className="min-w-0 truncate font-mono text-xs text-[var(--color-text-muted)]">
          <span className="hidden sm:inline">{activeOrg?.name ?? '—'}</span>
          <span className="mx-1 hidden sm:inline">/</span>
          <span className="text-[var(--color-text-primary)]">{pageLabel(pathname)}</span>
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
        <OrgSwitcher />
        <ThemeToggle />

        <div className="relative" ref={menuRef}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
            aria-label="Menu pengguna"
            className="flex items-center gap-2 rounded-md px-1.5 py-1 hover:bg-[var(--color-surface)]"
          >
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-[var(--color-surface-muted)] font-mono text-xs text-[var(--color-text-primary)]">
              {initial}
            </span>
            <span className="hidden max-w-[160px] truncate text-xs text-[var(--color-text-secondary)] sm:block">
              {displayName}
            </span>
          </button>

          {menuOpen && (
            <div
              role="menu"
              className="absolute right-0 mt-2 w-56 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-2 shadow-md"
            >
              <p className="truncate px-2 py-1 font-mono text-xs text-[var(--color-text-muted)]">
                {user?.email}
              </p>
              {activeOrg && (
                <div className="px-2 py-1">
                  <RoleBadge role={activeOrg.role} />
                </div>
              )}
              <button
                type="button"
                onClick={handleLogout}
                className="mt-1 w-full rounded-md px-2 py-1.5 text-left text-xs text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]"
              >
                Keluar
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
