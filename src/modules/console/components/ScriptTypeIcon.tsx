import React from 'react';
import { FileCode2, Server } from 'lucide-react';
import type { ScriptType } from '../../../lib/api/types';

/** Ikon per tipe script dari `Script.type` (backend memakai string bebas). */
export const ScriptTypeIcon: React.FC<{ type: ScriptType | string; className?: string }> = ({
  type,
  className = 'h-5 w-5',
}) => {
  const Icon = type === 'api' ? Server : FileCode2;
  return <Icon className={className} aria-hidden="true" />;
};

export const scriptTypeLabel = (type: ScriptType | string): string =>
  type === 'api' ? 'API' : type === 'ui' ? 'UI' : type;
