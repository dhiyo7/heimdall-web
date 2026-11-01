import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Eye, EyeOff, Lock, Mail, ArrowLeft } from 'lucide-react';
import { WindowCard } from '../components/ui/WindowCard';
import { Button } from '../components/ui/Button';
import { useI18n } from '../i18n/I18nContext';
import { useAuth } from '../lib/auth/AuthContext';
import { ApiError } from '../lib/api/client';

export const Login: React.FC = () => {
  const { t } = useI18n();
  const { login } = useAuth();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      await login(email, password);
      navigate(params.get('next') ?? '/app', { replace: true });
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Gagal masuk. Coba lagi.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[var(--color-background)] px-4 py-10 md:py-16">
      <div className="w-full max-w-md">
        <WindowCard title="heimdall login" date="AUTH" className="shadow-sm">
          <div className="p-2 sm:p-4">
            <div className="text-center mb-8">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 rounded-md bg-[var(--color-accent)] flex items-center justify-center">
                  <span className="text-white font-sans font-bold text-lg">H</span>
                </div>
              </div>
              <h1 className="font-sans font-black text-2xl text-[var(--color-text-primary)]">
                {t('auth.login_title')}
              </h1>
              <p className="font-sans text-sm text-[var(--color-text-secondary)] mt-2">
                {t('auth.login_subtitle')}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label
                  htmlFor="login-email"
                  className="block font-mono text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2"
                >
                  {t('auth.email_label')}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                  <input
                    id="login-email"
                    type="email"
                    required
                    autoComplete="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder={t('auth.email_placeholder')}
                    className="w-full h-12 pl-10 pr-4 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] font-sans text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                  />
                </div>
              </div>

              <div>
                <label
                  htmlFor="login-password"
                  className="block font-mono text-xs font-semibold text-[var(--color-text-muted)] uppercase tracking-wider mb-2"
                >
                  {t('auth.password_label')}
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-text-muted)]" />
                  <input
                    id="login-password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={t('auth.password_placeholder')}
                    className="w-full h-12 pl-10 pr-12 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] font-sans text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-primary)] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? t('auth.hide_password') : t('auth.show_password')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors focus:outline-none"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
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
                {busy ? 'Memproses…' : t('auth.sign_in')}
              </Button>
            </form>

            <div className="mt-8 pt-6 border-t border-[var(--color-border)] text-center space-y-4">
              <p className="font-sans text-xs text-[var(--color-text-secondary)]">
                {t('auth.no_account')}{' '}
                <Link
                  to="/register"
                  className="font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-hover)] transition-colors"
                >
                  {t('auth.sign_up')}
                </Link>
              </p>
              <Link
                to="/"
                className="inline-flex items-center justify-center gap-2 font-sans text-xs font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                {t('auth.back_home')}
              </Link>
            </div>
          </div>
        </WindowCard>
      </div>
    </div>
  );
};
