import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { WindowCard } from '../components/ui/WindowCard';
import { ApiError } from '../lib/api/client';
import { acceptInvitation } from '../lib/api/memberships';
import type { Role } from '../lib/api/types';
import { useAuth } from '../lib/auth/AuthContext';
import { RoleBadge } from '../modules/console/RoleBadge';
import { useToast } from '../modules/console/Toast';

const labelClass =
  'mb-2 block font-mono text-xs font-semibold uppercase tracking-wider text-[var(--color-text-muted)]';

const describeError = (err: unknown) => {
  if (!(err instanceof ApiError)) return 'Gagal menerima undangan. Coba lagi.';
  switch (err.status) {
    case 403:
      return 'Undangan ini untuk alamat email lain.';
    case 410:
      return 'Undangan sudah kedaluwarsa, minta admin mengirim ulang.';
    case 409:
      return 'Undangan sudah diterima.';
    case 404:
      return 'Undangan tidak ditemukan.';
    default:
      return err.message;
  }
};

const InvitationAcceptPage: React.FC = () => {
  const { token } = useParams();
  const { user } = useAuth();
  const { push } = useToast();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    organization: { id: string; name: string; slug: string };
    role: Role;
  } | null>(null);

  const handleAccept = async () => {
    if (!token) return;
    setBusy(true);
    setError(null);
    try {
      const accepted = await acceptInvitation(token);
      push('Undangan diterima.');
      setResult(accepted);
    } catch (err) {
      setError(describeError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container mx-auto max-w-xl px-4 py-12">
      <WindowCard title="invitation.accept" date="INVITE">
        {result ? (
          <div className="py-4 text-center">
            <CheckCircle2
              className="mx-auto h-10 w-10 text-[var(--color-success)]"
              aria-hidden="true"
            />
            <p className="mt-3 font-sans text-base font-extrabold text-[var(--color-text-primary)]">
              Undangan diterima.
            </p>
            <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
              <span className="font-sans text-sm font-semibold text-[var(--color-text-primary)]">
                {result.organization.name}
              </span>
              <RoleBadge role={result.role} />
            </div>
            <Button
              variant="primary"
              size="sm"
              className="mt-5"
              onClick={() => window.location.assign('/app')}
            >
              Buka console
            </Button>
          </div>
        ) : (
          <>
            <h1 className="font-sans font-extrabold text-xl tracking-tight text-[var(--color-text-primary)]">
              Undangan bergabung
            </h1>
            <p className="mt-1 font-sans text-sm text-[var(--color-text-secondary)]">
              Anda diundang untuk bergabung ke sebuah organisasi Heimdall.
            </p>

            <div className="mt-5">
              <span className={labelClass}>Akun aktif</span>
              <p className="font-mono text-sm text-[var(--color-text-primary)]">{user?.email}</p>
            </div>

            <p className="mt-3 font-sans text-xs text-[var(--color-warning)]">
              Undangan hanya bisa diterima oleh alamat email yang diundang.
            </p>

            {(error || !token) && (
              <p
                role="alert"
                className="mt-4 rounded-md border border-[var(--color-danger)]/30 bg-[var(--color-danger)]/10 px-3 py-2 font-sans text-xs text-[var(--color-danger)]"
              >
                {error ?? 'Tautan undangan tidak valid.'}
              </p>
            )}

            <div className="mt-6 flex flex-wrap gap-2">
              <Button
                variant="primary"
                size="sm"
                disabled={busy || !token}
                onClick={handleAccept}
              >
                {busy ? 'Memproses…' : 'Terima undangan'}
              </Button>
              <Button variant="secondary" size="sm" onClick={() => navigate('/app')}>
                Nanti saja
              </Button>
            </div>
          </>
        )}
      </WindowCard>
    </div>
  );
};

export default InvitationAcceptPage;
