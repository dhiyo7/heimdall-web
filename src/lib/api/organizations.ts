import { apiDelete, apiGet, apiPatch, apiPost } from './client';
import type { Organization } from './types';

export const listOrganizations = () => apiGet<{ organizations: Organization[] }>('/v1/organizations');

export const createOrganization = (body: { name: string; slug?: string }) =>
  apiPost<Organization>('/v1/organizations', body);

export const updateOrganization = (id: string, body: { name?: string; slug?: string }) =>
  apiPatch<{ organization: Organization }>(`/v1/organizations/${id}`, body);

export const deleteOrganization = (id: string) => apiDelete(`/v1/organizations/${id}`);
