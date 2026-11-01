import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../lib/auth/AuthContext';
import { useApi } from '../../../lib/useApi';
import { listMembers } from '../../../lib/api/memberships';
import { listWorkspaces } from '../../../lib/api/workspaces';
import { listDevices } from '../../../lib/api/devices';
import { Button } from '../../../components/ui/Button';
import { WindowCard } from '../../../components/ui/WindowCard';
import { EmptyState } from '../EmptyState';
import { RoleBadge } from '../RoleBadge';

const StatCard: React.FC<{ title: string; label: string; children: React.ReactNode }> = ({
  title,
  label,
  children,
}) => (
  <WindowCard title={title} noPadding>
    <div className="p-4">
      <p className="font-mono text-[10px] uppercase tracking-widest text-[var(--color-text-muted)]">
        {label}
      </p>
      {children}
    </div>
  </WindowCard>
);

const OverviewPage: React.FC = () => {
  const { activeOrg, role } = useAuth();
  const navigate = useNavigate();
  const orgId = activeOrg?.id;

  const { data, loading, error, reload } = useApi(
    () =>
      orgId
        ? Promise.all([listMembers(orgId), listWorkspaces(orgId), listDevices()])
        : Promise.resolve(null),
    [orgId],
  );

  if (!activeOrg) {
    return (
      <EmptyState
        title="Belum punya organisasi"
        description="Buat organisasi dulu untuk mulai memakai console."
      />
    );
  }

  const counts = data
    ? {
        members: data[0].members.length,
        workspaces: data[1].workspaces.length,
        devices: data[2].devices.filter((d) => d.orgId === activeOrg.id).length,
      }
    : null;

  return (
    <div>
      <div className="mb-4">
        <h1 className="font-sans text-xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
          Ringkasan
        </h1>
        <p className="mt-0.5 font-mono text-xs text-[var(--color-text-muted)]">{activeOrg.name}</p>
      </div>

      {loading && (
        <div className="space-y-2" aria-busy="true">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-12 animate-pulse rounded-lg bg-[var(--color-surface-muted)]" />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="rounded-lg border border-[var(--color-danger)]/40 bg-[var(--color-danger)]/10 p-4">
          <p className="font-mono text-xs text-[var(--color-danger)]">{error.message}</p>
          <Button variant="secondary" size="sm" className="mt-3" onClick={reload}>
            Coba lagi
          </Button>
        </div>
      )}

      {!loading && !error && counts && (
        <>
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <StatCard title="Anggota" label="Anggota">
              <p className="font-mono text-3xl font-extrabold text-[var(--color-text-primary)]">
                {counts.members}
              </p>
            </StatCard>
            <StatCard title="Workspace" label="Workspace">
              <p className="font-mono text-3xl font-extrabold text-[var(--color-text-primary)]">
                {counts.workspaces}
              </p>
            </StatCard>
            <StatCard title="Perangkat" label="Perangkat">
              <p className="font-mono text-3xl font-extrabold text-[var(--color-text-primary)]">
                {counts.devices}
              </p>
            </StatCard>
            <StatCard title="Peran Anda" label="Peran Anda">
              <div className="mt-2">
                <RoleBadge role={activeOrg.role} />
              </div>
            </StatCard>
          </div>

          <div className="mt-4">
            <WindowCard title="Aksi cepat">
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" size="sm" onClick={() => navigate('/app/workspaces')}>
                  Buat workspace
                </Button>
                {role !== 'MEMBER' && (
                  <Button variant="secondary" size="sm" onClick={() => navigate('/app/invitations')}>
                    Undang anggota
                  </Button>
                )}
                <Button variant="secondary" size="sm" onClick={() => navigate('/app/devices')}>
                  Tautkan perangkat
                </Button>
              </div>
            </WindowCard>
          </div>

          {counts.workspaces === 0 && (
            <div className="mt-4">
              <EmptyState
                title="Belum ada workspace"
                description="Workspace memisahkan pengujian per produk atau tim. Buat yang pertama untuk mulai memakai Heimdall."
                actionLabel="Buat workspace pertama"
                onAction={() => navigate('/app/workspaces')}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default OverviewPage;
