import React from 'react';
import { WindowCard } from '../../components/ui/WindowCard';

export const DocumentationSection: React.FC = () => {
  return (
    <section id="docs" className="py-16 md:py-24 bg-slate-50/50 dark:bg-zinc-900/10 transition-colors duration-300 border-b border-slate-200/80 dark:border-zinc-900/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-sans font-black text-3xl md:text-5xl tracking-tight text-slate-900 dark:text-white">Pengalaman Profesional,<br/>Tanpa Kerepotan</h2>
          <p className="mt-4 text-slate-500 dark:text-zinc-400 max-w-xl mx-auto text-sm sm:text-base">Mulai dari manajemen perangkat hingga pemantauan hasil eksekusi, semuanya tertata rapi untuk mendukung produktivitas Anda.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          {/* Left Column */}
          <div className="h-full">
            <WindowCard title="live_preview.exe" className="h-full">
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-slate-100 dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 shadow-sm">
                    <svg className="w-6 h-6 text-slate-700 dark:text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>
                  </div>
                  <h3 className="font-sans font-bold text-xl text-slate-900 dark:text-zinc-100">Live Runner & Mirroring</h3>
                </div>
                <p className="font-sans text-sm md:text-base text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Tidak perlu lagi menebak-nebak apa yang terjadi di layar perangkat. Dengan fitur <strong>Floating Live Preview</strong> dan <strong>Interactive Mirroring</strong>, Anda bisa melihat eksekusi secara langsung. Sentuh atau ketik dari laptop Anda, dan perhatikan bagaimana aplikasi di dalam HP bereaksi tanpa jeda.
                </p>
              </div>
            </WindowCard>
          </div>

          {/* Right Column */}
          <div className="h-full">
            <WindowCard title="test_management.db" className="h-full">
              <div className="space-y-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className="p-3 bg-slate-100 dark:bg-zinc-800 rounded-xl border border-slate-200 dark:border-zinc-700 shadow-sm">
                    <svg className="w-6 h-6 text-slate-700 dark:text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4"></path></svg>
                  </div>
                  <h3 className="font-sans font-bold text-xl text-slate-900 dark:text-zinc-100">Test Management Terpadu</h3>
                </div>
                <p className="font-sans text-sm md:text-base text-slate-600 dark:text-zinc-400 leading-relaxed">
                  Selamat tinggal pada kumpulan file teks yang berantakan. <strong>Test Management System (TMS)</strong> kami menyusun seluruh skenario Anda dalam hierarki yang mudah dibaca. Dilengkapi dengan Script Editor layaknya IDE profesional yang mendukung multi-tab, menyimpan pekerjaan Anda secara otomatis.
                </p>
              </div>
            </WindowCard>
          </div>
        </div>
      </div>
    </section>
  );
};