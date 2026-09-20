import React from 'react';
import { ArrowUpRight } from 'lucide-react';

const quickLinks = [
  { label: 'Docs', href: '#docs' },
  { label: 'Tech Stack', href: '#features' },
  { label: 'Roadmap', href: '#roadmap' },
  { label: 'GitHub', href: 'https://github.com/dhiyo7/heimdall' },
];

export const QuickLinks: React.FC = () => {
  return (
    <div className="border-b border-[var(--color-border)] bg-[var(--color-background)] transition-colors duration-300">
      <div className="container-constrained">
        <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-[var(--color-border)]">
          {quickLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="group flex items-center justify-between p-4 md:p-6 hover:bg-[var(--color-surface)] transition-colors cursor-pointer border-b md:border-b-0 border-[var(--color-border)] last:border-b-0"
            >
              <span className="text-xs tracking-wide font-medium text-[var(--color-text-secondary)]">{link.label}</span>
              <ArrowUpRight size={16} className="text-[var(--color-text-muted)] group-hover:text-[var(--color-primary)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};