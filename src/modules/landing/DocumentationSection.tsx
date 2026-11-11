import React from 'react';
import { Eye, Database } from 'lucide-react';
import { useI18n } from '../../i18n/I18nContext';

/** "Pengalaman Profesional, Tanpa Ribet" — dua kartu, kini bergaya editorial dan memakai i18n. */
export const DocumentationSection: React.FC = () => {
  const { t } = useI18n();

  const cards = [
    { icon: Eye, titleKey: 'docs_section.card1_title', descKey: 'docs_section.card1_desc' },
    { icon: Database, titleKey: 'docs_section.card2_title', descKey: 'docs_section.card2_desc' },
  ];

  return (
    <section
      id="docs"
      className="section-editorial border-b border-[var(--color-border)] bg-[var(--color-background)]"
    >
      <div className="container-constrained">
        <div className="max-w-3xl mb-10 md:mb-14">
          <h2 className="editorial-h2 text-[var(--color-text-primary)] mb-4">
            {t('docs_section.title')}
          </h2>
          <p className="editorial-lead">{t('docs_section.description')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 md:gap-6">
          {cards.map((card) => {
            const Icon = card.icon;
            return (
              <div
                key={card.titleKey}
                className="card-editorial bg-[var(--color-surface)] p-6 md:p-8 flex gap-5 hover:border-[var(--color-accent)]/40 transition-colors"
              >
                <div className="p-3 rounded-lg bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/20 shrink-0 h-fit">
                  <Icon className="w-5 h-5 text-[var(--color-accent)]" />
                </div>
                <div>
                  <h3 className="editorial-h3 text-[var(--color-text-primary)] mb-2.5">
                    {t(card.titleKey)}
                  </h3>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                    {t(card.descKey)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
