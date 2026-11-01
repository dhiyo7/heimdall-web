import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MonitorSmartphone } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
import { WindowCard } from '../../../components/ui/WindowCard';
import { ApiError } from '../../../lib/api/client';
import { listDevices, revokeDevice } from '../../../lib/api/devices';
import type { Device } from '../../../lib/api/types';
import { useAuth } from '../../../lib/auth/AuthContext';
import { useApi } from '../../../lib/useApi';
import { ConfirmDialog } from '../ConfirmDialog';
import { DataTable, type Column } from '../DataTable';
import { EmptyState } from '../EmptyState';
import { useToast } from '../Toast';

/** ponytail: teks console masih hardcode Indonesia; pindahkan ke I18nContext saat console perlu dua bahasa. */
const DevicesPage: React.FC = () => {
  const { user, activeOrg, role } = useAuth();
  const navigate = useNavigate();
  const { push } = useToast();
  const { data, loading, error, reload } = useApi(() => listDevices(), []);
  const [showSteps, setShowSteps] = useState(false);
  const [target, setTarget] = useState<Device | null>(null);
  const [busy, setBusy] = useState(false);

  const rows = (data?.devices ?? []).filter((d) => d.orgId === activeOrg?.id);

  const handleRevoke = async () => {
    if (!target) return;
    setBusy(true);
    try {
      await revokeDevice(target.id);
      push('Perangkat dilepas.');
      setTarget(null);
      reload();
    } catch (err) {
      push(err instanceof ApiError ? err.message : 'Gagal melepas perangkat.', 'error');
    } finally {
      setBusy(false);
    }
  };

  const columns: Column<Device>[] = [
    {
      key: 'name',
      label: 'Nama',
      render: (d) => (
        <span className="font-sans font-semibold text-[var(--color-text-primary)]">{d.name}</span>
      ),
    },
    { key: 'os', label: 'OS', mono: true },
    { key: 'orgName', label: 'Organisasi' },
    {
      key: 'createdAt',
      label: 'Ditautkan',
      mono: true,
      render: (d) => new Date(d.createdAt).toLocaleDateString('id-ID'),
    },
    {
      key: 'lastSeenAt',
      label: 'Terakhir terlihat',
      mono: true,
      render: (d) => new Date(d.lastSeenAt).toLocaleString('id-ID'),
    },
    {
      key: 'actions',
      label: 'Aksi',
      render: (d) =>
        d.userId === user?.id || role === 'OWNER' || role === 'ADMIN' ? (
          <Button
            variant="tertiary"
            size="sm"
            aria-label={`Lepas ${d.name}`}
            className="!text-[var(--color-danger)]"
            onClick={() => setTarget(d)}
          >
            Lepas
          </Button>
        ) : (
          <span className="font-mono text-xs text-[var(--color-text-muted)]">—</span>
        ),
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-sans font-extrabold text-xl tracking-tight text-[var(--color-text-primary)]">
            Perangkat
          </h1>
          <p className="mt-1 max-w-2xl font-sans text-sm text-[var(--color-text-secondary)]">
            Perangkat yang tertaut memakai akun Anda untuk mengunggah hasil test dari aplikasi
            Desktop.
          </p>
        </div>
        <Button
          variant="primary"
          size="sm"
          onClick={() => setShowSteps((v) => !v)}
          aria-expanded={showSteps}
        >
          Tautkan perangkat
        </Button>
      </div>

      {showSteps && (
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-surface)] p-5">
          <p className="font-mono text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]">
            Cara menautkan
          </p>
          <ol className="mt-3 list-decimal space-y-2 pl-5 font-sans text-sm text-[var(--color-text-secondary)]">
            <li>
              Buka aplikasi Desktop Heimdall → menu <strong>Pengaturan → Tautkan ke Cloud</strong>.
            </li>
            <li>
              Salin kode 8 karakter yang muncul (format <span className="font-mono">XXXX-XXXX</span>).
            </li>
            <li>
              Buka halaman persetujuan, isi kode, pilih organisasi, tekan <strong>Setujui</strong>.
            </li>
          </ol>
          <Button
            variant="primary"
            size="sm"
            className="mt-4"
            onClick={() => navigate('/device')}
          >
            Buka halaman persetujuan
          </Button>
        </div>
      )}

      {error ? (
        <div
          role="alert"
          className="flex flex-wrap items-center justify-between gap-3 rounded-lg border border-[var(--color-danger)]/40 bg-[var(--color-danger)]/10 px-4 py-3"
        >
          <p className="font-sans text-sm text-[var(--color-danger)]">{error.message}</p>
          <Button variant="secondary" size="sm" onClick={reload}>
            Coba lagi
          </Button>
        </div>
      ) : (
        <WindowCard title="devices.list" contentClassName="p-2">
          <DataTable
            columns={columns}
            rows={rows}
            rowKey={(d) => d.id}
            loading={loading}
            empty={
              <EmptyState
                icon={<MonitorSmartphone className="h-6 w-6" aria-hidden="true" />}
                title="Belum ada perangkat tertaut"
                description="Tautkan aplikasi Desktop supaya hasil test bisa diunggah ke cloud."
                actionLabel="Tautkan perangkat"
                onAction={() => setShowSteps(true)}
              />
            }
          />
        </WindowCard>
      )}

      <ConfirmDialog
        open={!!target}
        title="Lepas perangkat?"
        description={`Perangkat "${target?.name ?? ''}" akan dilepas. Perangkat harus ditautkan ulang untuk mengunggah hasil.`}
        confirmLabel="Lepas"
        busy={busy}
        onConfirm={handleRevoke}
        onClose={() => setTarget(null)}
      />
    </div>
  );
};

export default DevicesPage;
