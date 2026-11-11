import React, { useState } from 'react';
import { Apple, Monitor, Terminal, ExternalLink, Download as DownloadIcon } from 'lucide-react';
import { useI18n } from '../../i18n/I18nContext';
import { Button } from '../../components/ui/Button';
import { Illustration } from '../../components/ui/Illustration';
import { WindowCard } from '../../components/ui/WindowCard';

const DOCS_URL = 'https://docs.theheimdall.com/';

/**
 * Blok unduhan (referensi: "Download Tayang Studio").
 * Keputusan user 2026-11-11: tampilkan TOMBOL UNDUH + link DOKUMENTASI — tidak menampilkan
 * perintah instalasi yang belum final.
 */
const OS_TABS = [
  { key: 'os_macos', icon: Apple },
  { key: 'os_windows', icon: Monitor },
  { key: 'os_linux', icon: Terminal },
];

export const DownloadSection: React.FC = () => {
  const { t } = useI18n();
  const [os, setOs] = useState(0);

  return (
    <section id="download" className="section-editorial bg-[var(--color-surface)] border-b border-[var(--color-border)]">
      <div className="container-constrained">
        <div className="max-w-3xl mb-10 md:mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-border)] bg-[var(--color-background)] text-xs font-semibold text-[var(--color-accent)] mb-5">
            {t('download.badge')}
          </span>
          <h2 className="editorial-h2 text-[var(--color-text-primary)] mb-4">{t('download.title')}</h2>
          <p className="editorial-lead">{t('download.description')}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 md:gap-8 items-stretch">
          {/* Kartu unduhan gelap */}
          <WindowCard title="heimdall-desktop" variant="dark" className="lg:col-span-3">
            <div className="p-6 md:p-8">
              <div className="flex gap-2 mb-7">
                {OS_TABS.map((tab, i) => {
                  const Icon = tab.icon;
                  const on = i === os;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setOs(i)}
                      aria-pressed={on}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-xs font-semibold transition-colors ${
                        on
                          ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/15 text-[var(--color-accent)]'
                          : 'border-white/15 text-white/60 hover:text-white'
                      }`}
                    >
                      <Icon className="w-3.5 h-3.5" />
                      {t(`download.${tab.key}`)}
                    </button>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <a href={DOCS_URL} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button variant="primary" size="lg" className="w-full">
                    <DownloadIcon className="w-4 h-4" />
                    {t('download.cta')}
                  </Button>
                </a>
                <a href={DOCS_URL} target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button variant="secondary" size="lg" className="w-full">
                    <ExternalLink className="w-4 h-4" />
                    {t('download.docs_cta')}
                  </Button>
                </a>
              </div>

              <p className="mt-5 font-mono text-xs text-white/55 leading-relaxed">{t('download.note')}</p>
            </div>
          </WindowCard>

          {/* Syarat + visual */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="card-editorial bg-[var(--color-background)] p-6 flex-1">
              <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent)] mb-3">
                {t('download.req_title')}
              </p>
              <p className="text-body text-[var(--color-text-secondary)] leading-relaxed">
                {t('download.req_desc')}
              </p>
            </div>
            <div className="card-editorial bg-[var(--color-background)] p-4 flex items-center justify-center">
              <Illustration name="ci-headless-cloud" alt={t('download.title')} className="max-h-[150px]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
