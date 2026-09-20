import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from '../../components/ui/ThemeToggle';
import { LanguageToggle } from '../../components/ui/LanguageToggle';
import { useI18n } from '../../i18n/I18nContext';

const links = [
  { key: 'home', href: '/', id: 'home' },
  { key: 'features', href: '/#features', id: 'features' },
  { key: 'pricing', href: '/#pricing', id: 'pricing' },
  { key: 'gallery', href: '/#gallery', id: 'gallery' },
  { key: 'roadmap', href: '/#roadmap', id: 'roadmap' },
  { key: 'docs', href: '/documentation', id: 'docs' },
];

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { t } = useI18n();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id?: string) => {
    if (id) {
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
    <header className="sticky top-0 z-50 bg-[var(--color-background)] border-b border-[var(--color-border)] transition-all duration-300" style={{ height: '72px' }}>
      <div className="container-constrained h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" onClick={(e) => handleNavClick(e, 'home')} className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-md bg-[var(--color-accent)] flex items-center justify-center">
            <span className="text-white font-sans font-bold text-sm">H</span>
          </div>
          <span className="font-sans font-bold text-lg tracking-tight text-[var(--color-text-secondary)]">HEIMDALL</span>
        </Link>

        {/* Desktop Menu */}
        <nav className="hidden md:flex items-center gap-8">
          {links.map((link) => {
            if (link.href === '/documentation') {
              return (
                <a
                  key={link.key}
                  href="/documentation"
                  className="font-sans text-sm font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-colors duration-200"
                >
                  {t('nav.' + link.key)}
                </a>
              );
            }
            const isActive = location.pathname === '/' && link.id ? location.hash === '#' + link.id : false;
            return (
              <a
                key={link.key}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.id)}
                className={
                  'font-sans text-sm font-medium transition-colors duration-200 ' +
                  (isActive
                    ? 'text-[var(--color-text-secondary)]'
                    : 'text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]')
                }
              >
                {t('nav.' + link.key)}
              </a>
            );
          })}
        </nav>

        <div className="hidden md:flex items-center gap-4">
          <LanguageToggle />
          <ThemeToggle />
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center gap-3">
          <LanguageToggle />
          <ThemeToggle />
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] transition-all duration-200 focus:outline-none"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-t border-[var(--color-border)] bg-[var(--color-surface)] p-4 animate-fade-in max-h-[calc(100vh-72px)] overflow-y-auto">
          <div className="flex flex-col space-y-3">
            {links.map((link) => (
              <a
                key={link.key}
                href={link.href}
                onClick={(e) => handleNavClick(e, link.id)}
                className="font-sans text-base font-medium text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)] py-2 transition-all"
              >
                {t('nav.' + link.key)}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};