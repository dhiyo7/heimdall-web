import React from 'react';
import { WindowCard } from '../../components/ui/WindowCard';
import { useI18n } from '../../i18n/I18nContext';

const images = [
  {
    src: "https://res.cloudinary.com/devloops7/image/upload/v1784408215/Heimdall/Pasted_image_hnumzq.png",
    alt: "Heimdall Desktop Interface",
  },
  {
    src: "https://res.cloudinary.com/devloops7/image/upload/v1784408215/Heimdall/Pasted_image_2_xiwra6.png",
    alt: "Visual Report & Telemetry",
  },
  {
    src: "https://res.cloudinary.com/devloops7/image/upload/v1784408215/Heimdall/Pasted_image_3_dl9vx4.png",
    alt: "Smart Inspector & Multi-Tab",
  },
  {
    src: "https://res.cloudinary.com/devloops7/image/upload/v1784408215/Heimdall/Pasted_image_4_awylhw.png",
    alt: "Live Test Runner",
  }
];

export const MockupGallery: React.FC = () => {
  const { t } = useI18n();

  return (
    <section id="gallery" className="pt-section pb-section border-b border-[var(--color-border)]">
      <div className="container-constrained">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-h2 text-[var(--color-text-primary)] mb-6 tracking-tight">
            {t('gallery.title_part1')} <span className="text-[var(--color-accent)]">{t('gallery.title_part2')}</span>
          </h2>
          <p className="text-body text-[var(--color-text-secondary)] leading-relaxed">
            {t('gallery.description')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {images.map((img, idx) => (
            <WindowCard key={idx} title={img.alt} noPadding className="h-full" variant="highlight">
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                className="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-opacity duration-300"
              />
            </WindowCard>
          ))}
        </div>
      </div>
    </section>
  );
};