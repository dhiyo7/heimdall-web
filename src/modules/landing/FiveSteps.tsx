import React from 'react';
import { motion } from 'framer-motion';
import { Video, ScanSearch, FileCode2, Play, BarChart3 } from 'lucide-react';
import { useI18n } from '../../i18n/I18nContext';

/**
 * Visual "How it works": video loop alur 5 langkah (di-host Cloudinary).
 * - autoplay muted loop -> boleh autoplay di semua browser.
 * - prefers-reduced-motion -> sembunyikan video, tampilkan poster statis.
 */
const VIDEO_SRC =
  'https://res.cloudinary.com/devloops7/video/upload/v1794412131/breakearn/gemini_generated_video_55e5147a_u1zg21.mp4';

const VideoRibbon: React.FC<{ alt: string }> = ({ alt }) => {
  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  return (
    <div className="relative max-w-5xl mx-auto rounded-2xl overflow-hidden border border-[var(--color-border)] bg-[var(--color-canvas)]">
      {reduced ? (
        <img
          src="/assets/five-steps-ribbon.webp"
          alt={alt}
          className="w-full h-auto"
          style={{ mixBlendMode: 'multiply' }}
        />
      ) : (
        <video
          className="w-full h-auto block"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/assets/five-steps-ribbon.webp"
          aria-label={alt}
        >
          <source src={VIDEO_SRC} type="video/mp4" />
        </video>
      )}
    </div>
  );
};

/**
 * "From idea to posted video in five steps" (referensi) → lima langkah Heimdall.
 * Isi tiap langkah diambil dari roadmap.* yang SUDAH ADA — tidak mengarang fase baru.
 */
const STEPS = [
  { n: '1', icon: Video, titleKey: 'features.item2_title', descKey: 'roadmap.p1_desc', phaseKey: 'roadmap.p1_phase' },
  { n: '2', icon: ScanSearch, titleKey: 'features.item1_title', descKey: 'roadmap.p1_f2_desc', phaseKey: 'roadmap.p2_phase' },
  { n: '3', icon: FileCode2, titleKey: 'features.item3_title', descKey: 'roadmap.p3_f1_desc', phaseKey: 'roadmap.p3_phase' },
  { n: '4', icon: Play, titleKey: 'features.item4_title', descKey: 'roadmap.p2_f2_desc', phaseKey: 'roadmap.p2_phase' },
  { n: '5', icon: BarChart3, titleKey: 'features.item6_title', descKey: 'roadmap.p4_f1_desc', phaseKey: 'roadmap.p4_phase' },
];

export const FiveSteps: React.FC = () => {
  const { t } = useI18n();

  return (
    <section
      id="steps"
      className="section-editorial border-b border-[var(--color-border)] bg-[var(--color-surface)]"
    >
      <div className="container-constrained">
        <div className="max-w-3xl mb-10 md:mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-border)] bg-[var(--color-background)] text-xs font-semibold text-[var(--color-accent)] mb-5">
            {t('steps.badge')}
          </span>
          <h2 className="editorial-h2 text-[var(--color-text-primary)] mb-4">{t('steps.title')}</h2>
          <p className="editorial-lead">{t('steps.description')}</p>
        </div>

        <div className="mb-10 md:mb-14">
          <VideoRibbon alt={t('steps.title')} />
        </div>

        <ol className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-5">
          {STEPS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.li
                key={s.n}
                initial={{ opacity: 0, y: 14 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-80px' }}
                transition={{ duration: 0.4, delay: i * 0.12 }}
                className="relative card-editorial bg-[var(--color-background)] p-5 flex flex-col"
              >
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-5 h-[calc(100%-40px)] w-[3px] bg-[var(--color-accent)] rounded-full"
                />
                <div className="flex items-center gap-3 mb-3 pl-3">
                  <span className="inline-flex items-center justify-center w-8 h-8 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] font-mono text-xs font-bold text-[var(--color-accent)]">
                    {s.n}
                  </span>
                  <Icon className="w-4 h-4 text-[var(--color-text-muted)]" />
                </div>
                <p className="pl-3 font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--color-text-muted)] mb-1.5">
                  {t(s.phaseKey)}
                </p>
                <h3 className="pl-3 text-sm font-bold text-[var(--color-text-primary)] mb-2 leading-snug">
                  {t(s.titleKey)}
                </h3>
                <p className="pl-3 text-xs text-[var(--color-text-secondary)] leading-relaxed">
                  {t(s.descKey)}
                </p>
              </motion.li>
            );
          })}
        </ol>
      </div>
    </section>
  );
};
