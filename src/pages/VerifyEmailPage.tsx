import React, { useEffect, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AlertCircle, CheckCircle2, Mail } from 'lucide-react';
import { WindowCard } from '../components/ui/WindowCard';
import { Button } from '../components/ui/Button';
import { ApiError } from '../lib/api/client';
import { confirmEmailVerification, requestEmailVerification } from '../lib/api/auth';
import { useAuth } from '../lib/auth/AuthContext';

type ConfirmState = 'loading' | 'success' | 'error';

const describeConfirmError = (err: unknown) => {
  if (!(err instanceof ApiError)) {
    return 'Tidak dapat menghubungi server. Periksa koneksi lalu coba lagi.';
  }
  if (err.status === 410) return 'Tautan verifikasi sudah kedaluwarsa. Minta email verifikasi baru.';
  if (err.status === 400) return 'Tautan verifikasi tidak valid.';
  return err.message;
};

const VerifyEmailPage: React.FC = () => {
  const [params] = useSearchParams();
  const token = params.get('token');
  const { user, loading } = useAuth();
  const [state, setState] = useState<ConfirmState>('loading');
  const [confirmError, setConfirmError] = useState<string | null>(null);
  const [resendError, setResendError] = useState<string | null>(null);
  const [resending, setResending] = useState(false);
  const [resent, setResent] = useState(false);
  // Ref menjaga konfirmasi hanya jalan sekali walau StrictMode merender ulang.
  const confirmedRef = useRef(false);

  useEffect(() => {
    if (!token || confirmedRef.current) return;
    confirmedRef.current = true;
    (async () => {
      try {
        await confirmEmailVerification(token);
        setState('success');
      } catch (err) {
        setConfirmError(describeConfirmError(err));
        setState('error');
      }
    })();
  }, [token]);

  const handleResend = async () => {
    setResending(true);
    setResendError(null);
    try {
      await requestEmailVerification();
      setResent(true);
    } catch (err) {
      setResendError(
        err instanceof ApiError
          ? err.message
          : 'Tidak dapat menghubungi server. Periksa koneksi lalu coba lagi.',
      );
    } finally {
      setResending(false);
    }
  };

  const renderContent = () => {
    if (token) {
      if (state === 'loading') {
        return (
          <p role="status" className="py-6 text-center font-mono text-sm text-[var(--color-text-muted)]">
            memverifikasi email…
          </p>
        );
      }
      if (state === 'success') {
        return (
          <div role="status" className="py-2 text-center">
            <CheckCircle2
              className="mx-auto h-10 w-10 text-[var(--color-success)]"
              aria-hidden="true"
            />
            <p className="mt-3 font-sans text-sm text-[var(--color-text-primary)]">
              Email berhasil diverifikasi.
            </p>
            <Button
              variant="primary"
              size="md"
              className="mt-5 w-full"
              onClick={() => window.location.assign('/app')}
            >
              Buka console
            </Button>
          </div>
        );
      }
      return (
        <div role="alert" className="py-2 text-center">
          <AlertCircle
            className="mx-auto h-10 w-10 text-[var(--color-danger)]"
            aria-hidden="true"
          />
          <p className="mt-3 font-sans text-sm text-[var(--color-text-primary)]">{confirmError}</p>
          <Link
            to="/login"
            className="mt-4 inline-block font-sans text-xs font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
          >
            Kembali ke halaman masuk
          </Link>
        </div>
      );
    }

    if (loading) {
      return (
        <p role="status" className="py-6 text-center font-mono text-sm text-[var(--color-text-muted)]">
          memuat sesi…
        </p>
      );
    }

    if (!user) {
      return (
        <div className="py-2 text-center">
          <Mail className="mx-auto h-10 w-10 text-[var(--color-text-muted)]" aria-hidden="true" />
          <p className="mt-3 font-sans text-sm text-[var(--color-text-secondary)]">
            Masuk terlebih dahulu untuk memeriksa status verifikasi email.
          </p>
          <Link
            to="/login"
            className="mt-4 inline-block font-sans text-xs font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
          >
            Masuk
          </Link>
        </div>
      );
    }

    if (user.emailVerified === undefined) {
      return (
        <p className="py-2 text-center font-sans text-sm text-[var(--color-text-secondary)]">
          Status verifikasi email tidak tersedia.
        </p>
      );
    }

    if (user.emailVerified) {
      return (
        <div role="status" className="py-2 text-center">
          <CheckCircle2
            className="mx-auto h-10 w-10 text-[var(--color-success)]"
            aria-hidden="true"
          />
          <p className="mt-3 font-sans text-sm text-[var(--color-text-primary)]">
            Email {user.email} sudah diverifikasi.
          </p>
          <Link
            to="/app"
            className="mt-4 inline-block font-sans text-xs font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
          >
            Buka console
          </Link>
        </div>
      );
    }

    return (
      <div className="py-2 text-center">
        <AlertCircle className="mx-auto h-10 w-10 text-[var(--color-warning)]" aria-hidden="true" />
        <p className="mt-3 font-sans text-sm text-[var(--color-text-primary)]">
          Email {user.email} belum diverifikasi.
        </p>
        {resent ? (
          <p role="status" className="mt-3 font-sans text-xs text-[var(--color-text-secondary)]">
            Email verifikasi sudah dikirim. Periksa kotak masuk dan folder spam.
          </p>
        ) : (
          <Button
            variant="primary"
            size="md"
            className="mt-5 w-full"
            disabled={resending}
            onClick={handleResend}
          >
            {resending ? 'Mengirim…' : 'Kirim ulang email verifikasi'}
          </Button>
        )}
        {resendError && (
          <p
            role="alert"
            className="mt-3 font-sans text-xs text-[var(--color-danger)] bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/30 rounded-md px-3 py-2"
          >
            {resendError}
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[var(--color-background)] px-4 py-10 md:py-16">
      <div className="w-full max-w-md">
        <WindowCard title="heimdall verify-email" date="AUTH" className="shadow-sm">
          <div className="p-2 sm:p-4">
            <div className="text-center mb-6">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-md bg-[var(--color-accent)] flex items-center justify-center">
                  <span className="text-white font-sans font-bold text-lg">H</span>
                </div>
              </div>
              <h1 className="font-sans font-black text-2xl text-[var(--color-text-primary)]">
                Verifikasi email
              </h1>
            </div>

            {renderContent()}
          </div>
        </WindowCard>
      </div>
    </div>
  );
};

export default VerifyEmailPage;
