import React from 'react';
import { useI18n } from '../../i18n/I18nContext';
import { WindowCard } from '../../components/ui/WindowCard';

const featureItems = [
  { titleKey: 'features.item1_title', descKey: 'features.item1_desc', filename: 'smart_inspector.ts' },
  { titleKey: 'features.item2_title', descKey: 'features.item2_desc', filename: 'live_runner.ts' },
  { titleKey: 'features.item3_title', descKey: 'features.item3_desc', filename: 'test_mgmt.ts' },
  { titleKey: 'features.item4_title', descKey: 'features.item4_desc', filename: 'device_fleet.ts' },
  { titleKey: 'features.item5_title', descKey: 'features.item5_desc', filename: 'telemetry.ts' },
  { titleKey: 'features.item6_title', descKey: 'features.item6_desc', filename: 'reports.ts' },
];

export const Features: React.FC = () => {
  const { t } = useI18n();

  return (
    <section id="features" className="pt-section pb-section border-b border-[var(--color-border)]">
      <div className="container-constrained">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="responsive-text-h2 text-[var(--color-text-primary)] mb-6">
            {t('features.title_part1')} <span className="text-[var(--color-accent)]">{t('features.title_part2')}</span>
          </h2>
          <p className="text-body text-[var(--color-text-secondary)] leading-relaxed">
            {t('features.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {featureItems.map((item, idx) => (
            <WindowCard key={idx} title={item.filename} className="h-full" variant="default">
              <div className="p-6 flex flex-col h-full">
                <h3 className="text-heading-23px text-[var(--color-text-primary)] mb-3">{t(item.titleKey)}</h3>
                <p className="text-body text-[var(--color-text-secondary)] leading-relaxed flex-grow">
                  {t(item.descKey)}
                </p>
              </div>
            </WindowCard>
          ))}
        </div>
      </div>
    </section>
  );
};