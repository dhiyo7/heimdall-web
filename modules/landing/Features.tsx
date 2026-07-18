import React from 'react';
import { WindowCard } from '../../components/ui/WindowCard';

export const Features: React.FC = () => {
  return (
    <section id="desktop-app" className="py-16 md:py-24 bg-white dark:bg-zinc-950 scroll-mt-20 transition-colors duration-300 border-b border-slate-200/80 dark:border-zinc-900/80">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1 mb-6 rounded-full border border-amber-200 dark:border-amber-900/60 bg-amber-50 dark:bg-amber-900/20 text-amber-600 dark:text-amber-400 font-sans text-xs font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse"></span>
            Fase Beta Tertutup
          </div>
          <h2 className="font-sans font-black text-3xl md:text-5xl tracking-tight text-slate-900 dark:text-white">Heimdall Desktop <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">Segera Hadir</span></h2>
          <p className="mt-6 text-slate-500 dark:text-zinc-400 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Tidak perlu lagi repot mengatur environment dan server secara manual. Kami sedang merampungkan Heimdall Desktop Native agar Anda bisa menikmati pengalaman automasi QA tingkat tinggi langsung di perangkat Anda.
          </p>
        </div>

        <WindowCard title="heimdall_desktop.exe" date="BETA" className="transform hover:-translate-y-1 transition-transform duration-300 shadow-2xl">
          <div className="p-8 text-center space-y-8">
            <div className="flex justify-center flex-wrap gap-8 md:gap-16">
              {/* Apple / Mac */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-zinc-800/80 flex items-center justify-center text-slate-700 dark:text-zinc-300 shadow-sm border border-slate-200/50 dark:border-zinc-700/50">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91 1.63.16 3.03.8 3.9 2.05-3.19 1.83-2.65 6.27.65 7.64-.7 1.76-1.56 3.49-2.76 5.25v-.01zM11.96 6.36C11.83 3.62 14.19 1.25 16.81 1c.21 2.87-2.43 5.46-4.85 5.36z"/>
                  </svg>
                </div>
                <span className="font-sans font-bold text-sm text-slate-600 dark:text-zinc-400">macOS</span>
              </div>
              {/* Windows */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-zinc-800/80 flex items-center justify-center text-slate-700 dark:text-zinc-300 shadow-sm border border-slate-200/50 dark:border-zinc-700/50">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M2.5 19.5l9-1.2v-7.8H2.5v9zm9-18L2.5 3.1v7.8h9V1.5zm1.5 9.5v8.3l10.5 1.5v-9.8H13zm0-10.7v8.5h10.5V.2L13 1.5z"/>
                  </svg>
                </div>
                <span className="font-sans font-bold text-sm text-slate-600 dark:text-zinc-400">Windows</span>
              </div>
              {/* Linux */}
              <div className="flex flex-col items-center gap-3">
                <div className="w-16 h-16 rounded-2xl bg-slate-100 dark:bg-zinc-800/80 flex items-center justify-center text-slate-700 dark:text-zinc-300 shadow-sm border border-slate-200/50 dark:border-zinc-700/50">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21.2 16.5c.3-1 .5-2 .5-3.1 0-5-3.7-9.3-8.6-9.8v3.4c2.8.5 5 2.9 5 5.9 0 3.3-2.7 6-6 6s-6-2.7-6-6c0-3 2.2-5.4 5-5.9V3.6C6.2 4.1 2.5 8.4 2.5 13.4c0 1.1.2 2.1.5 3.1L1.1 18.2c-.4.5-.2 1.3.4 1.5l3.8 1.4c1.1 1.8 2.8 3.2 4.9 3.9v-3.2c-1.3-.5-2.4-1.4-3.1-2.6l-1.9.7 1.5-2-.3-.5c-.3-.8-.5-1.7-.5-2.6 0-3.3 2.7-6 6-6s6 2.7 6 6c0 .9-.2 1.8-.5 2.6l-.3.5 1.5 2-1.9-.7c-.7 1.2-1.8 2.1-3.1 2.6v3.2c2.1-.7 3.8-2.1 4.9-3.9l3.8-1.4c.6-.2.8-1 .4-1.5l-1.9-1.7z"/>
                    <circle cx="12" cy="13.4" r="2.5"/>
                  </svg>
                </div>
                <span className="font-sans font-bold text-sm text-slate-600 dark:text-zinc-400">Ubuntu / Linux</span>
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-emerald-50/70 dark:bg-emerald-900/20 border border-emerald-100/80 dark:border-emerald-800/40 mt-4 text-left">
              <div className="flex gap-4 items-start">
                <div className="mt-1 flex-shrink-0">
                  <div className="w-8 h-8 rounded-full bg-emerald-200/50 dark:bg-emerald-800/50 flex items-center justify-center text-emerald-600 dark:text-emerald-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                  </div>
                </div>
                <p className="font-sans text-slate-700 dark:text-zinc-300 text-sm md:text-base leading-relaxed">
                  <strong className="text-emerald-700 dark:text-emerald-300 block mb-1">Apakah Anda Tahu?</strong>
                  Heimdall versi desktop native saat ini sudah tersedia secara internal dan sedang dalam tahap <strong>Beta Test</strong> untuk Mac, Windows, dan Ubuntu/Linux. Performa lebih gegas dan siap memberikan pengalaman QA yang tak pernah Anda bayangkan sebelumnya!
                </p>
              </div>
            </div>

            <div className="pt-6">
              <button disabled className="inline-flex items-center gap-3 justify-center px-8 py-3.5 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-400 dark:text-zinc-500 font-sans font-bold text-sm tracking-wide uppercase cursor-not-allowed border border-slate-200 dark:border-zinc-700/50">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
                Join Waitlist (Tutup Sementara)
              </button>
            </div>
          </div>
        </WindowCard>
      </div>
    </section>
  );
};