export type Role = 'OWNER' | 'ADMIN' | 'MEMBER';

export type User = {
  id: string;
  email: string;
  fullName: string | null;
  /** Hanya dikirim backend bila status verifikasi tersedia. */
  emailVerified?: boolean;
};

/** `role` = peran user di organisasi tersebut. */
export type Organization = {
  id: string;
  name: string;
  slug: string;
  createdAt: string;
  role: Role;
};

export type Workspace = {
  id: string;
  orgId: string;
  name: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
};

export type Member = {
  id: string;
  userId: string;
  email: string;
  fullName: string | null;
  role: Role;
  joinedAt: string;
};

export type Invitation = {
  id: string;
  email: string;
  role: Role;
  expiresAt: string;
  createdAt?: string;
};

export type CreatedInvitation = Invitation & { acceptUrl: string };

export type Device = {
  id: string;
  name: string;
  os: string | null;
  orgId: string;
  orgName: string;
  userId: string;
  createdAt: string;
  lastSeenAt: string;
};

export type AuthResult = {
  user: User;
  accessToken: string;
  refreshToken: string;
};
