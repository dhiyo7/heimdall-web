import React from 'react';
import { WindowCard } from '../../../components/ui/WindowCard';

type Props = {
  title: string;
  description: string;
};

/** Placeholder untuk fitur console yang belum tersedia. */
const ComingSoonPage: React.FC<Props> = ({ title, description }) => (
  <>
    <header className="mb-4 flex items-center gap-2">
      <h1 className="font-sans text-xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
        {title}
      </h1>
      <span className="rounded border border-[var(--color-border)] px-1.5 py-0.5 font-mono text-[10px] leading-none text-[var(--color-text-muted)]">
        Segera
      </span>
    </header>

    <WindowCard title={title}>
      <p className="max-w-prose font-sans text-sm text-[var(--color-text-secondary)]">
        {description}
      </p>
    </WindowCard>
  </>
);

export default ComingSoonPage;
