import React from 'react';
import { WindowCard } from '../../components/ui/WindowCard';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="bg-slate-50/50 dark:bg-zinc-900/20 py-16 md:py-24 border-b border-slate-200/80 dark:border-zinc-900/80 scroll-mt-20 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-12">

          {/* Left Column: Heading */}
          <div className="md:w-1/3 space-y-6">
            <h2 className="font-sans font-black text-3xl md:text-5xl leading-tight text-slate-900 dark:text-white">
              Satu Platform.<br />
              Segala Solusi.
            </h2>
            <div className="font-sans text-sm leading-relaxed border-l-2 border-emerald-500/50 pl-4 py-1 text-slate-600 dark:text-zinc-400 space-y-2">
              <h3 className="font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wider text-xs">Untuk Siapa Heimdall Dibuat?</h3>
              <p>
                Dari pemula yang baru belajar QA hingga engineer berpengalaman, Heimdall Desktop menyatukan inspeksi elemen, eksekusi tes, dan pelaporan otomatis dalam satu aplikasi yang mulus.
              </p>
            </div>
          </div>

          {/* Right Column: Features summary */}
          <div className="md:w-2/3">
            <WindowCard title="kenapa_heimdall.md" date="VALUE" className="h-full">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-zinc-800/80 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700/50 flex items-center justify-center font-bold font-sans text-sm">1</div>
                    <h3 className="font-sans font-bold text-lg text-slate-900 dark:text-zinc-100 uppercase tracking-tight">Android & Web Sekaligus</h3>
                  </div>
                  <p className="font-sans text-sm md:text-base leading-relaxed pl-11 text-slate-600 dark:text-zinc-400">
                    Tidak perlu berpindah-pindah tool. Uji aplikasi Android dan website Anda secara interaktif dari satu tempat. Inspector pintar kami secara otomatis mengekstrak elemen tanpa konfigurasi tambahan.
                  </p>
                </div>

                <div className="border-t border-slate-100 dark:border-zinc-900"></div>

                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-zinc-800/80 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700/50 flex items-center justify-center font-bold font-sans text-sm">2</div>
                    <h3 className="font-sans font-bold text-lg text-slate-900 dark:text-zinc-100 uppercase tracking-tight">Skrip Bahasa Indonesia</h3>
                  </div>
                  <p className="font-sans text-sm md:text-base leading-relaxed pl-11 text-slate-600 dark:text-zinc-400">
                    Selamat tinggal pada bahasa pemrograman yang rumit. Tulis skenario pengujian seperti Anda berbicara sehari-hari ("Buka aplikasi", "Ketik password", "Ketuk tombol masuk"). 
                  </p>
                </div>
                
                <div className="border-t border-slate-100 dark:border-zinc-900"></div>

                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-zinc-800/80 text-slate-700 dark:text-zinc-300 border border-slate-200 dark:border-zinc-700/50 flex items-center justify-center font-bold font-sans text-sm">3</div>
                    <h3 className="font-sans font-bold text-lg text-slate-900 dark:text-zinc-100 uppercase tracking-tight">Pelaporan Visual Lengkap</h3>
                  </div>
                  <p className="font-sans text-sm md:text-base leading-relaxed pl-11 text-slate-600 dark:text-zinc-400">
                    Pantau kesehatan pengujian Anda melalui Command Center Dashboard. Lihat langsung riwayat tes dengan bukti screenshot di setiap langkah dan metrik keberhasilan secara real-time.
                  </p>
                </div>
              </div>
            </WindowCard>
          </div>

        </div>
      </div>
    </section>
  );
};