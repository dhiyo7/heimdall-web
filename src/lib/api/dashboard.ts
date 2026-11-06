import { apiGet } from './client';

export type DashboardRecentRun = {
  id: string;
  runRef: string;
  status: string;
  totalTests: number;
  passed: number;
  failed: number;
  durationMs: number | null;
  device: string | null;
  createdAt: string;
};

export type DashboardData = {
  totals: {
    runs: number;
    passed: number;
    failed: number;
    avgDurationMs: number;
    scripts: number;
    artifacts: number;
  };
  last7Days: { date: string; runs: number; passed: number; failed: number }[];
  recentRuns: DashboardRecentRun[];
};

export const getDashboard = (workspaceId: string) =>
  apiGet<DashboardData>(`/v1/workspaces/${workspaceId}/dashboard`);
