import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Lock, Mail, User } from 'lucide-react';
import { WindowCard } from '../components/ui/WindowCard';
import { Button } from '../components/ui/Button';
import { useAuth } from '../lib/auth/AuthContext';
import { ApiError } from '../lib/api/client';

/** Gaya mengikuti Login.tsx supaya console dan halaman publik terasa satu produk. */
export const Register: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

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
      await register({ email, password, fullName: fullName.trim() || undefined });
      navigate('/app', { replace: true });
    } catch (err) {
      if (err instanceof ApiError && err.details.length > 0) {
        setError(err.details.map((d) => d.message).join(' · '));
      } else {
        setError(err instanceof ApiError ? err.message : 'Gagal mendaftar. Coba lagi.');
      }
    } finally {
      setBusy(false);
    }
  };

  const field =
    'w-full h-12 pl-10 pr-4 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] font-sans text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)] transition-colors';
  const label =
    'block font-mono text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2';

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[var(--color-background)] px-4 py-10 md:py-16">
      <div className="w-full max-w-md">
        <WindowCard title="heimdall register" date="AUTH" className="shadow-sm">
          <div className="p-2 sm:p-4">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-md bg-[var(--color-accent)] flex items-center justify-center">
                  <span className="text-white font-sans font-bold text-lg">H</span>
                </div>
              </div>
              <h1 className="font-sans font-black text-2xl text-[var(--color-text-primary)]">
                Buat akun Heimdall
              </h1>
              <p className="font-sans text-sm text-[var(--color-text-secondary)] mt-2">
                Akun ini dipakai untuk console dan menautkan aplikasi Desktop.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="reg-name" className={label}>
                  Nama lengkap (opsional)
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                  <input
                    id="reg-name"
                    type="text"
                    autoComplete="name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Nama Anda"
                    className={field}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="reg-email" className={label}>
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                  <input
                    id="reg-email"
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

              <div>
                <label htmlFor="reg-password" className={label}>
                  Password (min. 8 karakter)
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                  <input
                    id="reg-password"
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
                <label htmlFor="reg-confirm" className={label}>
                  Ulangi password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                  <input
                    id="reg-confirm"
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

              <Button type="submit" variant="primary" size="md" className="w-full" disabled={busy}>
                {busy ? 'Memproses…' : 'Daftar'}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-[var(--color-border)] text-center space-y-4">
              <p className="font-sans text-xs text-[var(--color-text-secondary)]">
                Sudah punya akun?{' '}
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
