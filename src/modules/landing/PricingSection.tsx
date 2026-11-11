import React, { useState } from 'react';
import { Check, ChevronDown, Sparkles, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../../components/ui/Button';
import { useI18n } from '../../i18n/I18nContext';

type TierValue = boolean | string;
type Tier = 'starter' | 'pro' | 'enterprise';

interface FeatureRow {
  key: string;
  starter: TierValue;
  pro: TierValue;
  enterprise: TierValue;
}

interface FeatureGroup {
  groupKey: string;
  rows: FeatureRow[];
}

interface PlanInfo {
  tier: Tier;
  nameKey: string;
  descKey: string;
  priceKey: string;
  noteKey: string;
  ctaKey: string;
  variant: 'primary' | 'secondary';
  popular: boolean;
  includesKey?: string;
}

// ─────────────────────────────────────────────────────────────
// Single source of truth — dipakai untuk daftar benefit per paket.
// String cell adalah kunci i18n (pricing.val.*) agar ikut translate.
// ─────────────────────────────────────────────────────────────
const featureGroups: FeatureGroup[] = [
  {
    groupKey: 'pricing.group1',
    rows: [
      { key: 'pricing.test_engine.1', starter: true, pro: true, enterprise: true },
      { key: 'pricing.test_engine.2', starter: 'pricing.val.devices_1', pro: 'pricing.val.devices_5', enterprise: 'pricing.val.unlimited' },
      { key: 'pricing.test_engine.3', starter: true, pro: true, enterprise: true },
      { key: 'pricing.test_engine.4', starter: false, pro: 'pricing.val.batch_concurrency', enterprise: 'pricing.val.distributed_grid' },
      { key: 'pricing.test_engine.5', starter: 'pricing.val.process_1', pro: 'pricing.val.parallel_10', enterprise: 'pricing.val.unlimited' },
      { key: 'pricing.test_engine.6', starter: false, pro: true, enterprise: true },
    ],
  },
  {
    groupKey: 'pricing.group2',
    rows: [
      { key: 'pricing.desktop_ui.1', starter: true, pro: true, enterprise: true },
      { key: 'pricing.desktop_ui.2', starter: 'pricing.val.window_1', pro: 'pricing.val.tabs_5', enterprise: 'pricing.val.custom_grid' },
      { key: 'pricing.desktop_ui.3', starter: true, pro: true, enterprise: true },
      { key: 'pricing.desktop_ui.4', starter: 'pricing.val.basic', pro: 'pricing.val.full', enterprise: 'pricing.val.custom_embed' },
      { key: 'pricing.desktop_ui.5', starter: 'pricing.val.cases_200', pro: 'pricing.val.cases_5000', enterprise: 'pricing.val.unlimited' },
      { key: 'pricing.desktop_ui.6', starter: false, pro: true, enterprise: true },
    ],
  },
  {
    groupKey: 'pricing.group3',
    rows: [
      { key: 'pricing.advanced.1', starter: false, pro: true, enterprise: true },
      { key: 'pricing.advanced.2', starter: false, pro: true, enterprise: true },
      { key: 'pricing.advanced.3', starter: false, pro: true, enterprise: true },
      { key: 'pricing.advanced.4', starter: false, pro: 'pricing.val.beta', enterprise: true },
      { key: 'pricing.advanced.5', starter: false, pro: 'pricing.val.beta', enterprise: true },
      { key: 'pricing.advanced.6', starter: false, pro: false, enterprise: 'pricing.val.roadmap' },
      { key: 'pricing.advanced.7', starter: false, pro: false, enterprise: 'pricing.val.roadmap' },
      { key: 'pricing.advanced.8', starter: false, pro: false, enterprise: 'pricing.val.roadmap' },
    ],
  },
  {
    groupKey: 'pricing.group4',
    rows: [
      { key: 'pricing.reports.1', starter: 'pricing.val.days_7', pro: 'pricing.val.days_30', enterprise: 'pricing.val.unlimited' },
      { key: 'pricing.reports.2', starter: false, pro: true, enterprise: true },
      { key: 'pricing.reports.3', starter: false, pro: true, enterprise: true },
      { key: 'pricing.reports.4', starter: 'pricing.val.realtime', pro: 'pricing.val.history_7d', enterprise: 'pricing.val.grafana' },
      { key: 'pricing.reports.5', starter: true, pro: true, enterprise: true },
    ],
  },
  {
    groupKey: 'pricing.group5',
    rows: [
      { key: 'pricing.license.1', starter: 'pricing.val.users_1', pro: 'pricing.val.users_5', enterprise: 'pricing.val.seats_custom' },
      { key: 'pricing.license.2', starter: 'pricing.val.community', pro: 'pricing.val.email_wa', enterprise: 'pricing.val.support_247' },
      { key: 'pricing.license.3', starter: 'pricing.val.best_effort', pro: 'pricing.val.response_48h', enterprise: 'pricing.val.response_4h' },
      { key: 'pricing.license.4', starter: false, pro: false, enterprise: true },
      { key: 'pricing.license.5', starter: false, pro: false, enterprise: true },
      { key: 'pricing.license.6', starter: 'pricing.val.self_docs', pro: 'pricing.val.onboarding', enterprise: 'pricing.val.consultant' },
    ],
  },
];

const plans: PlanInfo[] = [
  {
    tier: 'starter',
    nameKey: 'pricing.starter',
    descKey: 'pricing.starter_desc',
    priceKey: 'pricing.starter_price',
    noteKey: 'pricing.starter_note',
    ctaKey: 'pricing.starter_cta',
    variant: 'secondary',
    popular: false,
  },
  {
    tier: 'pro',
    nameKey: 'pricing.pro',
    descKey: 'pricing.pro_desc',
    priceKey: 'pricing.pro_price',
    noteKey: 'pricing.pro_note',
    ctaKey: 'pricing.pro_cta',
    variant: 'primary',
    popular: true,
    includesKey: 'pricing.everything_in_starter',
  },
  {
    tier: 'enterprise',
    nameKey: 'pricing.enterprise',
    descKey: 'pricing.enterprise_desc',
    priceKey: 'pricing.enterprise_price',
    noteKey: 'pricing.enterprise_note',
    ctaKey: 'pricing.enterprise_cta',
    variant: 'secondary',
    popular: false,
    includesKey: 'pricing.everything_in_pro',
  },
];

/** Nilai sel → teks/ikon. Hanya baris yang TRUE/label yang ditampilkan di detail. */
const CellValue: React.FC<{ val: TierValue; t: (k: string) => string }> = ({ val, t }) => {
  if (typeof val === 'boolean')
    return val ? <Check className="w-4 h-4 text-[var(--color-success)] shrink-0" /> : null;
  return <span className="text-xs font-semibold text-[var(--color-accent)]">{t(val)}</span>;
};

const PlanDetail: React.FC<{ tier: Tier; t: (k: string) => string }> = ({ tier, t }) => {
  const groups = featureGroups
    .map((g) => ({
      groupKey: g.groupKey,
      rows: g.rows.filter((r) => {
        const v = r[tier];
        return v !== false; // sembunyikan yang tidak didapat — fokus ke "apa yang kamu dapat"
      }),
    }))
    .filter((g) => g.rows.length > 0);

  return (
    <div className="space-y-6">
      {groups.map((g, gi) => (
        <motion.div
          key={g.groupKey}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.08 * gi, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-accent)] mb-2.5">
            {t(g.groupKey)}
          </p>
          <ul className="space-y-2">
            {g.rows.map((r, ri) => (
              <motion.li
                key={r.key}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 + gi * 0.06 + ri * 0.025, duration: 0.3 }}
                className="flex items-start gap-2.5 text-xs text-[var(--color-text-secondary)] leading-relaxed"
              >
                <Check className="w-3.5 h-3.5 mt-0.5 text-[var(--color-success)] shrink-0" />
                <span className="flex-1">{t(r.key)}</span>
                <CellValue val={r[tier]} t={t} />
              </motion.li>
            ))}
          </ul>
        </motion.div>
      ))}
    </div>
  );
};

