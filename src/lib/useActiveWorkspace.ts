import { useEffect, useState } from 'react';
import { listWorkspaces } from './api/workspaces';
import { useApi } from './useApi';
import { useAuth } from './auth/AuthContext';

/**
 * Workspace untuk halaman console: default workspace pertama di organisasi aktif.
 * ponytail: pilihan belum dibagi lintas halaman; angkat ke context bila halaman lain
 * perlu workspace yang sama.
 */
export function useActiveWorkspace() {
  const { activeOrg } = useAuth();
  const { data, loading, error, reload } = useApi(
    () => (activeOrg ? listWorkspaces(activeOrg.id) : Promise.resolve({ workspaces: [] })),
    [activeOrg?.id],
  );
  const workspaces = data?.workspaces ?? [];
  const [workspaceId, setWorkspaceId] = useState<string | null>(null);

  useEffect(() => {
    if (!workspaces.some((w) => w.id === workspaceId)) {
      setWorkspaceId(workspaces[0]?.id ?? null);
    }
  }, [workspaces, workspaceId]);

  const workspace = workspaces.find((w) => w.id === workspaceId) ?? null;

  return { workspaces, workspace, workspaceId, setWorkspaceId, loading, error, reload };
}
