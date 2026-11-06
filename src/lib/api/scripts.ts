import { apiDelete, apiGet, apiPatch, apiPost } from './client';
import type { Folder, Script, ScriptType, ScriptVersion, Visibility } from './types';

export type CreateScriptInput = {
  name: string;
  type?: ScriptType;
  tags?: string[];
  visibility?: Visibility;
  content: string;
  note?: string;
  /** SPEC-26: folder hierarki tujuan ("legacy-app/v1-0/login"). */
  folderPath?: string;
};

export type UpdateScriptInput = {
  name?: string;
  visibility?: Visibility;
  tags?: string[];
};

export type ScriptListParams = {
  search?: string;
  type?: ScriptType;
  visibility?: Visibility;
  /** SPEC-26: filter seluruh subtree folder ini. */
  folderPath?: string;
};

export const listScripts = (workspaceId: string, params: ScriptListParams = {}) => {
  const query = new URLSearchParams();
  if (params.search) query.set('search', params.search);
  if (params.type) query.set('type', params.type);
  if (params.visibility) query.set('visibility', params.visibility);
  if (params.folderPath) query.set('folderPath', params.folderPath);
  const suffix = query.toString();
  return apiGet<{ scripts: Script[] }>(
    `/v1/workspaces/${workspaceId}/scripts${suffix ? `?${suffix}` : ''}`,
  );
};

/** SPEC-26: hierarki folder TMS dari Desktop (flat list; UI menyusun tree). */
export const listFolders = (workspaceId: string) =>
  apiGet<{ folders: Folder[] }>(`/v1/workspaces/${workspaceId}/folders`);

export const createScript = (workspaceId: string, body: CreateScriptInput) =>
  apiPost<{ script: Script; version: ScriptVersion }>(
    `/v1/workspaces/${workspaceId}/scripts`,
    body,
  );

export const getScript = (id: string) =>
  apiGet<{ script: Script; latestVersion: ScriptVersion | null }>(`/v1/scripts/${id}`);

export const addScriptVersion = (id: string, body: { content: string; note?: string }) =>
  apiPost<{ version: ScriptVersion; unchanged?: boolean }>(`/v1/scripts/${id}/versions`, body);

export const listScriptVersions = (id: string) =>
  apiGet<{ versions: ScriptVersion[] }>(`/v1/scripts/${id}/versions`);

export const pullScript = (id: string) =>
  apiPost<{ content: string; versionNo: number; contentHash: string }>(
    `/v1/scripts/${id}/pull`,
  );

export const updateScript = (id: string, body: UpdateScriptInput) =>
  apiPatch<{ script: Script }>(`/v1/scripts/${id}`, body);

export const deleteScript = (id: string) => apiDelete(`/v1/scripts/${id}`);
