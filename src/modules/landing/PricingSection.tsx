import React from 'react';
import { WindowCard } from '../../components/ui/WindowCard';
import { Button } from '../../components/ui/Button';
import {
  Check,
  X,
} from 'lucide-react';
import { useI18n } from '../../i18n/I18nContext';

type TierValue = boolean | string;

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
  nameKey: string;
  descKey: string;
  priceKey: string;
  noteKey: string;
  ctaKey: string;
  variant: 'primary' | 'secondary';
  popular: boolean;
  includesKey?: string;
  benefits: string[];
}

// ─────────────────────────────────────────────────────────────
// SINGLE SOURCE OF TRUTH — rendered by cards AND the table.
// String cells are i18n keys (pricing.val.*) so they translate.
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

// ─────────────────────────────────────────────────────────────
// Benefit-oriented copy: what the subscriber GETS, not feature names
// ─────────────────────────────────────────────────────────────
const plans: PlanInfo[] = [
  {
    nameKey: 'pricing.starter',
    descKey: 'pricing.starter_desc',
    priceKey: 'pricing.starter_price',
    noteKey: 'pricing.starter_note',
    ctaKey: 'pricing.starter_cta',
    variant: 'secondary',
    popular: false,
    benefits: [
      'pricing.starter_b1',
      'pricing.starter_b2',
      'pricing.starter_b3',
      'pricing.starter_b4',
      'pricing.starter_b5',
    ],
  },
  {
    nameKey: 'pricing.pro',
    descKey: 'pricing.pro_desc',
    priceKey: 'pricing.pro_price',
    noteKey: 'pricing.pro_note',
    ctaKey: 'pricing.pro_cta',
    variant: 'primary',
    popular: true,
    includesKey: 'pricing.everything_in_starter',
    benefits: [
      'pricing.pro_b1',
      'pricing.pro_b2',
      'pricing.pro_b3',
      'pricing.pro_b4',
      'pricing.pro_b5',
      'pricing.pro_b6',
    ],
  },
  {
    nameKey: 'pricing.enterprise',
    descKey: 'pricing.enterprise_desc',
    priceKey: 'pricing.enterprise_price',
    noteKey: 'pricing.enterprise_note',
    ctaKey: 'pricing.enterprise_cta',
    variant: 'secondary',
    popular: false,
    includesKey: 'pricing.everything_in_pro',
    benefits: [
      'pricing.enterprise_b1',
      'pricing.enterprise_b2',
      'pricing.enterprise_b3',
      'pricing.enterprise_b4',
      'pricing.enterprise_b5',
    ],
  },
];

const renderCellValue = (val: TierValue, t: (k: string) => string) => {
  if (typeof val === 'boolean') {
    return val ? (
      <Check className="w-5 h-5 text-[var(--color-success)] shrink-0" />
    ) : (
      <X className="w-5 h-5 text-[var(--color-text-muted)] opacity-30 shrink-0" />
    );
  }
  return (
    <span className="text-xs font-semibold text-[var(--color-text-primary)]">
      {t(val)}
    </span>
  );
};

