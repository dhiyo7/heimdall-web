import React, { useState } from 'react';
import { faqData } from './faqData';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useI18n } from '../../i18n/I18nContext';

export const FAQSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const { t } = useI18n();

  return (
    <section id="faq" className="py-14 md:py-20 bg-[var(--color-background)] border-b border-[var(--color-border)] transition-colors duration-300">
      <div className="container-constrained">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="responsive-text-h2 text-[var(--color-text-primary)] mb-6">
            {t('faq.title_part1')} <span className="text-[var(--color-accent)]">{t('faq.title_part2')}</span>
          </h2>
          <p className="text-body text-[var(--color-text-secondary)] max-w-2xl mx-auto leading-relaxed">
            {t('faq.description')}
          </p>
        </div>

        <div className="space-y-2">
          {faqData.map((faq, index) => (
            <div
              key={index}
              className="bg-[var(--color-surface-muted)] border border-[var(--color-border)] rounded-lg overflow-hidden"
            >
              <button
                className="w-full px-5 py-4 text-left flex items-center justify-between bg-transparent hover:bg-[var(--color-surface)] transition-colors duration-200"
                onClick={() => setOpenIndex(index === openIndex ? null : index)}
                aria-expanded={openIndex === index}
              >
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <HelpCircle className="w-5 h-5 text-[var(--color-accent)] shrink-0" />
                  <h3 className="text-sm sm:text-base md:text-[23px] text-[var(--color-text-secondary)] font-semibold leading-snug break-words">
                    {t(faq.questionKey)}
                  </h3>
                </div>
                <ChevronDown
                  className={`w-5 h-5 text-[var(--color-text-muted)] shrink-0 transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}
                />
              </button>

              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 py-4 border-t border-[var(--color-border)] bg-[var(--color-surface)]">
                      <p className="text-body text-[var(--color-text-secondary)] leading-relaxed">
                        {t(faq.answerKey)}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};