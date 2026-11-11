import React, { useState } from 'react';
import { faqData } from './faqData';
import { Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '../../i18n/I18nContext';

/** Accordion "Questions" (referensi) — judul kiri, tanda + di kanan, panel halus. */
export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  const { t } = useI18n();

  return (
    <section
      id="faq"
      className="section-editorial bg-[var(--color-background)] border-b border-[var(--color-border)] transition-colors duration-300"
    >
      <div className="container-constrained">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
          <div className="lg:col-span-1">
            <h2 className="editorial-h2 text-[var(--color-text-primary)] mb-4">
              {t('faq.title_part1')}{' '}
              <span className="text-[var(--color-accent)]">{t('faq.title_part2')}</span>
            </h2>
            <p className="text-body text-[var(--color-text-secondary)] leading-relaxed">
              {t('faq.description')}
            </p>
          </div>

          <div className="lg:col-span-2 divide-y divide-[var(--color-border)] border-t border-[var(--color-border)]">
            {faqData.map((faq, index) => {
              const open = openIndex === index;
              return (
                <div key={index}>
                  <button
                    className="w-full py-5 text-left flex items-start justify-between gap-6 bg-transparent group"
                    onClick={() => setOpenIndex(open ? null : index)}
                    aria-expanded={open}
                  >
                    <span
                      className={`text-base md:text-lg font-semibold leading-snug transition-colors ${
                        open
                          ? 'text-[var(--color-text-primary)]'
                          : 'text-[var(--color-text-secondary)] group-hover:text-[var(--color-text-primary)]'
                      }`}
                    >
                      {t(faq.questionKey)}
                    </span>
                    <Plus
                      className={`w-5 h-5 shrink-0 mt-0.5 text-[var(--color-text-muted)] transition-transform duration-300 ${
                        open ? 'rotate-45 text-[var(--color-accent)]' : ''
                      }`}
                    />
                  </button>

                  <AnimatePresence initial={false}>
                    {open && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.26, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                      >
                        <p className="pb-6 pr-10 text-body text-[var(--color-text-secondary)] leading-relaxed max-w-[68ch]">
                          {t(faq.answerKey)}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};
