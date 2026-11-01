import { apiDelete, apiGet, apiPost } from './client';
import type { Device } from './types';

export const listDevices = () => apiGet<{ devices: Device[] }>('/v1/devices');

export const revokeDevice = (id: string) => apiDelete(`/v1/devices/${id}`);

export const approveDevice = (userCode: string, orgId: string) =>
  apiPost<void>('/v1/devices/approve', { userCode, orgId });

export const denyDevice = (userCode: string) => apiPost<void>('/v1/devices/deny', { userCode });
