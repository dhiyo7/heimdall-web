import React from 'react';

/**
 * Aset isometrik SPEC-41 (I1–I8) — raster WebP di public/assets/.
 * Varian terang/gelap dipilih lewat class `dark` pada <html> (ThemeToggle),
 * bukan prefers-color-scheme — dua <img> dengan util `.illu-light`/`.illu-dark` di index.css.
 */
export type IllustrationName =
  | 'qa-workflow-hero'
  | 'automation-tools-grid'
  | 'selector-inspector'
  | 'device-fleet-telemetry'
  | 'visual-regression-diff'
  | 'dsl-script-stack'
  | 'ci-headless-cloud'
  | 'five-steps-ribbon';

interface IllustrationProps {
  name: IllustrationName;
  alt: string;
  /** hero pakai eager; sisanya lazy. */
  priority?: boolean;
  className?: string;
}

const Lazy: React.FC<{ name: IllustrationName; alt: string; priority?: boolean; variant: 'light' | 'dark'; className: string }> = ({
  name, alt, priority, variant, className,
}) => (
  <img
    src={`/assets/${name}${variant === 'dark' ? '-dark' : ''}.webp`}
    alt={variant === 'light' ? alt : ''}
    aria-hidden={variant === 'dark' || undefined}
    width={1600}
    height={900}
    loading={priority ? 'eager' : 'lazy'}
    decoding="async"
    className={`${variant === 'dark' ? 'illu-dark' : 'illu-light'} w-full h-auto object-contain ${className}`}
    style={{ mixBlendMode: variant === 'light' ? 'multiply' : 'screen' }}
  />
);

export const Illustration: React.FC<IllustrationProps> = ({ name, alt, priority, className = '' }) => (
  <>
    <Lazy name={name} alt={alt} priority={priority} variant="light" className={className} />
    <Lazy name={name} alt={alt} priority={priority} variant="dark" className={className} />
  </>
);
