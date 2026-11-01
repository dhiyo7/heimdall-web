import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { apiGet, apiPost, refreshSession, setAccessToken } from '../api/client';
import { listOrganizations } from '../api/organizations';
import type { AuthResult, Organization, Role, User } from '../api/types';

const ACTIVE_ORG_KEY = 'heimdall.activeOrgId';

type AuthContextValue = {
  user: User | null;
  orgs: Organization[];
  activeOrg: Organization | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (input: { email: string; password: string; fullName?: string }) => Promise<void>;
  logout: () => Promise<void>;
  reloadOrgs: () => Promise<void>;
  setActiveOrg: (orgId: string) => void;
  /** Peran user di organisasi aktif. */
  role: Role | null;
};

const AuthContext = createContext<AuthContextValue | null>(null);

/** Simpan organisasi aktif agar bertahan setelah reload. */
function pickActive(orgs: Organization[]): Organization | null {
  const savedId = localStorage.getItem(ACTIVE_ORG_KEY);
  return orgs.find((o) => o.id === savedId) ?? orgs[0] ?? null;
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [orgs, setOrgs] = useState<Organization[]>([]);
  const [activeOrgId, setActiveOrgId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const reloadOrgs = useCallback(async () => {
    const { organizations } = await listOrganizations();
    setOrgs(organizations);
    const active = pickActive(organizations);
    setActiveOrgId(active?.id ?? null);
    if (active) localStorage.setItem(ACTIVE_ORG_KEY, active.id);
  }, []);

  // Bootstrap: coba pulihkan sesi dari cookie refresh (access token hilang saat reload).
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        if (await refreshSession()) {
          const { user: me } = await apiGet<{ user: User }>('/v1/auth/me');
          if (cancelled) return;
          setUser(me);
          await reloadOrgs();
        }
      } catch {
        setAccessToken(null);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [reloadOrgs]);

  const applySession = useCallback(
    async (result: AuthResult) => {
      setAccessToken(result.accessToken);
      setUser(result.user);
      await reloadOrgs();
    },
    [reloadOrgs],
  );

  const login = useCallback(
    async (email: string, password: string) => {
      await applySession(await apiPost<AuthResult>('/v1/auth/login', { email, password }));
    },
    [applySession],
  );

  const register = useCallback(
    async (input: { email: string; password: string; fullName?: string }) => {
      await applySession(await apiPost<AuthResult>('/v1/auth/register', input));
    },
    [applySession],
  );

  const logout = useCallback(async () => {
    try {
      await apiPost<void>('/v1/auth/logout', {});
    } finally {
      setAccessToken(null);
      setUser(null);
      setOrgs([]);
      setActiveOrgId(null);
      localStorage.removeItem(ACTIVE_ORG_KEY);
    }
  }, []);

  const setActiveOrg = useCallback((orgId: string) => {
    setActiveOrgId(orgId);
    localStorage.setItem(ACTIVE_ORG_KEY, orgId);
  }, []);

  const activeOrg = useMemo(
    () => orgs.find((o) => o.id === activeOrgId) ?? null,
    [orgs, activeOrgId],
  );

  const value = useMemo(
    () => ({
      user,
      orgs,
      activeOrg,
      loading,
      login,
      register,
      logout,
      reloadOrgs,
      setActiveOrg,
      role: activeOrg?.role ?? null,
    }),
    [user, orgs, activeOrg, loading, login, register, logout, reloadOrgs, setActiveOrg],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam AuthProvider');
  return ctx;
}

export const RequireAuth: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
        <p className="font-mono text-sm text-[var(--color-text-muted)]">memuat sesi…</p>
      </div>
    );
  }
  if (!user) {
    const next = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?next=${next}`} replace />;
  }
  return <>{children}</>;
};

/** Tombol tetap disembunyikan untuk peran lain; backend tetap penentu akhir. */
export const RequireRole: React.FC<{ roles: Role[]; children: React.ReactNode }> = ({
  roles,
  children,
}) => {
  const { role } = useAuth();
  if (!role || !roles.includes(role)) {
    return (
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-6">
        <p className="font-mono text-sm text-[var(--color-text-muted)]">
          Tidak punya akses ke halaman ini.
        </p>
      </div>
    );
  }
  return <>{children}</>;
};
