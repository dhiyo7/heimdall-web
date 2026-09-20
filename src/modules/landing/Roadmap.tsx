import React, { useState } from 'react';
import { WindowCard } from '../../components/ui/WindowCard';
import { roadmapData } from './roadmapData';
import { Sparkles } from 'lucide-react';
import { useI18n } from '../../i18n/I18nContext';

export const Roadmap: React.FC = () => {
  const [activePhase, setActivePhase] = useState<number>(0);
  const { t } = useI18n();

  return (
    <section id="roadmap" className="pt-section pb-section border-b border-[var(--color-border)]">
      <div className="container-constrained">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
          {/* Left: Phase Navigation */}
          <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-24">
            <h2 className="responsive-text-h2 text-[var(--color-text-primary)] leading-none">
              {t('roadmap.title_part1')}<br />
              <span className="text-[var(--color-accent)]">{t('roadmap.title_part2')}</span>
            </h2>
            <p className="text-body text-[var(--color-text-secondary)] leading-relaxed border-l-2 border-[var(--color-accent)] pl-4">
              {t('roadmap.description')}
            </p>

            <div className="flex flex-row overflow-x-auto gap-2 lg:flex-col lg:overflow-visible pb-1">
              {roadmapData.map((phase, idx) => (
                <button
                  key={idx}
                  onClick={() => setActivePhase(idx)}
                  className={`text-left px-5 py-4 rounded-lg transition-all duration-200 border text-sm font-extrabold tracking-tight ${
                    activePhase === idx
                      ? 'bg-[var(--color-surface)] text-[var(--color-text-primary)] border-[var(--color-primary)] shadow-sm'
                      : 'bg-transparent border-[var(--color-border)] text-[var(--color-text-muted)] hover:border-[var(--color-surface-muted)] hover:text-[var(--color-text-secondary)]'
                  }`}
                >
                  {t(phase.phaseKey)}
                </button>
              ))}
            </div>
          </div>

          {/* Right: Content Display */}
          <div className="lg:col-span-8">
            <WindowCard
              title={`roadmap_phase_${activePhase + 1}.json`}
              variant="highlight"
              className="w-full md:min-h-[500px]"
            >
              <div className="p-4 md:p-8 space-y-10 animate-fade-in">
                <div className="border-b border-[var(--color-border)] pb-8">
                  <h3 className="text-2xl md:text-3xl font-extrabold text-[var(--color-text-primary)] mb-4">{t(roadmapData[activePhase].phaseKey)}</h3>
                  <p className="text-body text-[var(--color-text-secondary)] italic leading-relaxed">
                    {t(roadmapData[activePhase].descriptionKey)}
                  </p>
                </div>

                <div className="grid grid-cols-1 gap-4 md:gap-6">
                  {roadmapData[activePhase].features.map((feature, fIdx) => (
                    <div key={fIdx} className="bg-[var(--color-background)] rounded-xl p-6 border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 transition-colors">
                      <div className="flex gap-4 items-start">
                        <div className="mt-1 w-8 h-8 rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex shrink-0 items-center justify-center border border-[var(--color-accent)]/20">
                          <Sparkles size={14} />
                        </div>
                        <div className="space-y-3">
                          <h4 className="text-heading-23px text-[var(--color-text-primary)]">{t(feature.titleKey)}</h4>
                          <p className="text-body text-[var(--color-text-secondary)] leading-relaxed">
                            {t(feature.descriptionKey)}
                          </p>
                          {feature.subFeatureKeys && (
                            <div className="flex flex-wrap gap-2 pt-2">
                              {feature.subFeatureKeys.map((subKey, sIdx) => (
                                <span key={sIdx} className="px-2.5 py-1 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)] text-[11px] font-bold text-[var(--color-text-muted)]">
                                  {t(subKey)}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </WindowCard>
          </div>
        </div>
      </div>
    </section>
  );
};
