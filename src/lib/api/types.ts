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

export type ScriptType = 'ui' | 'api';

export type Visibility = 'private' | 'workspace' | 'link';

export type Script = {
  id: string;
  workspaceId: string;
  name: string;
  slug: string;
  type: ScriptType;
  tags: string[];
  visibility: Visibility;
  ownerUserId: string;
  latestVersionId: string | null;
  latestVersionNo?: number;
  createdAt: string;
  updatedAt: string;
};

export type ScriptVersion = {
  id: string;
  versionNo: number;
  contentHash: string;
  note: string | null;
  authorUserId: string;
  createdAt: string;
};

export type CloudRun = {
  id: string;
  runRef: string;
  /** Backend bebas menambah status baru; UI memetakan yang dikenal dan memakai nilai mentah lainnya. */
  status: string;
  passCount: number | null;
  failCount: number | null;
  durationMs: number | null;
  deviceLabel: string | null;
  startedAt: string | null;
  finishedAt: string | null;
};

export type CloudReportSummary = {
  id: string;
  isPublished: boolean;
  shareToken: string | null;
  publishedAt: string | null;
  expiresAt: string | null;
};

/** Baris daftar report per workspace, termasuk status publikasi dari server. */
export type ReportListItem = {
  id: string;
  runRef: string;
  status: string;
  totalTests: number;
  passed: number;
  failed: number;
  durationMs: number | null;
  device: string | null;
  createdAt: string;
  report: CloudReportSummary | null;
};

export type CloudReport = {
  id: string;
  runId: string;
  visibility: Visibility;
  expiresAt: string | null;
  createdAt: string;
  createdBy?: string | null;
};

export type Artifact = {
  id: string;
  type: string;
  mime: string;
  url: string;
};
