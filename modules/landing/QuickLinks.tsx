import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const quickLinks = [
  { label: 'Dokumentasi', href: '#docs' },
  { label: 'Tech Stack', href: '#features' },
  { label: 'Roadmap', href: '#roadmap' },
  { label: 'Kontak', href: 'https://github.com/dhiyo7/heimdall' },
];

export const QuickLinks: React.FC = () => {
  return (
    <div className="border-b border-slate-200/80 dark:border-zinc-900/80 bg-white dark:bg-zinc-950 transition-colors duration-300">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-slate-100 dark:divide-zinc-900">
          {quickLinks.map((link) => (
            <a 
              key={link.label}
              href={link.href}
              className="group flex items-center justify-between p-4 md:p-6 hover:bg-slate-50 dark:hover:bg-zinc-900/50 transition-colors cursor-pointer border-b md:border-b-0 border-slate-100 dark:border-zinc-900 last:border-b-0"
            >
              <span className="font-sans text-xs tracking-wider font-bold uppercase text-slate-700 dark:text-zinc-350">{link.label}</span>
              <ArrowUpRight size={16} className="text-slate-400 dark:text-zinc-500 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};