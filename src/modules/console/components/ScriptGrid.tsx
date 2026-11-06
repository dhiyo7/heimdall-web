import React from 'react';
import type { Script } from '../../../lib/api/types';
import { ScriptCard } from './ScriptCard';
import type { SyncState } from './SyncBadge';

type Props = {
  scripts: Script[];
  syncStateOf: (script: Script) => SyncState;
  onOpen: (script: Script) => void;
  onContextMenu: (script: Script, position: { x: number; y: number }) => void;
};

/** SPEC-32 NFR-1: grid 2 → 4 kolom. */
export const ScriptGrid: React.FC<Props> = ({ scripts, syncStateOf, onOpen, onContextMenu }) => (
  <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-4">
    {scripts.map((s) => (
      <ScriptCard
        key={s.id}
        script={s}
        syncState={syncStateOf(s)}
        onOpen={onOpen}
        onContextMenu={onContextMenu}
      />
    ))}
  </div>
);
