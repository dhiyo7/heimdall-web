import React from 'react';
import { WindowCard } from '../../components/ui/WindowCard';
import { useI18n } from '../../i18n/I18nContext';

export const DocumentationSection: React.FC = () => {
  const { t } = useI18n();

  return (
    <section
      id="docs"
      className="py-12 md:py-16 border-b border-[var(--color-border)] bg-[var(--color-background)] transition-colors duration-300"
    >
      <div className="container-constrained">
        <div className="text-center mb-10 md:mb-16">
          <h2 className="font-extrabold responsive-text-h2 text-[var(--color-text-primary)] mb-6 tracking-tight">
            {t('docs_section.title')}
          </h2>
          <p className="text-lg text-[var(--color-text-secondary)] max-w-xl mx-auto">
            {t('docs_section.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 items-stretch">
          {/* Left Column */}
          <WindowCard title="live_preview.exe" className="h-full">
            <div className="p-5 space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-[var(--color-primary)]/10 rounded-md border border-[var(--color-border)]">
                  <svg className="w-6 h-6 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542 7z"></path></svg>
                </div>
                <h3 className="font-sans font-bold text-lg text-[var(--color-text-primary)]">Live Runner & Mirroring</h3>
              </div>
              <p className="font-sans text-sm text-[var(--color-text-secondary)] leading-relaxed">
                No more guessing what happens on the device screen. With <strong>Floating Live Preview</strong> and <strong>Interactive Mirroring</strong>, you can see execution in real time. Touch or type from your laptop, and watch how the app on your phone responds without delay.
              </p>
            </div>
          </WindowCard>

          {/* Right Column */}
          <WindowCard title="test_management.db" className="h-full">
            <div className="p-5 space-y-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 bg-[var(--color-primary)]/10 rounded-md border border-[var(--color-border)]">
                  <svg className="w-6 h-6 text-[var(--color-accent)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
                </div>
                <h3 className="font-sans font-bold text-lg text-[var(--color-text-primary)]">Unified Test Management</h3>
              </div>
              <p className="font-sans text-sm text-[var(--color-text-secondary)] leading-relaxed">
                Goodbye to cluttered text files. Our <strong>Test Management System (TMS)</strong> organizes all your scenarios in an easy-to-read hierarchy. Features a multi-tab Script Editor like a professional IDE with auto-save functionality.
              </p>
            </div>
          </WindowCard>
        </div>
      </div>
    </section>
  );
};