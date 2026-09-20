import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { Button } from '../../components/ui/Button';

export const Hero: React.FC = () => {
  const { t } = useI18n();
  return (
    <section
      id="home"
      className="relative bg-gradient-hero border-b border-[var(--color-border)] pt-10 pb-section"
      style={{ minHeight: '780px' }}
    >
      <div className="container-constrained">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Left Content - WingDeck style Hero */}
          <div className="space-y-10">
            <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-xs font-medium text-[var(--color-text-muted)]">
              <span className="w-2 h-2 rounded-full bg-[var(--color-success)]" />
              {t('common.v2_beta')}
            </span>

            <h1 className="text-h1 text-[var(--color-text-primary)] leading-none tracking-tight">
              {t('hero.title_part1')}<br />
              {t('hero.title_part2')}
            </h1>

            <p className="text-body text-[var(--color-text-secondary)] max-w-xl leading-relaxed">
              {t('hero.description')}
            </p>

            <div className="flex flex-wrap gap-4">
              <a href="#pricing">
                <Button variant="primary" size="lg">
                  {t('common.free_trial')}
                </Button>
              </a>
              <a href="#features">
                <Button variant="secondary" size="lg">
                  {t('common.view_features')}
                </Button>
              </a>
            </div>
          </div>

          {/* Right Content - Illustration / Device Mockup */}
          <div className="relative flex justify-center items-center">
            <div className="relative w-full max-w-lg">
              {/* Radial gradient glow behind */}
              <div className="absolute inset-0 bg-gradient-accent-3 rounded-2xl blur-3xl opacity-30 pointer-events-none" />
              <div className="relative border border-[var(--color-border)] bg-[var(--color-surface-muted)] rounded-xl overflow-hidden">
                <img
                  src="/heimdall-hero.jpg"
                  alt="Heimdall QA Automation Dashboard"
                  loading="eager"
                  className="w-full h-auto object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};