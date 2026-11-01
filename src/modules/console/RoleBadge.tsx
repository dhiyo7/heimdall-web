import React from 'react';
import type { Role } from '../../lib/api/types';

const STYLE: Record<Role, { label: string; className: string }> = {
  OWNER: { label: 'Pemilik', className: 'text-[var(--color-primary)] border-[var(--color-primary)]/40 bg-[var(--color-primary)]/10' },
  ADMIN: { label: 'Admin', className: 'text-[var(--color-warning)] border-[var(--color-warning)]/40 bg-[var(--color-warning)]/10' },
  MEMBER: { label: 'QA', className: 'text-[var(--color-secondary)] border-[var(--color-secondary)]/40 bg-[var(--color-secondary)]/10' },
};

/** Teks selalu ikut, bukan hanya warna — supaya tetap terbaca tanpa penglihatan warna. */
export const RoleBadge: React.FC<{ role: Role }> = ({ role }) => (
  <span
    className={`inline-flex items-center rounded-md border px-2 py-0.5 font-mono text-[10px] font-semibold uppercase tracking-wider ${STYLE[role].className}`}
  >
    {STYLE[role].label}
  </span>
);
