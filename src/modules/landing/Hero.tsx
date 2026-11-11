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
    const ctx = cv.getContext('2d');
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;
    let w = 0;
    let h = 0;
    const pointer = { x: -9999, y: -9999, active: false };
    const glow = new Map<string, number>();

    const readVar = (n: string, fb: string) =>
      getComputedStyle(document.documentElement).getPropertyValue(n).trim() || fb;

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const rect = cv.getBoundingClientRect();
      w = rect.width;
      h = rect.height;
      cv.width = Math.floor(w * dpr);
      cv.height = Math.floor(h * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const draw = (animate: boolean) => {
      ctx.clearRect(0, 0, w, h);
      const accent = readVar('--color-accent', '#d97757');
      const line = readVar('--color-border', '#d2d2d6');
      const cols = Math.ceil(w / CELL);
      const rows = Math.ceil(h / CELL);

      // 1) Garis grid samar (selalu tampak)
      ctx.strokeStyle = line;
      ctx.globalAlpha = 0.35;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let x = 0; x <= cols; x++) { ctx.moveTo(x * CELL + 0.5, 0); ctx.lineTo(x * CELL + 0.5, h); }
      for (let y = 0; y <= rows; y++) { ctx.moveTo(0, y * CELL + 0.5); ctx.lineTo(w, y * CELL + 0.5); }
      ctx.stroke();
      ctx.globalAlpha = 1;

      // 2) Sel menyala di sekitar pointer
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

      for (const [key, v] of glow) {
        const next = animate ? v - 0.02 : v;
        if (next <= 0.02) { glow.delete(key); continue; }
        if (animate) glow.set(key, next);
        const [gx, gy] = key.split(':').map(Number);
        ctx.fillStyle = accent;
        ctx.globalAlpha = Math.min(1, next) * 0.75;
        ctx.fillRect(gx * CELL + 1, gy * CELL + 1, CELL - 2, CELL - 2);
      }
      ctx.globalAlpha = 1;
    };

    const frame = () => { draw(true); raf = requestAnimationFrame(frame); };

    const onMove = (e: PointerEvent) => {
      const rect = cv.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };
    const onLeave = () => { pointer.active = false; };

    resize();
    window.addEventListener('resize', resize);
    cv.parentElement?.addEventListener('pointermove', onMove);
    cv.parentElement?.addEventListener('pointerleave', onLeave);

    if (reduced) draw(false);
    else raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
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
    <section id="home" className="relative bg-gradient-hero overflow-hidden">
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
