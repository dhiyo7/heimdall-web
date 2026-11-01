import { apiDelete, apiGet, apiPatch, apiPost } from './client';
import type { CreatedInvitation, Invitation, Member, Organization, Role } from './types';

export const listMembers = (orgId: string) =>
  apiGet<{ members: Member[] }>(`/v1/organizations/${orgId}/members`);

export const updateMemberRole = (orgId: string, userId: string, role: Role) =>
  apiPatch<{ member: Member }>(`/v1/organizations/${orgId}/members/${userId}`, { role });

export const removeMember = (orgId: string, userId: string) =>
  apiDelete(`/v1/organizations/${orgId}/members/${userId}`);

export const listInvitations = (orgId: string) =>
  apiGet<{ invitations: Invitation[] }>(`/v1/organizations/${orgId}/invitations`);

export const createInvitation = (orgId: string, body: { email: string; role?: Role }) =>
  apiPost<{ invitation: CreatedInvitation }>(`/v1/organizations/${orgId}/invitations`, body);

export const cancelInvitation = (orgId: string, id: string) =>
  apiDelete(`/v1/organizations/${orgId}/invitations/${id}`);

export const acceptInvitation = (token: string) =>
  apiPost<{ organization: Pick<Organization, 'id' | 'name' | 'slug'>; role: Role }>(
    '/v1/organizations/invitations/accept',
    { token },
  );
