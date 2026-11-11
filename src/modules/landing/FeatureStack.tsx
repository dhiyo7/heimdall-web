import React, { useRef, useState } from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { Illustration } from '../../components/ui/Illustration';
import { WindowCard } from '../../components/ui/WindowCard';
import type { IllustrationName } from '../../components/ui/Illustration';

/**
 * "You make the calls. Your agent does the work." (referensi) → daftar fitur bertumpuk.
 * Tiga blok diambil dari about.card1..3, lalu enam item dari features.item1..6.
 * Semua teks sudah ada di i18n — tidak ada penulisan ulang.
 */
interface StackEntry {
  key: string;
  titleKey: string;
  descKey: string;
  badgeKey: string;
  filename: string;
  art: IllustrationName;
  bullets?: string[];
}

const STACK: StackEntry[] = [
  {
    key: 'cross-platform',
    titleKey: 'about.card1_title',
    descKey: 'about.card1_desc',
    badgeKey: 'about.badge',
    filename: 'cross_platform.ts',
    art: 'qa-workflow-hero',
  },
  {
    key: 'dsl',
    titleKey: 'about.card2_title',
    descKey: 'about.card2_desc',
    badgeKey: 'common.unified_engine',
    filename: 'heimdall_dsl.ts',
    art: 'dsl-script-stack',
    bullets: ['about.list_item1', 'about.list_item2', 'about.list_item3'],
  },
  {
    key: 'artifacts',
    titleKey: 'about.card3_title',
    descKey: 'about.card3_desc',
    badgeKey: 'common.professional_tooling',
    filename: 'artifacts.ts',
    art: 'visual-regression-diff',
  },
  {
    key: 'inspector',
    titleKey: 'features.item1_title',
    descKey: 'features.item1_desc',
    badgeKey: 'visual_intel.item1_subtitle',
    filename: 'smart_inspector.ts',
    art: 'selector-inspector',
  },
  {
    key: 'fleet',
    titleKey: 'features.item4_title',
    descKey: 'features.item4_desc',
    badgeKey: 'visual_intel.item2_subtitle',
    filename: 'device_fleet.ts',
    art: 'device-fleet-telemetry',
  },
  {
    key: 'telemetry',
    titleKey: 'features.item5_title',
    descKey: 'features.item5_desc',
    badgeKey: 'visual_intel.item3_subtitle',
    filename: 'telemetry.ts',
    art: 'ci-headless-cloud',
  },
];

/** Kartu visual dengan tilt halus mengikuti pointer (M4) — nonaktif di layar sentuh. */
const TiltCard: React.FC<{ art: IllustrationName; alt: string }> = ({ art, alt }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== 'mouse') return;
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    setStyle({
      transform: `perspective(900px) rotateX(${(-py * 6).toFixed(2)}deg) rotateY(${(px * 6).toFixed(2)}deg)`,
    });
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={() => setStyle({})}
      style={{ transition: 'transform 200ms ease-out', ...style }}
      className="flex items-center justify-center bg-[var(--color-surface-muted)] p-6 md:p-10 h-full min-h-[220px]"
    >
      <Illustration name={art} alt={alt} className="max-h-[280px]" />
    </div>
  );
};

export const FeatureStack: React.FC = () => {
  const { t } = useI18n();

  return (
    <section
      id="features"
      className="section-editorial border-b border-[var(--color-border)] bg-[var(--color-background)]"
    >
      <div className="container-constrained">
        <div className="max-w-3xl mb-12 md:mb-20">
          <h2 className="editorial-h2 text-[var(--color-text-primary)] mb-4">
            {t('features.title_part1')}{' '}
            <span className="text-[var(--color-accent)]">{t('features.title_part2')}</span>
          </h2>
          <p className="editorial-lead">{t('features.description')}</p>
        </div>

        <div className="space-y-12 md:space-y-20">
          {STACK.map((entry, i) => (
            <div
              key={entry.key}
              className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12 items-center"
            >
              <div className={`${i % 2 === 1 ? 'lg:order-2' : ''} lg:self-start lg:sticky lg:top-28`}>
                <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent)] mb-3">
                  {t(entry.badgeKey)}
                </p>
                <h3 className="editorial-h3 text-[var(--color-text-primary)] mb-3">
                  {t(entry.titleKey)}
                </h3>
                <p className="text-body text-[var(--color-text-secondary)] leading-relaxed max-w-xl">
                  {t(entry.descKey)}
                </p>
                {entry.bullets && (
                  <ul className="mt-5 space-y-2">
                    {entry.bullets.map((b) => (
                      <li
                        key={b}
                        className="flex items-start gap-2.5 text-sm text-[var(--color-text-secondary)]"
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-[var(--color-accent)] shrink-0" />
                        {t(b)}
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <WindowCard
                title={entry.filename}
                variant={i === 0 ? 'highlight' : 'default'}
                noPadding
                className={i % 2 === 1 ? 'lg:order-1' : ''}
              >
                <TiltCard art={entry.art} alt={t(entry.titleKey)} />
              </WindowCard>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
