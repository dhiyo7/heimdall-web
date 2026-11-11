import React, { useEffect, useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { LanguageToggle } from '../../components/ui/LanguageToggle';
import { useI18n } from '../../i18n/I18nContext';

const links = [
  { key: 'features', href: '/#features', id: 'features' },
  { key: 'pricing', href: '/#pricing', id: 'pricing' },
  { key: 'gallery', href: '/#gallery', id: 'gallery' },
  { key: 'roadmap', href: '/#roadmap', id: 'roadmap' },
  { key: 'docs', href: '/documentation', id: 'docs' },
];

/** Navbar pill kaca mengambang (referensi studio.tayang.app). */
export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const { t } = useI18n();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id?: string) => {
    if (id && id !== 'docs') {
      const element = document.getElementById(id);
      if (element) {
        e.preventDefault();
        element.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', '/#' + id);
      }
    }
    setIsOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 pt-3 md:pt-4 transition-all duration-300">
      <div className="container-constrained">
        <div
          className={`pill-glass rounded-full flex items-center justify-between gap-4 pl-3 pr-2 transition-all duration-300 ${
            scrolled ? 'shadow-md py-2' : 'shadow-sm py-2.5'
          }`}
        >
          {/* Logo */}
          <Link
            to="/"
            onClick={(e) => handleNavClick(e)}
            className="flex items-center gap-2.5 shrink-0"
            aria-label="Heimdall"
          >
            <div className="w-8 h-8 rounded-lg bg-[var(--color-accent)] flex items-center justify-center">
              <span className="text-white font-sans font-bold text-sm">H</span>
            </div>
            <span className="font-sans font-bold text-base tracking-tight text-[var(--color-text-primary)] hidden sm:block">
              HEIMDALL
            </span>
          </Link>

          {/* Desktop menu */}
          <nav className="hidden md:flex items-center gap-1">
            {links.map((link) => {
              if (link.key === 'docs') {
                return (
                  <a
                    key={link.key}
                    href={link.href}
                    className="px-3 py-2 rounded-full font-sans text-[13px] font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] transition-colors"
                  >
                    {t('nav.' + link.key)}
                  </a>
                );
              }
              const isActive =
                location.pathname === '/' && link.id ? location.hash === '#' + link.id : false;
              return (
                <a
                  key={link.key}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={
                    'px-3 py-2 rounded-full font-sans text-[13px] font-medium transition-colors ' +
                    (isActive
                      ? 'text-[var(--color-text-primary)] bg-[var(--color-surface)]'
                      : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)]')
                  }
                >
                  {t('nav.' + link.key)}
                </a>
              );
            })}
          </nav>

          {/* Kanan: toggle + CTA */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div className="hidden md:flex items-center gap-2">
              <LanguageToggle />
              <ThemeToggle />
            </div>
            <a
              href="/#pricing"
              onClick={(e) => handleNavClick(e, 'pricing')}
              className="hidden sm:inline-flex items-center rounded-full bg-[var(--color-accent)] px-4 py-2 font-sans text-[13px] font-bold text-white hover:opacity-90 transition-opacity"
            >
              {t('common.get_started')}
            </a>
            <button
              onClick={() => setIsOpen(!isOpen)}
              aria-expanded={isOpen}
              aria-label="Menu"
              className="md:hidden p-2 rounded-full text-[var(--color-text-muted)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-surface)] transition-colors"
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile sheet */}
        {isOpen && (
          <div className="md:hidden mt-2 pill-glass rounded-2xl p-4 shadow-lg">
            <div className="flex flex-col">
              {links.map((link) => (
                <a
                  key={link.key}
                  href={link.href}
                  onClick={(e) => handleNavClick(e, link.id)}
                  className="font-sans text-sm font-medium text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] py-2.5 px-1 border-b border-[var(--color-border)] last:border-0"
                >
                  {t('nav.' + link.key)}
                </a>
              ))}
              <div className="flex items-center justify-between pt-3">
                <div className="flex items-center gap-2">
                  <LanguageToggle />
                  <ThemeToggle />
                </div>
                <a
                  href="/#pricing"
                  onClick={(e) => handleNavClick(e, 'pricing')}
                  className="inline-flex items-center rounded-full bg-[var(--color-accent)] px-4 py-2 font-sans text-xs font-bold text-white"
                >
                  {t('common.get_started')}
                </a>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
