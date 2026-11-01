import React, { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { ArrowLeft, CheckCircle2, Lock } from 'lucide-react';
import { WindowCard } from '../components/ui/WindowCard';
import { Button } from '../components/ui/Button';
import { ApiError } from '../lib/api/client';
import { resetPassword } from '../lib/api/auth';

const field =
  'w-full h-12 pl-10 pr-4 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] font-sans text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)] transition-colors';
const label =
  'block font-mono text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2';

const describeError = (err: unknown) => {
  if (!(err instanceof ApiError)) {
    return 'Tidak dapat menghubungi server. Periksa koneksi lalu coba lagi.';
  }
  if (err.status === 410) return 'Tautan atur ulang sudah kedaluwarsa. Minta tautan baru.';
  if (err.status === 400) return 'Tautan atur ulang tidak valid atau sudah dipakai.';
  return err.message;
};

const ResetPasswordPage: React.FC = () => {
  const [params] = useSearchParams();
  const token = params.get('token');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!token) return;
    if (password.length < 8) {
      setError('Password minimal 8 karakter.');
      return;
    }
    if (password !== confirm) {
      setError('Konfirmasi password tidak sama.');
      return;
    }

    setBusy(true);
    try {
      await resetPassword(token, password);
      setDone(true);
    } catch (err) {
      setError(describeError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[var(--color-background)] px-4 py-10 md:py-16">
      <div className="w-full max-w-md">
        <WindowCard title="heimdall reset-password" date="AUTH" className="shadow-sm">
          <div className="p-2 sm:p-4">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-md bg-[var(--color-accent)] flex items-center justify-center">
                  <span className="text-white font-sans font-bold text-lg">H</span>
                </div>
              </div>
              <h1 className="font-sans font-black text-2xl text-[var(--color-text-primary)]">
                Atur ulang password
              </h1>
              <p className="font-sans text-sm text-[var(--color-text-secondary)] mt-2">
                Buat password baru untuk akun Heimdall Anda.
              </p>
            </div>

            {done ? (
              <div role="status" className="py-2 text-center">
                <CheckCircle2
                  className="mx-auto h-10 w-10 text-[var(--color-success)]"
                  aria-hidden="true"
                />
                <p className="mt-3 font-sans text-sm text-[var(--color-text-primary)]">
                  Password berhasil diubah. Semua sesi lama sudah dicabut.
                </p>
                <Button
                  variant="primary"
                  size="md"
                  className="mt-5 w-full"
                  onClick={() => window.location.assign('/login')}
                >
                  Masuk dengan password baru
                </Button>
              </div>
            ) : (
              <>
                {!token && (
                  <p
                    role="alert"
                    className="mb-4 font-sans text-xs text-[var(--color-danger)] bg-[var(--color-danger)]/10 border border-[var(--color-danger)]/30 rounded-md px-3 py-2"
                  >
                    Tautan atur ulang tidak valid: token tidak ditemukan.
                  </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label htmlFor="reset-password" className={label}>
                      Password baru (min. 8 karakter)
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                      <input
                        id="reset-password"
                        type="password"
                        required
                        autoComplete="new-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        className={field}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="reset-confirm" className={label}>
                      Ulangi password baru
                    </label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                      <input
                        id="reset-confirm"
                        type="password"
                        required
                        autoComplete="new-password"
                        value={confirm}
                        onChange={(e) => setConfirm(e.target.value)}
                        placeholder="••••••••"
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

                  <Button
                    type="submit"
                    variant="primary"
                    size="md"
                    className="w-full"
                    disabled={busy || !token}
                  >
                    {busy ? 'Menyimpan…' : 'Simpan password baru'}
                  </Button>
                </form>
              </>
            )}

            <div className="mt-8 pt-6 border-t border-[var(--color-border)] text-center space-y-4">
              <p className="font-sans text-xs text-[var(--color-text-secondary)]">
                Butuh tautan baru?{' '}
                <Link
                  to="/forgot-password"
                  className="font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
                >
                  Lupa password
                </Link>
              </p>
              <Link
                to="/login"
                className="inline-flex items-center justify-center gap-2 font-sans text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Kembali ke halaman masuk
              </Link>
            </div>
          </div>
        </WindowCard>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
