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

/** "Profesional Antarmuka" — galeri tangkapan layar, kini mengikuti tata letak editorial. */
export const MockupGallery: React.FC = () => {
  const { t } = useI18n();

  return (
    <section
      id="gallery"
      className="section-editorial border-b border-[var(--color-border)] bg-[var(--color-background)]"
    >
      <div className="container-constrained">
        <div className="max-w-3xl mb-10 md:mb-14">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] text-xs font-semibold text-[var(--color-accent)] mb-5">
            {t('visual_intel.badge')}
          </span>
          <h2 className="editorial-h2 text-[var(--color-text-primary)] mb-4">
            {t('gallery.title_part1')}{' '}
            <span className="text-[var(--color-accent)]">{t('gallery.title_part2')}</span>
          </h2>
          <p className="editorial-lead">{t('gallery.description')}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 md:gap-6">
          {images.map((img, idx) => (
            <WindowCard
              key={idx}
              title={img.alt}
              noPadding
              className={idx === 0 ? 'md:col-span-2' : ''}
              variant={idx === 0 ? 'highlight' : 'default'}
            >
              <img
                src={img.src}
                alt={img.alt}
                loading="lazy"
                decoding="async"
                width={1280}
                height={800}
                className="w-full h-auto object-cover"
              />
            </WindowCard>
          ))}
        </div>
      </div>
    </section>
  );
};
