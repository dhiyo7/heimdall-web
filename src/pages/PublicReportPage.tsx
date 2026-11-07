import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Download } from 'lucide-react';
import { Button } from '../components/ui/Button';
import { RunStatusBadge, formatDuration } from '../components/ui/RunStatusBadge';
import { WindowCard } from '../components/ui/WindowCard';
import { ApiError } from '../lib/api/client';
import { getPublicReport } from '../lib/api/reports';
import type { Artifact } from '../lib/api/types';
import { useApi } from '../lib/useApi';

const LABEL =
  'mb-1 block font-mono text-[10px] font-semibold uppercase tracking-wider text-[var(--color-text-muted)]';

const PublicReportPage: React.FC = () => {
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const { data, loading, error, reload } = useApi(
    () =>
      token
        ? getPublicReport(token, password || undefined)
        : Promise.reject(new ApiError(404, 'NOT_FOUND', 'Tautan tidak ditemukan.')),
    [token, password],
  );

  if (loading) {
    return (
      <div className="mx-auto w-full max-w-3xl px-4 py-16">
        <p className="font-mono text-sm text-[var(--color-text-muted)]">memuat laporan…</p>
      </div>
    );
  }

  if (error) {
    const needsPassword = error.status === 401 && error.code === 'REPORT_PASSWORD_REQUIRED';
    const notFound = error.status === 404;
    const expired = error.status === 410;

    if (needsPassword) {
      return (
        <div className="mx-auto w-full max-w-xl px-4 py-16">
          <WindowCard title="laporan publik">
            <h1 className="font-sans text-xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
              Laporan dilindungi password
            </h1>
            <p className="mt-2 font-sans text-sm text-[var(--color-text-secondary)]">
              Masukkan password yang diberikan pemilik laporan untuk membukanya.
            </p>
            <form
              className="mt-5 flex flex-col gap-3"
              onSubmit={(e) => {
                e.preventDefault();
                setSubmitted(true);
                reload();
              }}
            >
              <label className="block">
                <span className={LABEL}>Password</span>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setSubmitted(false);
                  }}
                  autoFocus
                  className="h-10 w-full rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 font-sans text-sm text-[var(--color-text-primary)] focus:border-[var(--color-primary)] focus:outline-none"
                />
              </label>
              {submitted && password && (
                <p role="alert" className="font-sans text-sm text-[var(--color-danger)]">
                  Password salah, coba lagi.
                </p>
              )}
              <div className="flex flex-wrap gap-2">
                <Button type="submit" variant="primary" size="sm" disabled={!password}>
                  Buka laporan
                </Button>
                <Link to="/">
                  <Button type="button" variant="secondary" size="sm">
                    Ke beranda
                  </Button>
                </Link>
              </div>
            </form>
          </WindowCard>
        </div>
      );
    }

    return (
      <div className="mx-auto w-full max-w-xl px-4 py-16">
        <WindowCard title="laporan publik">
          <h1 className="font-sans text-xl font-extrabold tracking-tight text-[var(--color-text-primary)]">
            {expired
              ? 'Tautan sudah kedaluwarsa'
              : notFound
                ? 'Tautan tidak ditemukan'
                : 'Gagal memuat laporan'}
          </h1>
          <p className="mt-2 font-sans text-sm text-[var(--color-text-secondary)]">
            {expired
              ? 'Masa berlaku tautan laporan ini sudah habis. Minta pemilik laporan mempublikasikan ulang.'
              : notFound
                ? 'Periksa kembali tautan yang Anda terima. Tautan mungkin salah salin atau sudah ditarik.'
                : error.message}
          </p>
          <div className="mt-5 flex flex-wrap gap-2">
            {!notFound && !expired && (
              <Button variant="primary" size="sm" onClick={reload}>
                Coba lagi
              </Button>
            )}
            <Link to="/">
              <Button variant="secondary" size="sm">
                Ke beranda
              </Button>
            </Link>
          </div>
        </WindowCard>
      </div>
    );
  }

  if (!data) return null;

  const { report, run, artifacts } = data;
  const images = artifacts.filter((a) => a.mime.startsWith('image/'));
  const files = artifacts.filter((a) => !a.mime.startsWith('image/'));
  const total =
    run.passCount != null && run.failCount != null ? run.passCount + run.failCount : null;
  const date = run.finishedAt ?? run.startedAt;

  const stats: { label: string; value: string }[] = [
    { label: 'Total', value: total != null ? String(total) : '—' },
    { label: 'Lulus', value: run.passCount != null ? String(run.passCount) : '—' },
    { label: 'Gagal', value: run.failCount != null ? String(run.failCount) : '—' },
    { label: 'Durasi', value: formatDuration(run.durationMs) },
  ];

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <WindowCard title={`laporan · ${run.runRef}`} date="PUBLIK">
        <p className="font-mono text-[10px] font-semibold uppercase tracking-widest text-[var(--color-text-muted)]">
          Laporan pengujian
        </p>
        <h1 className="mt-1 font-sans text-xl font-extrabold tracking-tight text-[var(--color-text-primary)] sm:text-2xl">
          {run.runRef}
        </h1>

        <dl className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <dt className={LABEL}>Tanggal</dt>
            <dd className="font-mono text-xs text-[var(--color-text-primary)]">
              {date ? new Date(date).toLocaleString('id-ID') : '—'}
            </dd>
          </div>
          <div>
            <dt className={LABEL}>Perangkat</dt>
            <dd className="font-sans text-sm text-[var(--color-text-primary)]">
              {run.deviceLabel ?? '—'}
            </dd>
          </div>
          <div>
            <dt className={LABEL}>Eksekutor</dt>
            <dd className="font-sans text-sm text-[var(--color-text-primary)]">
              {report.createdBy ?? '—'}
            </dd>
          </div>
          <div>
            <dt className={LABEL}>Status</dt>
            <dd>
              <RunStatusBadge status={run.status} />
            </dd>
          </div>
        </dl>

        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-3"
            >
              <p className="font-mono text-[10px] uppercase tracking-wider text-[var(--color-text-muted)]">
                {s.label}
              </p>
              <p className="mt-1 font-mono text-lg font-semibold text-[var(--color-text-primary)]">
                {s.value}
              </p>
            </div>
          ))}
        </div>
      </WindowCard>

      <WindowCard title="Artefak" className="mt-4">
        {artifacts.length === 0 ? (
          <p className="font-sans text-sm text-[var(--color-text-secondary)]">
            Tidak ada artefak yang dilampirkan pada laporan ini.
          </p>
        ) : (
          <>
            {images.length > 0 && (
              <div className="grid gap-3 sm:grid-cols-2">
                {images.map((a, i) => (
                  <a
                    key={a.id}
                    href={a.url}
                    target="_blank"
                    rel="noreferrer"
                    className="overflow-hidden rounded-md border border-[var(--color-border)] bg-[var(--color-surface)]"
                  >
                    <img
                      src={a.url}
                      alt={`Artefak ${i + 1}`}
                      loading="lazy"
                      className="w-full object-cover"
                    />
                  </a>
                ))}
              </div>
            )}

            {files.length > 0 && (
              <ul className={`space-y-2 ${images.length > 0 ? 'mt-4' : ''}`}>
                {files.map((a) => (
                  <li key={a.id}>
                    <ArtifactLink artifact={a} />
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </WindowCard>
    </div>
  );
};

const ArtifactLink: React.FC<{ artifact: Artifact }> = ({ artifact }) => (
  <a
    href={artifact.url}
    download
    className="flex items-center justify-between gap-3 rounded-md border border-[var(--color-border)] bg-[var(--color-surface)] px-3 py-2 hover:border-[var(--color-primary)]"
  >
    <span className="min-w-0">
      <span className="block truncate font-sans text-sm text-[var(--color-text-primary)]">
        {artifact.type}
      </span>
      <span className="block font-mono text-[10px] text-[var(--color-text-muted)]">
        {artifact.mime}
      </span>
    </span>
    <Download size={16} className="shrink-0 text-[var(--color-text-muted)]" aria-hidden="true" />
  </a>
);

export default PublicReportPage;
