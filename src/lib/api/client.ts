import type { AuthResult } from './types';

export const API_BASE: string =
  (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:8090';

type ErrorEnvelope = {
  error?: {
    code?: string;
    message?: string;
    details?: { field: string; message: string }[];
  };
};

export class ApiError extends Error {
  readonly status: number;
  readonly code: string;
  readonly details: { field: string; message: string }[];

  constructor(status: number, code: string, message: string, details: { field: string; message: string }[] = []) {
    super(message);
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

/**
 * Access token hanya di memori: hilang saat reload, dipulihkan lewat refresh.
 * Refresh token sendiri ada di cookie httpOnly (tidak pernah dibaca JavaScript).
 */
let accessToken: string | null = null;

export function setAccessToken(token: string | null): void {
  accessToken = token;
}

export function getAccessToken(): string | null {
  return accessToken;
}

async function rawRequest(path: string, init: RequestInit): Promise<Response> {
  const headers = new Headers(init.headers);
  if (init.body) headers.set('Content-Type', 'application/json');
  if (accessToken) headers.set('Authorization', `Bearer ${accessToken}`);
  return fetch(`${API_BASE}${path}`, { ...init, headers, credentials: 'include' });
}

let inflightRefresh: Promise<boolean> | null = null;

/**
 * Perbarui sesi. Permintaan yang datang bersamaan menunggu promise yang sama
 * supaya rotasi refresh token tidak dipakai dua kali (backend one-time use).
 */
export function refreshSession(): Promise<boolean> {
  if (!inflightRefresh) {
    inflightRefresh = (async () => {
      try {
        const res = await rawRequest('/v1/auth/refresh', { method: 'POST', body: '{}' });
        if (!res.ok) return false;
        const data = (await res.json()) as AuthResult;
        accessToken = data.accessToken;
        return true;
      } catch {
        return false;
      } finally {
        inflightRefresh = null;
      }
    })();
  }
  return inflightRefresh;
}

async function parse<T>(res: Response): Promise<T> {
  if (res.status === 204) return undefined as T;
  const text = await res.text();
  const body = text ? JSON.parse(text) : undefined;
  if (!res.ok) {
    const envelope = (body ?? {}) as ErrorEnvelope;
    throw new ApiError(
      res.status,
      envelope.error?.code ?? 'UNKNOWN',
      envelope.error?.message ?? 'Permintaan gagal.',
      envelope.error?.details ?? [],
    );
  }
  return body as T;
}

async function request<T>(path: string, init: RequestInit, retry = true): Promise<T> {
  const res = await rawRequest(path, init);
  if (res.status === 401 && retry && !path.startsWith('/v1/auth/')) {
    if (await refreshSession()) return request<T>(path, init, false);
  }
  return parse<T>(res);
}

const json = (body: unknown): RequestInit => ({ method: 'POST', body: JSON.stringify(body) });

export const apiGet = <T>(path: string, headers?: HeadersInit) =>
  request<T>(path, { method: 'GET', headers });
export const apiPost = <T>(path: string, body: unknown = {}) => request<T>(path, json(body));
export const apiPatch = <T>(path: string, body: unknown) =>
  request<T>(path, { method: 'PATCH', body: JSON.stringify(body) });
export const apiDelete = (path: string) => request<void>(path, { method: 'DELETE' });
