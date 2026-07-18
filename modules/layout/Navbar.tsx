import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { ThemeToggle } from '../../components/ui/ThemeToggle';

const links = [
  { label: 'Beranda', href: '/#home', id: 'home' },
  { label: 'UI Preview', href: '/#gallery', id: 'gallery' },
  { label: 'Desktop App', href: '/#desktop-app', id: 'desktop-app' },
  { label: 'Semua Fitur', href: '/#features-timeline', id: 'features-timeline' },
];

export const Navbar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, id?: string) => {
    if (id) {
      const element = document.getElementById(id);
      if (element) {
        e.preventDefault();
        element.scrollIntoView({ behavior: 'smooth' });
        window.history.pushState(null, '', `/#${id}`);
      }
    }
    setIsOpen(false);
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/70 dark:bg-zinc-950/70 backdrop-blur-md border-b border-slate-200/80 dark:border-zinc-900/80 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" onClick={(e) => handleNavClick(e, 'home')} className="flex-shrink-0 flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-600 flex items-center justify-center shadow-md shadow-emerald-500/10 transition-transform duration-300 group-hover:scale-105">
              <span className="text-white font-sans font-black text-base">H</span>
            </div>
            <span className="font-sans font-black text-lg tracking-tight text-slate-800 dark:text-zinc-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">HEIMDALL</span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-6">
            {links.map((link) => {
              const isActive = location.pathname === link.href || (link.id && location.hash === `#${link.id}`);
              return (
                <Link
                  key={link.label}
                  to={link.href}
                  onClick={(e) => handleNavClick(e, link.id)}
                  className={`font-sans text-xs font-bold uppercase tracking-wider transition-colors duration-200 ${
                    isActive
                      ? 'text-emerald-600 dark:text-emerald-400 font-extrabold'
                      : 'text-slate-600 dark:text-zinc-400 hover:text-emerald-600 dark:hover:text-emerald-400'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pl-2 border-l border-slate-200 dark:border-zinc-800">
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile menu button & Toggle */}
          <div className="md:hidden flex items-center gap-3">
            <ThemeToggle />
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-lg border border-slate-200 dark:border-zinc-800/80 bg-white/80 dark:bg-zinc-900/80 text-slate-700 dark:text-zinc-300 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all duration-200 focus:outline-none"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden border-b border-slate-200 dark:border-zinc-900 bg-white/95 dark:bg-zinc-950/95 backdrop-blur-md p-4 animate-fade-in">
          <div className="flex flex-col space-y-3">
            {links.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={(e) => handleNavClick(e, link.id)}
                className="font-sans text-sm font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300 hover:text-emerald-600 dark:hover:text-emerald-400 py-1 transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};