import React from 'react';
import { Eye, Cpu, Smartphone, ShieldCheck, Zap, Activity } from 'lucide-react';
import { useI18n } from '../../i18n/I18nContext';

const icons = [Eye, Smartphone, Cpu, Zap, ShieldCheck, Activity];

/** "Kendali yang Sesuai Kebutuhan." — grid 6 utilitas, kini bergaya editorial. */
export const VisualIntelligenceSection: React.FC = () => {
  const { t } = useI18n();

  return (
    <section
      id="other-features"
      className="section-editorial border-b border-[var(--color-border)] bg-[var(--color-surface)]"
    >
      <div className="container-constrained">
        <div className="max-w-3xl mb-10 md:mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-border)] bg-[var(--color-background)] text-xs font-semibold text-[var(--color-accent)] mb-5">
            <Zap size={13} />
            {t('visual_intel.badge')}
          </span>
          <h2 className="editorial-h2 text-[var(--color-text-primary)] mb-4">
            {t('visual_intel.title_part1')}{' '}
            <span className="text-[var(--color-accent)]">{t('visual_intel.title_part2')}</span>
          </h2>
          <p className="editorial-lead">{t('visual_intel.description')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
          {icons.map((IconComponent, idx) => {
            const num = idx + 1;
            return (
              <div
                key={idx}
                className="card-editorial bg-[var(--color-background)] p-6 flex flex-col hover:border-[var(--color-accent)]/40 transition-colors"
              >
                <div className="flex items-center justify-between mb-5">
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center border border-[var(--color-accent)]/20 shrink-0">
                    <IconComponent size={20} />
                  </div>
                  <span className="font-mono text-[10px] font-bold text-[var(--color-text-muted)] tracking-widest">
                    {String(num).padStart(2, '0')}
                  </span>
                </div>

                <h3 className="text-base font-bold text-[var(--color-text-primary)] mb-1.5 leading-snug">
                  {t(`visual_intel.item${num}_title`)}
                </h3>
                <span className="font-mono text-[11px] text-[var(--color-text-muted)] tracking-tight block mb-3">
                  {t(`visual_intel.item${num}_subtitle`)}
                </span>
                <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                  {t(`visual_intel.item${num}_desc`)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
