import { apiDelete, apiGet, apiPatch, apiPost } from './client';
import type { Role, Workspace, WorkspaceMember, WorkspaceSummary } from './types';

export const listWorkspaces = (orgId?: string) =>
  apiGet<{ workspaces: Workspace[] }>(
    orgId ? `/v1/workspaces?orgId=${encodeURIComponent(orgId)}` : '/v1/workspaces',
  );

export const createWorkspace = (body: { orgId: string; name: string; slug?: string }) =>
  apiPost<Workspace>('/v1/workspaces', body);

export const getWorkspace = (id: string) =>
  apiGet<{ workspace: Workspace }>(`/v1/workspaces/${id}`);

export const updateWorkspace = (id: string, body: { name?: string; slug?: string }) =>
  apiPatch<{ workspace: Workspace }>(`/v1/workspaces/${id}`, body);

export const deleteWorkspace = (id: string) => apiDelete(`/v1/workspaces/${id}`);

export const getWorkspaceSummary = (id: string) =>
  apiGet<WorkspaceSummary>(`/v1/workspaces/${id}/summary`);

export const listWorkspaceMembers = (workspaceId: string) =>
  apiGet<{ members: WorkspaceMember[] }>(`/v1/workspaces/${workspaceId}/members`);

export const addWorkspaceMember = (workspaceId: string, userId: string) =>
  apiPost<{ workspaceId: string; userId: string; role: Role }>(
    `/v1/workspaces/${workspaceId}/members`,
    { userId },
  );

export const removeWorkspaceMember = (workspaceId: string, userId: string) =>
  apiDelete(`/v1/workspaces/${workspaceId}/members/${userId}`);
