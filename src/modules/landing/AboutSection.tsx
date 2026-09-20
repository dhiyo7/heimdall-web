import React from 'react';
import { WindowCard } from '../../components/ui/WindowCard';
import { Layers, Terminal, BarChart3, CheckCircle2 } from 'lucide-react';
import { useI18n } from '../../i18n/I18nContext';

export const AboutSection: React.FC = () => {
  const { t } = useI18n();

  return (
    <section
      id="about"
      className="py-14 md:py-20 border-b border-[var(--color-border)] bg-[var(--color-background)]"
    >
      <div className="container-constrained">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Heading & Value Prop */}
          <div className="lg:col-span-5 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-xs font-semibold text-[var(--color-accent)]">
              <Terminal size={13} />
              {t('about.badge')}
            </div>

            <h2 className="responsive-text-h2 text-[var(--color-text-primary)] leading-tight tracking-tight">
              {t('about.title_part1')}<br />
              <span className="text-[var(--color-accent)]">{t('about.title_part2')}</span>
            </h2>

            <p className="text-body text-[var(--color-text-secondary)] leading-relaxed">
              {t('about.description')}
            </p>

            <div className="space-y-3 pt-2">
              {[
                t('about.list_item1'),
                t('about.list_item2'),
                t('about.list_item3')
              ].map((item, idx) => (
                <div key={idx} className="flex items-center gap-3 text-xs font-medium text-[var(--color-text-muted)]">
                  <CheckCircle2 size={15} className="text-[var(--color-success)] shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Architectural Highlights */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
            <WindowCard title="engine_core.rs" variant="highlight" className="h-full">
              <div className="p-6 space-y-4">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center border border-[var(--color-accent)]/20">
                  <Layers size={18} />
                </div>
                <h3 className="text-heading-23px text-[var(--color-text-primary)]">
                  {t('about.card1_title')}
                </h3>
                <p className="text-body text-[var(--color-text-secondary)] leading-relaxed">
                  {t('about.card1_desc')}
                </p>
              </div>
            </WindowCard>

            <WindowCard title="syntax_parser.rs" variant="highlight" className="h-full">
              <div className="p-6 space-y-4">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center border border-[var(--color-accent)]/20">
                  <Terminal size={18} />
                </div>
                <h3 className="text-heading-23px text-[var(--color-text-primary)]">
                  {t('about.card2_title')}
                </h3>
                <p className="text-body text-[var(--color-text-secondary)] leading-relaxed">
                  {t('about.card2_desc')}
                </p>
              </div>
            </WindowCard>

            <WindowCard title="telemetry_stream.rs" variant="highlight" className="h-full sm:col-span-2">
              <div className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center">
                <div className="w-10 h-10 rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center border border-[var(--color-accent)]/20 shrink-0">
                  <BarChart3 size={18} />
                </div>
                <div className="space-y-1">
                  <h3 className="text-heading-23px text-[var(--color-text-primary)]">
                    {t('about.card3_title')}
                  </h3>
                  <p className="text-body text-[var(--color-text-secondary)] leading-relaxed">
                    {t('about.card3_desc')}
                  </p>
                </div>
              </div>
            </WindowCard>
          </div>
        </div>
      </div>
    </section>
  );
};