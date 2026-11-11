import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  PenLine,
  Smartphone,
  Play,
  ScanSearch,
  FileBarChart,
  Network,
  Database,
  GitCompareArrows,
  Settings,
} from 'lucide-react';
import { useI18n } from '../../i18n/I18nContext';
import { Illustration } from '../../components/ui/Illustration';
import { WindowCard } from '../../components/ui/WindowCard';
/**
 * Section "Everything in one app" (referensi) → versi Heimdall.
 * 10 modul desktop nyata, masing-masing menunjuk ke konten QA yang SUDAH ADA di i18n
 * (features.* / docs_section.* / visual_intel.*) — tidak ada teks karangan baru di sini.
 */
interface ModuleDef {
  key: string;
  icon: React.ComponentType<{ className?: string }>;
  titleKey: string;
  descKey: string;
  filename: string;
  art: React.ComponentProps<typeof Illustration>['name'];
}

const MODULES: ModuleDef[] = [
  {
    key: 'dashboard',
    icon: LayoutDashboard,
    titleKey: 'features.item6_title',
    descKey: 'features.item6_desc',
    filename: 'command_center.ts',
    art: 'automation-tools-grid',
  },
  {
    key: 'editor',
    icon: PenLine,
    titleKey: 'features.item3_title',
    descKey: 'features.item3_desc',
    filename: 'tms_editor.ts',
    art: 'dsl-script-stack',
  },
  {
    key: 'inspector',
    icon: ScanSearch,
    titleKey: 'features.item1_title',
    descKey: 'features.item1_desc',
    filename: 'smart_inspector.ts',
    art: 'selector-inspector',
  },
  {
    key: 'runner',
    icon: Play,
    titleKey: 'features.item2_title',
    descKey: 'features.item2_desc',
    filename: 'live_runner.ts',
    art: 'qa-workflow-hero',
  },
  {
    key: 'devices',
    icon: Smartphone,
    titleKey: 'features.item4_title',
    descKey: 'features.item4_desc',
    filename: 'device_fleet.ts',
    art: 'device-fleet-telemetry',
  },
  {
    key: 'telemetry',
    icon: Database,
    titleKey: 'features.item5_title',
    descKey: 'features.item5_desc',
    filename: 'telemetry.ts',
    art: 'device-fleet-telemetry',
  },
  {
    key: 'reports',
    icon: FileBarChart,
    titleKey: 'docs_section.card1_title',
    descKey: 'docs_section.card1_desc',
    filename: 'visual_reports.ts',
    art: 'visual-regression-diff',
  },
  {
    key: 'api',
    icon: Network,
    titleKey: 'visual_intel.item5_title',
    descKey: 'visual_intel.item5_desc',
    filename: 'api_assertions.ts',
    art: 'ci-headless-cloud',
  },
  {
    key: 'regression',
    icon: GitCompareArrows,
    titleKey: 'visual_intel.item6_title',
    descKey: 'visual_intel.item6_desc',
    filename: 'replay.ts',
    art: 'visual-regression-diff',
  },
  {
    key: 'settings',
    icon: Settings,
    titleKey: 'docs_section.card2_title',
    descKey: 'docs_section.card2_desc',
    filename: 'workspace_settings.ts',
    art: 'five-steps-ribbon',
  },
];

export const EverythingInOneApp: React.FC = () => {
  const { t } = useI18n();
  const [active, setActive] = useState(0);
  const current = MODULES[active];

  return (
    <section
      id="everything"
      className="section-editorial border-b border-[var(--color-border)] bg-[var(--color-background)]"
    >
      <div className="container-constrained">
        <div className="max-w-3xl mb-10 md:mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-xs font-semibold text-[var(--color-accent)] mb-5">
            {t('everything.badge')}
          </span>
          <h2 className="editorial-h2 text-[var(--color-text-primary)] mb-4">
            {t('everything.title')}
          </h2>
          <p className="editorial-lead">{t('everything.description')}</p>
        </div>

        {/* Segmented control — 10 modul, scroll horizontal di layar kecil */}
        <div className="flex gap-2 overflow-x-auto pb-3 mb-6 [scrollbar-width:none]">
          {MODULES.map((m, i) => {
            const Icon = m.icon;
            const on = i === active;
            return (
              <button
                key={m.key}
                onClick={() => setActive(i)}
                aria-pressed={on}
                className={`relative inline-flex items-center gap-2 shrink-0 rounded-full border px-4 py-2 font-mono text-xs font-semibold transition-colors ${
                  on
                    ? 'border-[var(--color-accent)] text-[var(--color-accent)]'
                    : 'border-[var(--color-border)] text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:border-[var(--color-text-muted)]'
                }`}
              >
                {on && (
                  <motion.span
                    layoutId="everything-pill"
                    className="absolute inset-0 rounded-full bg-[var(--color-accent)]/10"
                    transition={{ type: 'spring', stiffness: 380, damping: 32 }}
                  />
                )}
                <Icon className="relative w-3.5 h-3.5" />
                <span className="relative">{t(m.titleKey)}</span>
              </button>
            );
          })}
        </div>

        {/* Panel pratinjau — morph mulus antar tab */}
        <WindowCard title={current.filename} variant="default" noPadding>
          <div className="grid grid-cols-1 lg:grid-cols-5">
            <div className="lg:col-span-3 flex items-center justify-center bg-[var(--color-surface-muted)] p-6 md:p-10 min-h-[240px] md:min-h-[320px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.key}
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  transition={{ duration: 0.22 }}
                  className="w-full"
                >
                  <Illustration name={current.art} alt={t(current.titleKey)} className="max-h-[360px]" />
                </motion.div>
              </AnimatePresence>
            </div>

            <div className="lg:col-span-2 p-6 md:p-10 flex flex-col justify-center border-t lg:border-t-0 lg:border-l border-[var(--color-border)]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={current.key}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.22 }}
                >
                  <h3 className="editorial-h3 text-[var(--color-text-primary)] mb-3">
                    {t(current.titleKey)}
                  </h3>
                  <p className="text-body text-[var(--color-text-secondary)] leading-relaxed">
                    {t(current.descKey)}
                  </p>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </WindowCard>
      </div>
    </section>
  );
};