export const PricingSection: React.FC = () => {
  const { t } = useI18n();

  return (
    <section
      id="pricing"
      className="py-20 border-b border-[var(--color-border)] bg-[var(--color-background)]"
    >
      <div className="container-constrained">
        {/* ── Section Header ── */}
        <div className="text-center mb-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-xs font-semibold text-[var(--color-accent)]">
            {t('pricing.badge')}
          </span>
        </div>

        <div className="text-center mb-20">
          <h2 className="text-h2 text-[var(--color-text-primary)] mb-6">
            {t('pricing.title_part1')}
          </h2>
          <p className="text-body text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed">
            {t('pricing.description')}
          </p>
        </div>

        {/* ── Benefit band: what every prospect gets ── */}
        {/* <div className="text-center mb-6">
          <span className="font-mono text-xs font-bold uppercase tracking-wider text-[var(--color-secondary)]">
            {t('pricing.included_badge')}
          </span>
          <h3 className="text-heading-27px font-bold text-[var(--color-text-primary)] mt-3">
            {t('pricing.included_title')}
          </h3>
          <p className="text-body text-[var(--color-text-secondary)] max-w-2xl mx-auto mt-3 leading-relaxed">
            {t('pricing.included_desc')}
          </p>
        </div> */}

        {/* <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-20">
          {includedFeatures.map(({ icon: Icon, titleKey, descKey }) => (
            <div
              key={titleKey}
              className="bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-lg p-6 transition-colors duration-200 hover:border-[var(--color-primary)]"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="inline-flex items-center justify-center w-8 h-8 rounded-md bg-[var(--color-surface)] border border-[var(--color-border)]">
                  <Icon className="w-4 h-4 text-[var(--color-primary)]" />
                </span>
                <span className="text-sm font-bold text-[var(--color-text-primary)]">
                  {t(titleKey)}
                </span>
              </div>
              <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">
                {t(descKey)}
              </p>
            </div>
          ))}
        </div> */}

        {/* ── 3-Tier Pricing Cards ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-20">
          {plans.map((plan, idx) => (
            <WindowCard
              key={idx}
              title={t(plan.nameKey)}
              variant={plan.popular ? 'highlight' : 'default'}
              className="flex flex-col h-full"
            >
              <div className="p-8 flex flex-col h-full relative">
                {plan.popular && (
                  <span className="absolute top-4 right-4 inline-block px-2.5 py-1 text-[10px] font-black uppercase tracking-wider bg-[var(--color-accent)] text-white rounded-sm">
                    {t('common.most_popular')}
                  </span>
                )}

                {/* Price — WingDeck Price Tag spec: 40px / 800, mono numerals */}
                <div className="mb-6">
                  <span className="font-mono text-[40px] leading-none font-extrabold text-[var(--color-text-muted)]">
                    {t(plan.priceKey)}
                  </span>
                  {plan.priceKey !== 'pricing.enterprise_price' && (
                    <span className="block text-xs text-[var(--color-success)] font-medium mt-2">
                      {t(plan.noteKey)}
                    </span>
                  )}
                </div>

                <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed mb-6">
                  {t(plan.descKey)}
                </p>

                {plan.includesKey && (
                  <p className="font-mono text-[10px] font-bold uppercase tracking-wider text-[var(--color-accent)] mb-3">
                    {t(plan.includesKey)}
                  </p>
                )}

                <ul className="space-y-3 mb-8 flex-grow">
                  {plan.benefits.map((bKey) => (
                    <li
                      key={bKey}
                      className="flex items-start gap-3 text-xs font-medium text-[var(--color-text-secondary)]"
                    >
                      <Check className="w-4 h-4 text-[var(--color-success)] shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{t(bKey)}</span>
                    </li>
                  ))}
                </ul>

                <Button variant={plan.variant} className="w-full mt-auto">
                  {t(plan.ctaKey)}
                </Button>
              </div>
            </WindowCard>
          ))}
        </div>

        {/* ── Full Spec Comparison ── */}
        <div className="mb-8">
          <h3 className="text-h3 text-[var(--color-text-primary)] mb-4 text-center font-bold">
            {t('pricing.comparison_title')}
          </h3>
          <p className="text-body text-[var(--color-text-secondary)] text-center max-w-xl mx-auto leading-relaxed">
            {t('pricing.comparison_desc')}
          </p>
        </div>

        <div className="space-y-12">
          {featureGroups.map((group, gIdx) => (
            <div key={gIdx}>
              <h4 className="text-heading-23px text-[var(--color-primary)] mb-4 font-black tracking-tight">
                {t(group.groupKey)}
              </h4>

              <div className="overflow-x-auto rounded-lg border border-[var(--color-border)] bg-[var(--color-surface-muted)] shadow-sm">
                <div className="min-w-[760px]">
                  <div className="grid grid-cols-4 font-mono text-xs font-bold tracking-wider border-b border-[var(--color-border)] bg-[var(--color-surface)]">
                    <div className="px-5 py-4 text-[var(--color-text-muted)] uppercase">
                      {t('pricing.group_header')}
                    </div>
                    <div className="px-5 py-4 text-center text-[var(--color-text-secondary)] uppercase border-l border-[var(--color-border)]">
                      {t('pricing.header_starter')}
                    </div>
                    <div className="px-5 py-4 text-center text-[var(--color-primary)] uppercase border-l border-[var(--color-border)] bg-[var(--color-surface-muted)]">
                      {t('pricing.header_pro')}
                    </div>
                    <div className="px-5 py-4 text-center text-[var(--color-text-secondary)] uppercase border-l border-[var(--color-border)]">
                      {t('pricing.header_enterprise')}
                    </div>
                  </div>

                  {group.rows.map((row, rIdx) => (
                    <div
                      key={rIdx}
                      className="grid grid-cols-4 font-sans text-sm border-b border-[var(--color-border)] last:border-b-0 hover:bg-[var(--color-surface)] transition-colors"
                    >
                      <div className="px-5 py-4 font-medium text-[var(--color-text-secondary)]">
                        {t(row.key)}
                      </div>
                      <div className="px-5 py-4 flex items-center justify-center border-l border-[var(--color-border)]">
                        {renderCellValue(row.starter, t)}
                      </div>
                      <div className="px-5 py-4 flex items-center justify-center border-l border-[var(--color-border)] bg-[var(--color-surface)]/50 font-semibold">
                        {renderCellValue(row.pro, t)}
                      </div>
                      <div className="px-5 py-4 flex items-center justify-center border-l border-[var(--color-border)]">
                        {renderCellValue(row.enterprise, t)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};