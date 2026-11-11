import React from 'react';
import { useI18n } from '../../i18n/I18nContext';

/**
 * Strip kecil di bawah hero — mengikuti pola "Works with the agent you already use" di referensi.
 * Isinya ekosistem NYATA Heimdall, bukan mengarang nama produk.
 */
const ECOSYSTEM = [
  'ADB',
  'Android UI Automator',
  'Selenium WebDriver',
  'Playwright',
  'Scrcpy',
  'GitHub Actions',
  'GitLab CI',
  'Jenkins',
  'Headless CLI',
];

export const TrustStrip: React.FC = () => {
  const { t } = useI18n();
  const row = [...ECOSYSTEM, ...ECOSYSTEM];

  return (
    <section
      aria-label={t('hero.ecosystem_caption')}
      className="border-b border-[var(--color-border)] bg-[var(--color-background)] py-7 overflow-hidden"
    >
      <p className="container-constrained text-center font-mono text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-text-muted)] mb-5">
        {t('hero.ecosystem_caption')}
      </p>

      <div className="relative">
        <div className="marquee-track gap-10 px-6" aria-hidden="true">
          {row.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="whitespace-nowrap font-mono text-[13px] font-semibold text-[var(--color-text-secondary)] opacity-70"
            >
              {name}
            </span>
          ))}
        </div>
        {/* tepi memudar agar strip terasa menyambung */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[var(--color-background)] to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-16 bg-gradient-to-l from-[var(--color-background)] to-transparent" />
      </div>
    </section>
  );
};
