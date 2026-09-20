import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import { useI18n } from '../i18n/I18nContext';

export const NotFound: React.FC = () => {
  const { t } = useI18n();
  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[var(--color-background)] px-4">
      <div className="max-w-lg w-full mx-auto text-center space-y-6">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-[var(--color-danger)]/10 rounded-lg flex items-center justify-center border border-[var(--color-border)]">
            <ShieldAlert className="w-10 h-10 text-[var(--color-danger)]" />
          </div>
        </div>

        <h1 className="font-sans font-black text-6xl text-[var(--color-text-primary)]">404</h1>

        <div className="space-y-2">
          <h2 className="font-sans font-bold text-xl text-[var(--color-text-primary)]">{t('not_found.title')}</h2>
          <p className="font-sans text-sm text-[var(--color-text-secondary)]">
            {t('not_found.description')}
          </p>
        </div>

        <div className="pt-8">
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 rounded-md bg-[var(--color-primary)] text-white font-sans text-sm font-medium hover:bg-[var(--color-primary-hover)] transition-colors shadow-sm"
          >
            {t('not_found.back_home')}
          </Link>
        </div>
      </div>
    </div>
  );
};