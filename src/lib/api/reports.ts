import { apiDelete, apiGet, apiPost } from './client';
import type { Artifact, CloudReport, CloudRun, ReportListItem, Visibility } from './types';

export type CreateRunInput = {
  workspaceId: string;
  projectId?: string;
  runRef: string;
  status: string;
  passCount?: number;
  failCount?: number;
  durationMs?: number;
  deviceLabel?: string;
  startedAt?: string;
  finishedAt?: string;
};

export type PublishReportInput = {
  visibility?: Visibility;
  expiresInDays?: number;
  artifactIds?: string[];
};

export type ReportDetail = {
  report: CloudReport;
  run: CloudRun;
  artifacts: Artifact[];
};

export const createRun = (body: CreateRunInput) => apiPost<{ run: CloudRun }>('/v1/runs', body);

export const listRuns = (workspaceId: string) =>
  apiGet<{ runs: CloudRun[] }>(`/v1/workspaces/${workspaceId}/runs`);

export const listReports = (workspaceId: string) =>
  apiGet<{ items: ReportListItem[] }>(`/v1/workspaces/${workspaceId}/reports`);

export const publishReport = (runId: string, body: PublishReportInput = {}) =>
  apiPost<{ report: CloudReport; token: string; shareUrl: string; expiresAt: string | null }>(
    `/v1/reports/${runId}/publish`,
    body,
  );

export const unpublishReport = (id: string) => apiDelete(`/v1/reports/${id}/unpublish`);

export const getReport = (id: string) => apiGet<ReportDetail>(`/v1/reports/${id}`);

/** Endpoint publik; aman dipanggil tanpa sesi walau klien mengirim token bila ada. */
export const getPublicReport = (token: string) =>
  apiGet<ReportDetail>(`/v1/public/reports/${encodeURIComponent(token)}`);
