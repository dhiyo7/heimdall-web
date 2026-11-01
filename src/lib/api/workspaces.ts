import { apiDelete, apiGet, apiPatch, apiPost } from './client';
import type { Workspace } from './types';

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
