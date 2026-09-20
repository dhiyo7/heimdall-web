import React from 'react';
import { WindowCard } from '../../components/ui/WindowCard';
import { Eye, Cpu, Smartphone, ShieldCheck, Zap, Activity } from 'lucide-react';
import { useI18n } from '../../i18n/I18nContext';

const icons = [Eye, Smartphone, Cpu, Zap, ShieldCheck, Activity];
const filenames = [
  'inspector_module.ts',
  'device_manager.ts',
  'telemetry_guard.ts',
  'mirror_stream.ts',
  'assertion_engine.ts',
  'replay_debugger.ts',
];

export const VisualIntelligenceSection: React.FC = () => {
  const { t } = useI18n();

  return (
    <section
      id="other-features"
      className="py-20 border-b border-[var(--color-border)] bg-[var(--color-background)]"
    >
      <div className="container-constrained">
        <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-xs font-semibold text-[var(--color-primary)]">
            <Zap size={13} />
            {t('visual_intel.badge')}
          </div>
          <h2 className="text-h2 text-[var(--color-text-primary)] leading-tight tracking-tight">
            {t('visual_intel.title_part1')}{' '}
            <span className="text-[var(--color-accent)]">{t('visual_intel.title_part2')}</span>
          </h2>
          <p className="text-body text-[var(--color-text-secondary)] leading-relaxed">
            {t('visual_intel.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 items-stretch">
          {icons.map((IconComponent, idx) => {
            const num = idx + 1;
            return (
              <WindowCard key={idx} title={filenames[idx]} variant="highlight" className="h-full">
                <div className="p-6 flex flex-col h-full space-y-4">
                  <div className="w-10 h-10 rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center border border-[var(--color-accent)]/20 shrink-0">
                    <IconComponent size={20} />
                  </div>
                  <div>
                    <h3 className="text-heading-23px text-[var(--color-text-primary)] mb-1">{t(`visual_intel.item${num}_title`)}</h3>
                    <span className="text-[11px] font-mono text-[var(--color-text-muted)] tracking-tight block mb-3">
                      {t(`visual_intel.item${num}_subtitle`)}
                    </span>
                    <p className="text-body text-[var(--color-text-secondary)] leading-relaxed">
                      {t(`visual_intel.item${num}_desc`)}
                    </p>
                  </div>
                </div>
              </WindowCard>
            );
          })}
        </div>
      </div>
    </section>
  );
};
