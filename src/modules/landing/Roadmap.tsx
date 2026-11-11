import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { roadmapData } from './roadmapData';
import { Sparkles } from 'lucide-react';
import { useI18n } from '../../i18n/I18nContext';

/** "Proyek Peta Jalan" — navigasi fase di kiri, isi fase di kanan (gaya editorial). */
export const Roadmap: React.FC = () => {
  const [activePhase, setActivePhase] = useState<number>(0);
  const { t } = useI18n();
  const phase = roadmapData[activePhase];

  return (
    <section
      id="roadmap"
      className="section-editorial border-b border-[var(--color-border)] bg-[var(--color-surface)]"
    >
      <div className="container-constrained">
        <div className="max-w-3xl mb-10 md:mb-14">
          <h2 className="editorial-h2 text-[var(--color-text-primary)] mb-4">
            {t('roadmap.title_part1')}{' '}
            <span className="text-[var(--color-accent)]">{t('roadmap.title_part2')}</span>
          </h2>
          <p className="editorial-lead">{t('roadmap.description')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          {/* Navigasi fase */}
          <div className="lg:col-span-4 lg:sticky lg:top-28">
            <div
              role="tablist"
              aria-label={t('roadmap.title_part1')}
              className="flex flex-row overflow-x-auto gap-2 lg:flex-col lg:overflow-visible pb-1 [scrollbar-width:none]"
            >
              {roadmapData.map((p, idx) => {
                const on = activePhase === idx;
                return (
                  <button
                    key={idx}
                    role="tab"
                    aria-selected={on}
                    onClick={() => setActivePhase(idx)}
                    className={`text-left shrink-0 lg:shrink px-5 py-3.5 rounded-xl border text-sm font-bold tracking-tight transition-colors ${
                      on
                        ? 'bg-[var(--color-background)] text-[var(--color-text-primary)] border-[var(--color-accent)]'
                        : 'bg-transparent border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-text-muted)]'
                    }`}
                  >
                    {t(p.phaseKey)}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Isi fase */}
          <div className="lg:col-span-8">
            <div className="card-editorial bg-[var(--color-background)] p-6 md:p-8 min-h-[420px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activePhase}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-accent)] mb-2">
                    {t(phase.phaseKey)}
                  </p>
                  <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed border-l-2 border-[var(--color-accent)] pl-4 mb-8">
                    {t(phase.descriptionKey)}
                  </p>

                  <div className="space-y-4">
                    {phase.features.map((feature, fIdx) => (
                      <div
                        key={fIdx}
                        className="rounded-xl border border-[var(--color-border)] bg-[var(--color-surface)] p-5 hover:border-[var(--color-accent)]/40 transition-colors"
                      >
                        <div className="flex gap-4 items-start">
                          <span className="mt-0.5 w-7 h-7 rounded-lg bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex shrink-0 items-center justify-center border border-[var(--color-accent)]/20">
                            <Sparkles size={13} />
                          </span>
                          <div className="min-w-0">
                            <h4 className="text-sm font-bold text-[var(--color-text-primary)] mb-2 leading-snug">
                              {t(feature.titleKey)}
                            </h4>
                            <p className="text-sm text-[var(--color-text-secondary)] leading-relaxed">
                              {t(feature.descriptionKey)}
                            </p>
                            {feature.subFeatureKeys && (
                              <div className="flex flex-wrap gap-2 pt-3">
                                {feature.subFeatureKeys.map((subKey, sIdx) => (
                                  <span
                                    key={sIdx}
                                    className="px-2.5 py-1 rounded-md bg-[var(--color-background)] border border-[var(--color-border)] font-mono text-[10px] font-semibold text-[var(--color-text-muted)]"
                                  >
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
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
