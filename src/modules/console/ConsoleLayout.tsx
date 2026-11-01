import React, { useEffect, useState } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { X } from 'lucide-react';
import { useAuth } from '../../lib/auth/AuthContext';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';

const ConsoleLayout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [verifyBanner, setVerifyBanner] = useState(true);
  const { user } = useAuth();
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)]">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} onNavigate={() => setSidebarOpen(false)} />

      <div className="md:pl-[200px]">
        <Topbar onOpenSidebar={() => setSidebarOpen(true)} />
        {user?.emailVerified === false && verifyBanner && (
          <div
            role="status"
            className="flex items-center justify-between gap-2 border-b border-[var(--color-warning)]/30 bg-[var(--color-warning)]/10 px-3 py-1.5 sm:px-5 md:px-6"
          >
            <p className="min-w-0 truncate font-sans text-xs text-[var(--color-warning)]">
              Email belum diverifikasi.{' '}
              <Link to="/verify-email" className="font-semibold underline">
                Verifikasi sekarang
              </Link>
            </p>
            <button
              type="button"
              onClick={() => setVerifyBanner(false)}
              aria-label="Tutup pemberitahuan"
              className="shrink-0 rounded-md p-1 text-[var(--color-warning)] hover:bg-[var(--color-warning)]/20"
            >
              <X size={14} aria-hidden="true" />
            </button>
          </div>
        )}
        <main className="mx-auto w-full max-w-[1240px] px-3 py-5 sm:px-5 md:px-6 md:py-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default ConsoleLayout;