export const PricingSection: React.FC = () => {
  const { t } = useI18n();
  const [open, setOpen] = useState<Tier | null>(null);
  const activePlan = open ? plans.find((p) => p.tier === open) : undefined;
  const compact = open !== null; // mode detail: card jadi sidebar, benefit di panel kanan

  return (
    <section
      id="pricing"
      className="section-editorial border-b border-[var(--color-border)] bg-[var(--color-background)]"
    >
      <div className="container-constrained">
        <div className="max-w-3xl mb-10 md:mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-xs font-semibold text-[var(--color-accent)] mb-5">
            {t('pricing.badge')}
          </span>
          <h2 className="editorial-h2 text-[var(--color-text-primary)] mb-4">{t('pricing.title_part1')}</h2>
          <p className="editorial-lead">{t('pricing.description')}</p>
        </div>

        {/* Kartu paket — klik untuk membuka detail (pengganti tabel perbandingan).
            Saat terbuka: card terpilih + card lain mengerumun ke kolom kiri (sidebar),
            panel benefit muncul di sebelahnya. Framer Motion `layout` menganimasikan morph. */}
        <motion.div
          layout
          transition={{ layout: { type: 'spring', stiffness: 260, damping: 32 } }}
          className={`grid grid-cols-1 gap-5 md:gap-6 items-start ${open ? 'lg:grid-cols-12' : 'lg:grid-cols-3'}`}
        >
          {plans.map((plan, idx) => {
            const isOpen = open === plan.tier;
            return (
              <motion.div
                key={plan.tier}
                layout
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{
                  duration: 0.5,
                  delay: idx * 0.08,
                  ease: [0.22, 1, 0.36, 1],
                  layout: { type: 'spring', stiffness: 280, damping: 30 },
                }}
                onClick={!compact ? () => setOpen(plan.tier) : undefined}
                className={`relative flex flex-col rounded-[var(--landing-card-radius)] border bg-[var(--color-surface)] transition-shadow duration-300 ${
                  !compact ? 'cursor-pointer ' : ''
                }${
                  isOpen
                    ? 'border-[var(--color-accent)] shadow-[0_24px_60px_-18px_rgba(196,105,63,0.45)] z-10 order-1 lg:col-start-1 lg:col-span-4'
                    : compact
                      ? `border-[var(--color-border)] hover:border-[var(--color-accent)]/60 order-3 lg:col-start-1 lg:col-span-4 ${
                          plan.popular ? 'ring-1 ring-[var(--color-accent)]/25' : ''
                        }`
                      : plan.popular
                        ? 'border-[var(--color-accent)] shadow-lg ring-1 ring-[var(--color-accent)]/25'
                        : 'border-[var(--color-border)] hover:border-[var(--color-accent)]/60'
                }`}
              >
                {plan.popular && (
                  <div className="bg-[var(--color-accent)] text-white text-center font-mono text-[10px] font-bold uppercase tracking-[0.16em] py-2 rounded-t-[calc(var(--landing-card-radius)-1px)]">
                    {t('common.most_popular')}
                  </div>
                )}

                <div className="p-6 md:p-7 flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h3 className="editorial-h3 text-[var(--color-text-primary)] mb-1">{t(plan.nameKey)}</h3>
                      <p className="text-xs text-[var(--color-text-muted)]">{t(plan.descKey)}</p>
                    </div>
                    {isOpen && (
                      <motion.span
                        initial={{ scale: 0, rotate: -120 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ type: 'spring', stiffness: 320, damping: 18 }}
                        className="shrink-0"
                      >
                        <Sparkles className="w-5 h-5 text-[var(--color-accent)]" />
                      </motion.span>
                    )}
                  </div>

                  <div className="mt-5 mb-5 pb-5 border-b border-[var(--color-border)]">
                    <span className="font-mono text-3xl md:text-[36px] leading-none font-extrabold text-[var(--color-text-primary)]">
                      {t(plan.priceKey)}
                    </span>
                    {plan.priceKey !== 'pricing.enterprise_price' && (
                      <span className="block text-xs text-[var(--color-text-muted)] font-medium mt-2">{t(plan.noteKey)}</span>
                    )}
                  </div>

                  {/* Tombol toggle detail — benefit lengkap & CTA tampil di panel detail */}
                  <button
                    onClick={() => setOpen(isOpen ? null : plan.tier)}
                    aria-expanded={isOpen}
                    className="group mt-auto inline-flex items-center justify-center gap-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] px-4 py-2.5 text-sm font-semibold text-[var(--color-text-primary)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/50"
                  >
                    {isOpen ? 'Tutup detail' : 'Lihat detail paket'}
                    <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.35 }}>
                      <ChevronDown className="w-4 h-4" />
                    </motion.span>
                  </button>
                </div>
              </motion.div>
            );
          })}

          {/* Panel benefit — di sebelah sidebar card */}
          <AnimatePresence mode="popLayout" initial={false}>
            {activePlan && (
              <motion.div
                key={activePlan.tier}
                initial={{ opacity: 0, x: 48 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 48 }}
                transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                className="order-2 lg:col-start-5 lg:col-span-8 lg:row-start-1 lg:row-span-3"
              >
                <div className="h-full flex flex-col rounded-[var(--landing-card-radius)] border border-[var(--color-accent)]/40 bg-[var(--color-surface-muted)] p-6 md:p-8 shadow-[0_24px_60px_-18px_rgba(196,105,63,0.3)]">
                  <div className="flex items-start justify-between gap-4 mb-6 pb-5 border-b border-[var(--color-border)]">
                    <div>
                      <h3 className="editorial-h3 text-[var(--color-text-primary)] mb-1">
                        {t(activePlan.nameKey)}
                        <span className="font-mono text-sm font-medium text-[var(--color-accent)] ml-3">
                          {t(activePlan.priceKey)}
                        </span>
                      </h3>
                      {activePlan.includesKey && (
                        <p className="font-mono text-[10px] font-bold uppercase tracking-[0.16em] text-[var(--color-accent)]">
                          {t(activePlan.includesKey)}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => setOpen(null)}
                      aria-label="Tutup detail"
                      className="shrink-0 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] p-2 text-[var(--color-text-muted)] transition-colors hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] focus:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]/50"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex-1">
                    <PlanDetail tier={activePlan.tier} t={t} />
                  </div>

                  <a href="#pricing" className="mt-8">
                    <Button variant={activePlan.variant} size="lg" className="w-full">{t(activePlan.ctaKey)}</Button>
                  </a>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </section>
  );
};
