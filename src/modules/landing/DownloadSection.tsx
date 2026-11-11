import React, { useState } from 'react';
import { Apple, Monitor, Terminal, ExternalLink, Download as DownloadIcon, Check } from 'lucide-react';
import { useI18n } from '../../i18n/I18nContext';
import { Button } from '../../components/ui/Button';
import { Illustration } from '../../components/ui/Illustration';
import { WindowCard } from '../../components/ui/WindowCard';

const DOCS_URL = 'https://docs.theheimdall.com/';

const OS_TABS = [
  { key: 'os_macos', icon: Apple, fileKey: 'file_macos' },
  { key: 'os_windows', icon: Monitor, fileKey: 'file_windows' },
  { key: 'os_linux', icon: Terminal, fileKey: 'file_linux' },
];

/**
 * Blok unduhan. Tab OS → CTA unduh + link dokumentasi.
 * Tidak menampilkan perintah instalasi (belum final, keputusan user 2026-11-11).
 */
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
          {/* Kartu unduhan gelap — fokus utama */}
          <WindowCard title="heimdall-desktop" variant="dark" className="lg:col-span-3">
            <div className="flex flex-col h-full p-6 md:p-8">
              {/* Pilih OS */}
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-white/45 mb-3">
                {t('download.choose_platform')}
              </p>
              <div className="flex flex-wrap gap-2 mb-7">
                {OS_TABS.map((tab, i) => {
                  const Icon = tab.icon;
                  const on = i === os;
                  return (
                    <button
                      key={tab.key}
                      onClick={() => setOs(i)}
                      aria-pressed={on}
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-xs font-semibold transition-all duration-200 ${
                        on
                          ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/15 text-[var(--color-accent)] scale-[1.03]'
                          : 'border-white/15 text-white/60 hover:text-white hover:border-white/30'
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
                  <Button variant="filled" size="lg" className="w-full">
                    <ExternalLink className="w-4 h-4 text-white" />
                    {t('download.docs_cta')}
                  </Button>
                </a>
              </div>

              {/* Metadata rilis — statis; ganti otomatis saat ada release feed (ponytail) */}
              <div className="mt-5 rounded-lg border border-white/10 bg-white/5 px-4 py-3">
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]" aria-hidden="true" />
                  <span className="font-mono text-[11px] text-white/70">{t('download.latest')}</span>
                </div>
                <p className="font-mono text-xs text-white break-all">
                  {t(`download.${OS_TABS[os].fileKey}`)}
                </p>
                <a
                  href={DOCS_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex items-center gap-1.5 font-mono text-[11px] text-[var(--color-accent)] hover:underline"
                >
                  <ExternalLink className="w-3 h-3" />
                  {t('download.releases')}
                </a>
              </div>

              <p className="mt-4 font-mono text-xs text-white/55 leading-relaxed">{t('download.note')}</p>
            </div>
          </WindowCard>

          {/* Syarat + visual */}
          <div className="lg:col-span-2 flex flex-col gap-6">
            <div className="card-editorial bg-[var(--color-background)] p-6 flex-1">
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-accent)] mb-3">
                {t('download.req_title')}
              </p>
              <ul className="space-y-2.5">
                {t('download.req_desc')
                  .split(/\.\s+/)
                  .filter(Boolean)
                  .map((line) => (
                    <li key={line} className="flex items-start gap-2.5 text-body text-[var(--color-text-secondary)] leading-relaxed">
                      <Check className="w-3.5 h-3.5 mt-1 text-[var(--color-success)] shrink-0" />
                      <span>{line.replace(/\.$/, '')}</span>
                    </li>
                  ))}
              </ul>
            </div>
            <div className="card-editorial bg-[var(--color-canvas)] p-4 flex items-center justify-center overflow-hidden">
              <Illustration name="ci-headless-cloud" alt={t('download.title')} className="max-h-[150px]" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
