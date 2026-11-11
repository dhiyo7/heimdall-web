import React from 'react';
import { Smartphone, Globe, TerminalSquare, FolderTree, FileCheck2 } from 'lucide-react';
import { useI18n } from '../../i18n/I18nContext';

/**
 * Section dark besar dengan diagram node melingkar (referensi: "From your agent to every feed").
 * Motion M1 — orbit berputar + hub berdenyut, satelit counter-rotate agar tetap tegak.
 * Motion M2 — garis aliran SVG di lapisan bawah.
 */
const SATELLITES = [
  { icon: Smartphone, labelKey: 'features.item4_title' },
  { icon: Globe, labelKey: 'visual_intel.item4_title' },
  { icon: TerminalSquare, labelKey: 'pricing.test_engine.6' },
  { icon: FolderTree, labelKey: 'docs_section.card2_title' },
  { icon: FileCheck2, labelKey: 'features.item6_title' },
];

const RADIUS = 148;

export const DarkNodeSection: React.FC = () => {
  const { t } = useI18n();

  return (
    <section className="section-dark section-editorial overflow-hidden relative">
      {/* Latar isometrik pipeline (I7, varian gelap) — ornament, bukan konten */}
      <img
        src="/assets/ci-headless-cloud-dark.webp"
        alt=""
        aria-hidden="true"
        loading="lazy"
        decoding="async"
        className="pointer-events-none select-none absolute right-0 top-1/2 -translate-y-1/2 w-[560px] max-w-[55%] opacity-[0.16] hidden lg:block"
      />
      <div className="container-constrained relative">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Teks */}
          <div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-accent)] mb-4">
              {t('about.badge')}
            </p>
            <h2 className="editorial-h2 mb-5">
              {t('about.title_part1')}{' '}
              <span className="text-[var(--color-accent)]">{t('about.title_part2')}</span>
            </h2>
            <p className="text-base leading-relaxed text-[var(--color-dark-section-muted)] max-w-xl mb-8">
              {t('about.description')}
            </p>
            <ul className="space-y-3">
              {['about.list_item1', 'about.list_item2', 'about.list_item3'].map((k) => (
                <li
                  key={k}
                  className="flex items-start gap-3 text-sm text-[var(--color-dark-section-muted)]"
                >
                  <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] shrink-0" />
                  {t(k)}
                </li>
              ))}
            </ul>
          </div>

          {/* Diagram orbit */}
          <div className="relative flex items-center justify-center min-h-[380px]">
            <svg
              viewBox="0 0 400 400"
              className="w-full max-w-[420px] h-auto"
              aria-hidden="true"
            >
              {/* rail aliran (M2) */}
              <circle cx="200" cy="200" r={RADIUS} fill="none" stroke="var(--color-node-line)" strokeWidth="1.5" opacity="0.5" />
              <circle
                cx="200"
                cy="200"
                r={RADIUS}
                fill="none"
                stroke="var(--color-accent)"
                strokeWidth="2"
                className="motion-flow"
                opacity="0.75"
              />
              <circle cx="200" cy="200" r={RADIUS * 0.58} fill="none" stroke="var(--color-node-line)" strokeWidth="1" opacity="0.35" />
              {SATELLITES.map((_, i) => {
                const a = (i / SATELLITES.length) * Math.PI * 2 - Math.PI / 2;
                return (
                  <line
                    key={i}
                    x1={200}
                    y1={200}
                    x2={200 + Math.cos(a) * RADIUS}
                    y2={200 + Math.sin(a) * RADIUS}
                    stroke="var(--color-node-line)"
                    strokeWidth="1"
                    opacity="0.45"
                  />
                );
              })}
            </svg>

            {/* hub */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="motion-hub w-20 h-20 rounded-2xl bg-[var(--color-accent)] flex items-center justify-center shadow-lg">
                <span className="font-sans font-black text-2xl text-white">H</span>
              </div>
            </div>

            {/* satelit: orbit berputar, isi counter-rotate agar tegak */}
            <div className="absolute inset-0 motion-orbit pointer-events-none">
              {SATELLITES.map((s, i) => {
                const a = (i / SATELLITES.length) * Math.PI * 2 - Math.PI / 2;
                const Icon = s.icon;
                return (
                  <div
                    key={i}
                    className="absolute"
                    style={{
                      left: `calc(50% + ${Math.cos(a) * 42}%)`,
                      top: `calc(50% + ${Math.sin(a) * 42}%)`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    <div className="motion-counter-orbit">
                      <div
                        className="w-12 h-12 rounded-xl bg-[var(--color-ink-soft)] border border-white/10 flex items-center justify-center shadow-md"
                        title={t(s.labelKey)}
                      >
                        <Icon className="w-5 h-5 text-[var(--color-dark-section-text)]" />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
