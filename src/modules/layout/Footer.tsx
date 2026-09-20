import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '../../i18n/I18nContext';

export const Footer: React.FC = () => {
  const { t } = useI18n();
  return (
    <footer className="bg-[var(--color-background)] border-t border-[var(--color-border)] py-10 md:py-16">
      <div className="container-constrained">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-md bg-[var(--color-accent)] flex items-center justify-center">
                <span className="text-white font-sans font-bold text-sm">H</span>
              </div>
              <span className="font-sans font-bold text-xl tracking-tight text-[var(--color-text-secondary)]">HEIMDALL</span>
            </div>
            <p className="font-sans text-sm text-[var(--color-text-muted)] max-w-xs leading-relaxed">
              {t('footer.tagline')}
            </p>
          </div>

          {/* Links Grid */}
          <div className="grid grid-cols-2 gap-8 md:col-span-2">
            <div className="flex flex-col gap-3 font-sans text-sm">
              <span className="font-bold text-[var(--color-text-secondary)] text-xs uppercase tracking-wider">{t('footer.connect')}</span>
              <a href="https://github.com/dhiyo7" target="_blank" rel="noopener noreferrer" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors">GitHub</a>
              <a href="mailto:example@email.com" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors">Email</a>
            </div>
            <div className="flex flex-col gap-3 font-sans text-sm">
              <span className="font-bold text-[var(--color-text-secondary)] uppercase tracking-wider text-xs">{t('footer.resources')}</span>
              <a href="/#features" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors">{t('nav.features')}</a>
              <a href="/#pricing" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors">{t('nav.pricing')}</a>
              <Link to="/documentation" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors">{t('nav.docs')}</Link>
              <a href="/" className="text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors">{t('nav.home')}</a>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-[var(--color-border)] text-center md:text-left font-sans text-xs text-[var(--color-text-muted)] flex flex-col md:flex-row justify-between items-center gap-6">
          <span>&copy; {new Date().getFullYear()} Heimdall. {t('footer.rights')}</span>
          <div className="flex items-center gap-4">
            <a href="https://app.netlify.com/sites/heimdallqa/deploys" target="_blank" rel="noopener noreferrer" className="hover:opacity-80 transition-opacity">
              <img src="https://api.netlify.com/api/v1/badges/803a9d52-640e-4f5d-b8e6-942a3aea2ffa/deploy-status" alt="Netlify Status" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};