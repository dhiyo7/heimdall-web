import { afterEach, describe, expect, it, vi } from 'vitest';

type Call = { url: string; init: RequestInit };

/** Mock fetch berbasis skrip respons berurutan. */
function mockFetch(responses: ((call: Call) => Response)[]) {
  const calls: Call[] = [];
  const fn = vi.fn(async (url: string, init: RequestInit = {}) => {
    const call = { url, init };
    calls.push(call);
    const next = responses.shift();
    if (!next) throw new Error(`fetch tak terduga: ${url}`);
    return next(call);
  });
  vi.stubGlobal('fetch', fn);
  return calls;
}

const json = (status: number, body: unknown) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  });

afterEach(() => {
  vi.unstubAllGlobals();
  vi.resetModules();
});

describe('api client — pemulihan sesi', () => {
  it('401 → refresh sekali → ulangi permintaan', async () => {
    const calls = mockFetch([
      () => json(401, { error: { code: 'UNAUTHORIZED', message: 'sesi habis' } }),
      () => json(200, { accessToken: 'access-baru', refreshToken: 'r', user: {} }),
      () => json(200, { members: [] }),
    ]);

    const { apiGet } = await import('./client');
    const result = await apiGet<{ members: unknown[] }>('/v1/organizations/o-1/members');

    expect(result).toEqual({ members: [] });
    expect(calls.map((c) => c.url)).toEqual([
      expect.stringContaining('/v1/organizations/o-1/members'),
      expect.stringContaining('/v1/auth/refresh'),
      expect.stringContaining('/v1/organizations/o-1/members'),
    ]);
    // Permintaan ulang membawa access token hasil refresh.
    const headers = new Headers(calls[2].init.headers);
    expect(headers.get('Authorization')).toBe('Bearer access-baru');
  });

  it('dua permintaan bersamaan hanya memicu satu refresh', async () => {
    const calls = mockFetch([
      () => json(401, { error: { code: 'UNAUTHORIZED', message: 'sesi habis' } }),
      () => json(401, { error: { code: 'UNAUTHORIZED', message: 'sesi habis' } }),
      () => json(200, { accessToken: 'access-baru', refreshToken: 'r', user: {} }),
      () => json(200, { workspaces: [] }),
      () => json(200, { devices: [] }),
    ]);

    const { apiGet } = await import('./client');
    await Promise.all([apiGet('/v1/workspaces'), apiGet('/v1/devices')]);

    const refreshCalls = calls.filter((c) => c.url.includes('/v1/auth/refresh'));
    expect(refreshCalls).toHaveLength(1);
  });

  it('refresh gagal → error 401 diteruskan tanpa loop', async () => {
    const calls = mockFetch([
      () => json(401, { error: { code: 'UNAUTHORIZED', message: 'sesi habis' } }),
      () => json(401, { error: { code: 'UNAUTHORIZED', message: 'refresh tidak valid' } }),
    ]);

    const { apiGet, ApiError } = await import('./client');
    await expect(apiGet('/v1/devices')).rejects.toBeInstanceOf(ApiError);
    expect(calls).toHaveLength(2);
  });
});
