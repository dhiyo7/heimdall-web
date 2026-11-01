import { apiPost } from './client';

/** Kirim ulang email verifikasi untuk akun yang sedang login (butuh Bearer token). */
export const requestEmailVerification = () => apiPost<void>('/v1/auth/verify-email/request');

export const confirmEmailVerification = (token: string) =>
  apiPost<void>('/v1/auth/verify-email/confirm', { token });

/** Selalu 204: respons tidak membocorkan apakah email terdaftar. */
export const requestPasswordReset = (email: string) =>
  apiPost<void>('/v1/auth/forgot-password', { email });

export const resetPassword = (token: string, password: string) =>
  apiPost<void>('/v1/auth/reset-password', { token, password });
