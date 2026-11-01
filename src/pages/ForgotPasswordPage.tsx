import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Mail } from 'lucide-react';
import { WindowCard } from '../components/ui/WindowCard';
import { Button } from '../components/ui/Button';
import { ApiError } from '../lib/api/client';
import { requestPasswordReset } from '../lib/api/auth';

const field =
  'w-full h-12 pl-10 pr-4 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] font-sans text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)] transition-colors';
const label =
  'block font-mono text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await requestPasswordReset(email);
      setSent(true);
    } catch (err) {
      setError(
        err instanceof ApiError
          ? err.message
          : 'Tidak dapat menghubungi server. Periksa koneksi lalu coba lagi.',
      );
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[var(--color-background)] px-4 py-10 md:py-16">
      <div className="w-full max-w-md">
        <WindowCard title="heimdall forgot-password" date="AUTH" className="shadow-sm">
          <div className="p-2 sm:p-4">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-md bg-[var(--color-accent)] flex items-center justify-center">
                  <span className="text-white font-sans font-bold text-lg">H</span>
                </div>
              </div>
              <h1 className="font-sans font-black text-2xl text-[var(--color-text-primary)]">
                Lupa password
              </h1>
              <p className="font-sans text-sm text-[var(--color-text-secondary)] mt-2">
                Masukkan email akun Anda, kami akan mengirim tautan atur ulang password.
              </p>
            </div>

            {sent ? (
              <div role="status" className="py-2 text-center">
                <CheckCircle2
                  className="mx-auto h-10 w-10 text-[var(--color-success)]"
                  aria-hidden="true"
                />
                <p className="mt-3 font-sans text-sm text-[var(--color-text-primary)]">
                  Bila email terdaftar, kami sudah mengirim tautan atur ulang password.
                </p>
                <p className="mt-1 font-sans text-xs text-[var(--color-text-muted)]">
                  Periksa kotak masuk dan folder spam. Tautan berlaku terbatas.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="forgot-email" className={label}>
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                    <input
                      id="forgot-email"
                      type="email"
                      required
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@perusahaan.com"
                      className={field}
                    />
                  </div>
                </div>

                {error && (
                  <p
                    role="alert"
                    className="font-sans text-xs text-[var(--color-danger)] bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/30 rounded-md px-3 py-2"
                  >
                    {error}
                  </p>
                )}

                <Button type="submit" variant="primary" size="md" className="w-full" disabled={busy}>
                  {busy ? 'Mengirim…' : 'Kirim tautan'}
                </Button>
              </form>
            )}

            <div className="mt-8 pt-6 border-t border-[var(--color-border)] text-center space-y-4">
              <p className="font-sans text-xs text-[var(--color-text-secondary)]">
                Ingat password Anda?{' '}
                <Link
                  to="/login"
                  className="font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
                >
                  Masuk
                </Link>
              </p>
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 font-sans text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Kembali ke beranda
              </Link>
            </div>
          </div>
        </WindowCard>
      </div>
    </div>
  );
};

export default ForgotPasswordPage;
