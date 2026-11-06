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

/** Ringkasan workspace dari `GET /v1/workspaces/:id/summary` (dipakai dashboard & tab). */
export type WorkspaceSummary = {
  memberCount: number;
  scriptCount: number;
  runCount: number;
  storageUsedBytes: number;
  storageLimitBytes: number;
  totals: {
    totalRuns: number;
    passCount: number;
    failCount: number;
    passRate: number;
  };
};

/** `implicit` = OWNER/ADMIN organisasi (akses otomatis ke semua workspace, tidak bisa dilepas). */
export type WorkspaceMember = {
  userId: string;
  email: string;
  fullName: string | null;
  role: Role;
  implicit: boolean;
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

/** SPEC-26/30: folder hierarki TMS (platform → application → version → module) dari Desktop. */
export type Folder = {
  id: string;
  workspaceId: string;
  parentId: string | null;
  level: 'platform' | 'application' | 'version' | 'module';
  name: string;
  slug: string;
  /** Slug gabungan root→leaf, mis. "legacy-app/v1-0/login". */
  path: string;
};

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
  /** Folder induk (null = root workspace). Dikirim oleh backend daftar/detail. */
  folderId?: string | null;
  /** Path folder dari server (daftar script dengan filter folderPath). */
  folderPath?: string | null;
  /** Ukuran versi terbaru (byte) bila backend menyertakannya. */
  sizeBytes?: number | null;
  createdAt: string;
  updatedAt: string;
};

export type ScriptVersion = {
  id: string;
  versionNo: number;
  contentHash: string;
  /** Ukuran konten (byte) bila backend menyertakannya. */
  sizeBytes?: number | null;
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
