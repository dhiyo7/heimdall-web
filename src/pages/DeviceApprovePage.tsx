import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { WindowCard } from '../components/ui/WindowCard';
import { ApiError } from '../lib/api/client';
import { approveDevice, denyDevice } from '../lib/api/devices';
import { useAuth } from '../lib/auth/AuthContext';

const labelClass =
  'mb-2 block font-mono text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]';

/** Buang non-alfanumerik, uppercase, lalu sisipkan tanda hubung setelah 4 karakter. */
const formatCode = (raw: string) =>
  raw
    .replace(/[^a-z0-9]/gi, '')
    .toUpperCase()
    .slice(0, 8)
    .replace(/(.{4})(?=.)/, '$1-');

const describeError = (err: unknown) => {
  if (!(err instanceof ApiError)) return 'Gagal memproses. Coba lagi.';
  if (err.status === 404) return 'Kode tidak ditemukan atau sudah kedaluwarsa.';
  if (err.status === 410) return 'Kode sudah kedaluwarsa. Minta kode baru dari aplikasi Desktop.';
  if (err.status === 403) return 'Anda bukan anggota organisasi itu.';
  return err.message;
};

const DeviceApprovePage: React.FC = () => {
  const { orgs, activeOrg } = useAuth();
  const navigate = useNavigate();
  const [code, setCode] = useState('');
  const [orgId, setOrgId] = useState(activeOrg?.id ?? orgs[0]?.id ?? '');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [approved, setApproved] = useState(false);
  const [denied, setDenied] = useState(false);
  const [showManualHint, setShowManualHint] = useState(false);
  const hintTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(hintTimer.current), []);

  const handleApprove = async (e: React.FormEvent) => {
    e.preventDefault();
    const targetOrg = orgId || activeOrg?.id || orgs[0]?.id;
    if (!targetOrg) {
      setError('Pilih organisasi tujuan.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await approveDevice(code, targetOrg);
      setApproved(true);
      // Sinyal balik ke Desktop; deviceCode tetap di sisi Desktop (tidak ikut di URL).
      try {
        window.location.href = 'heimdall://auth/callback';
      } catch {
        // Browser tidak mengenal skema — pengguna melihat fallback manual di bawah.
      }
      hintTimer.current = window.setTimeout(() => setShowManualHint(true), 2500);
    } catch (err) {
      setError(describeError(err));
    } finally {
      setBusy(false);
    }
  };

  const handleDeny = async () => {
    setBusy(true);
    setError(null);
    try {
      await denyDevice(code);
      setDenied(true);
    } catch (err) {
      setError(describeError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container mx-auto max-w-xl px-4 py-12">
      <WindowCard title="device.approve" date="DEVICE">
        {approved ? (
          <div className="py-4 text-center">
            <CheckCircle2
              className="mx-auto h-10 w-10 text-[var(--color-success)]"
              aria-hidden="true"
            />
            <p className="mt-3 font-sans text-base font-extrabold text-[var(--color-text-primary)]">
              Perangkat disetujui.
            </p>
            <p className="mt-1 font-sans text-sm text-[var(--color-text-secondary)]">
              Kembali ke aplikasi Desktop untuk melanjutkan.
            </p>
            {showManualHint && (
              <p role="status" className="mt-3 font-sans text-xs text-[var(--color-text-muted)]">
                Jika aplikasi Heimdall tidak terbuka otomatis, silakan buka aplikasi secara
                manual — persetujuan sudah tersimpan.
              </p>
            )}
            <Button
              variant="primary"
              size="sm"
              className="mt-5"
              onClick={() => navigate('/app/devices')}
            >
              Buka console
            </Button>
          </div>
        ) : denied ? (
          <p
            role="status"
            className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 font-sans text-sm text-[var(--color-text-secondary)]"
          >
            Permintaan ditolak.
          </p>
        ) : (
          <>
            <h1 className="font-sans font-extrabold text-xl tracking-tight text-[var(--color-text-primary)]">
              Setujui perangkat
            </h1>
            <p className="mt-1 font-sans text-sm text-[var(--color-text-secondary)]">
              Masukkan kode yang tampil di aplikasi Desktop Heimdall.
            </p>

            <form onSubmit={handleApprove} className="mt-5 space-y-5">
              <div>
                <label htmlFor="device-code" className={labelClass}>
                  Kode perangkat
                </label>
                <input
                  id="device-code"
                  value={code}
                  onChange={(e) => setCode(formatCode(e.target.value))}
                  maxLength={9}
                  autoComplete="off"
                  inputMode="text"
                  placeholder="XXXX-XXXX"
                  aria-describedby="device-code-hint"
                  className="h-14 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-center font-mono text-2xl tracking-[0.3em] text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:outline-none"
                />
                <p
                  id="device-code-hint"
                  className="mt-2 font-sans text-xs text-[var(--color-text-muted)]"
                >
                  Kode 8 karakter dari menu Pengaturan → Tautkan ke Cloud.
                </p>
              </div>

              {orgs.length > 1 && (
                <div>
                  <label htmlFor="device-org" className={labelClass}>
                    Organisasi tujuan
                  </label>
                  <select
                    id="device-org"
                    value={orgId}
                    onChange={(e) => setOrgId(e.target.value)}
                    className="h-12 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 font-sans text-sm text-[var(--color-text-primary)] focus:border-[var(--color-primary)] focus:outline-none"
                  >
                    {orgs.map((o) => (
                      <option key={o.id} value={o.id}>
                        {o.name} — {o.role}
                      </option>
                    ))}
                  </select>
                </div>
              )}

              {error && (
                <p
                  role="alert"
                  className="rounded-md border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/10 px-3 py-2 font-sans text-xs text-[var(--color-danger)]"
                >
                  {error}
                </p>
              )}

              <div className="flex flex-wrap gap-2">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  disabled={code.length < 9 || busy}
                >
                  {busy ? 'Memproses…' : 'Setujui'}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  disabled={busy}
                  onClick={handleDeny}
                >
                  Tolak
                </Button>
              </div>
            </form>
          </>
        )}
      </WindowCard>
    </div>
  );
};

export default DeviceApprovePage;
