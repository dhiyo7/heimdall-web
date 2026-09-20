import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { Languages } from 'lucide-react';

export const LanguageToggle: React.FC = () => {
  const { language, setLanguage } = useI18n();

  const toggleLanguage = () => {
    setLanguage(language === 'en' ? 'id' : 'en');
  };

  return (
    <button
      onClick={toggleLanguage}
      className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-primary)] transition-all text-xs font-medium cursor-pointer"
      title="Toggle Language (EN / ID)"
      aria-label="Toggle Language"
    >
      <Languages size={14} className="text-[var(--color-primary)]" />
      <span className="font-mono uppercase font-bold">{language}</span>
    </button>
  );
};