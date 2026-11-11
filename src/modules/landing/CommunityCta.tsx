import React from 'react';
import { Megaphone, Bug, Compass, MessageCircle } from 'lucide-react';
import { useI18n } from '../../i18n/I18nContext';

const BENEFITS = [
  { icon: Megaphone, titleKey: 'community.b1_title', descKey: 'community.b1_desc' },
  { icon: Bug, titleKey: 'community.b2_title', descKey: 'community.b2_desc' },
  { icon: Compass, titleKey: 'community.b3_title', descKey: 'community.b3_desc' },
];

/**
 * Blok CTA komunitas (referensi: "Join the WhatsApp group").
 * Warna tombol memakai token yang ada — bukan hijau WhatsApp literal.
 */
export const CommunityCta: React.FC = () => {
  const { t } = useI18n();
  const href = 'mailto:example@email.com?subject=Heimdall%20Community';

  return (
    <section id="community" className="section-editorial bg-[var(--color-background)] border-b border-[var(--color-border)]">
      <div className="container-constrained">
        <div className="card-editorial bg-[var(--color-surface)] p-6 md:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
            <div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-accent)] mb-4">
                {t('community.badge')}
              </p>
              <h2 className="editorial-h2 text-[var(--color-text-primary)] mb-4">
                {t('community.title')}
              </h2>
              <p className="editorial-lead mb-6">{t('community.description')}</p>

              <a
                href={href}
                className="inline-flex items-center gap-2.5 rounded-full bg-[var(--color-success)] px-6 py-3.5 font-bold text-sm text-white hover:opacity-90 transition-opacity focus:outline-none focus:ring-2 focus:ring-[var(--color-success)]/50"
              >
                <MessageCircle className="w-4 h-4" />
                {t('community.cta')}
              </a>
              <p className="mt-3 font-mono text-xs text-[var(--color-text-muted)]">{t('community.note')}</p>
            </div>

            <ul className="space-y-5 lg:pt-2">
              {BENEFITS.map((b) => {
                const Icon = b.icon;
                return (
                  <li key={b.titleKey} className="flex items-start gap-4">
                    <span className="inline-flex items-center justify-center w-9 h-9 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] shrink-0">
                      <Icon className="w-4 h-4 text-[var(--color-accent)]" />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-[var(--color-text-primary)] mb-1">
                        {t(b.titleKey)}
                      </p>
                      <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                        {t(b.descKey)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
};
