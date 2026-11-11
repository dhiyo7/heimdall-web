import React, { useEffect, useRef } from 'react';
import { ArrowDown } from 'lucide-react';
import { useI18n } from '../../i18n/I18nContext';
import { Button } from '../../components/ui/Button';

/**
 * Grid pulse (referensi: kotak-kotak grid menyala mengikuti pointer).
 * Garis grid selalu terlihat samar; sel di sekitar kursor menyala (warna aksen)
 * lalu meredup. Warna dibaca dari --color-accent sehingga ikut light/dark mode.
 */
const CELL = 38;
const RADIUS = 3.2; // radius dalam satuan sel

const GridPulse: React.FC = () => {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const cv = ref.current;
    if (!cv) return;
    const ctx = cv.getContext('2d', { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let w = 0;
    let h = 0;
    const pointer = { x: -9999, y: -9999, active: false };
    const glow = new Map<string, number>();

    // Baca warna sekali (bukan tiap frame — ini penyebab utama lag).
    let accent = '#c4693f';
    const syncColors = () => {
      const s = getComputedStyle(document.documentElement);
      accent = s.getPropertyValue('--color-accent').trim() || accent;
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
      const rect = cv.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      cv.width = Math.floor(w * dpr);
      cv.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      if (reduced || !pointer.active) draw(false);
    };

    // Gambar ulang hanya sel yang menyala; grid garis digambar via CSS di belakang canvas.
    const draw = (animate: boolean) => {
      ctx.clearRect(0, 0, w, h);
      const cols = Math.ceil(w / CELL);
      const rows = Math.ceil(h / CELL);

      if (animate && pointer.active) {
        const cx = Math.floor(pointer.x / CELL);
        const cy = Math.floor(pointer.y / CELL);
        const r = Math.ceil(RADIUS);
        for (let dx = -r; dx <= r; dx++) {
          for (let dy = -r; dy <= r; dy++) {
            const gx = cx + dx;
            const gy = cy + dy;
            if (gx < 0 || gy < 0 || gx > cols || gy > rows) continue;
            const d = Math.hypot(dx, dy);
            if (d > RADIUS) continue;
            const target = 1 - d / RADIUS;
            const key = `${gx}:${gy}`;
            if (target > (glow.get(key) ?? 0)) glow.set(key, target);
          }
        }
      }

      ctx.fillStyle = accent;
      for (const [key, v] of glow) {
        const next = animate ? v - 0.03 : v;
        if (next <= 0.02) { glow.delete(key); continue; }
        if (animate) glow.set(key, next);
        const [gx, gy] = key.split(':').map(Number);
        ctx.globalAlpha = Math.min(1, next) * 0.8;
        ctx.fillRect(gx * CELL + 1, gy * CELL + 1, CELL - 2, CELL - 2);
      }
      ctx.globalAlpha = 1;
    };

    // rAF hanya jalan bila ada sel aktif -> hemat CPU saat idle.
    const frame = () => {
      draw(true);
      raf = glow.size > 0 ? requestAnimationFrame(frame) : 0;
    };
    const kick = () => { if (!raf && !reduced) raf = requestAnimationFrame(frame); };

    const onMove = (e: PointerEvent) => {
      const rect = cv.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
      kick();
    };
    const onLeave = () => { pointer.active = false; };

    syncColors();
    resize();
    window.addEventListener('resize', resize);
    cv.parentElement?.addEventListener('pointermove', onMove);
    cv.parentElement?.addEventListener('pointerleave', onLeave);
    window.addEventListener('theme-change', syncColors);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
      window.removeEventListener('theme-change', syncColors);
      cv.parentElement?.removeEventListener('pointermove', onMove);
      cv.parentElement?.removeEventListener('pointerleave', onLeave);
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className="absolute inset-0 w-full h-full pointer-events-none" />;
};

/**
 * Hero editorial terpusat (referensi: headline 3 baris + 2 CTA).
 * Keputusan user: CTA utama → #pricing. Visual isometrik dihapus,
 * diganti animasi grid pulse yang reaktif terhadap pointer.
 */
export const Hero: React.FC = () => {
  const { t } = useI18n();

  return (
    <section id="home" className="relative bg-gradient-hero overflow-hidden scroll-mt-24">
      {/* Garis grid statis via CSS (canvas hanya menggambar sel menyala -> ringan) */}
      <div
        className="absolute inset-0 pointer-events-none opacity-40"
        style={{
          backgroundImage:
            'linear-gradient(to right, var(--color-border) 1px, transparent 1px), linear-gradient(to bottom, var(--color-border) 1px, transparent 1px)',
          backgroundSize: `${CELL}px ${CELL}px`,
        }}
      />
      <div className="absolute inset-0">
        <GridPulse />
      </div>
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[var(--color-background)] pointer-events-none" />

      <div className="container-constrained relative pt-24 md:pt-32 pb-24 md:pb-36">
        <div className="flex flex-col items-center text-center">
          <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-surface)] font-mono text-[11px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)] mb-7">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-success)]" />
            {t('common.v2_beta')}
          </span>

          <h1 className="editorial-h1 text-[var(--color-text-primary)] max-w-5xl mb-6">
            {t('hero.title_part1')}
            <br />
            <span className="text-[var(--color-accent)]">{t('hero.title_part2')}</span>
          </h1>

          <p className="editorial-lead mx-auto mb-8">{t('hero.description')}</p>

          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4 mb-5">
            <a href="#pricing">
              <Button variant="primary" size="lg">{t('common.free_trial')}</Button>
            </a>
            <a href="#steps">
              <Button variant="secondary" size="lg">
                {t('common.view_features')}
                <ArrowDown className="w-4 h-4" />
              </Button>
            </a>
          </div>

          <p className="font-mono text-[11px] text-[var(--color-text-muted)] tracking-wide">
            {t('hero.trust_line')}
          </p>
        </div>
      </div>
    </section>
  );
};
