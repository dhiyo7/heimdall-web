import React from 'react';
import { WindowCard } from '../../components/ui/WindowCard';

export const VisualIntelligenceSection: React.FC = () => {
  return (
    <section id="other-features" className="bg-white dark:bg-zinc-950 py-16 md:py-24 border-b border-slate-200/85 dark:border-zinc-900/85 scroll-mt-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="font-sans font-black text-3xl md:text-5xl tracking-tight text-slate-900 dark:text-white">Alat Lengkap di Ujung Jari</h2>
          <p className="mt-4 text-slate-500 dark:text-zinc-400 max-w-xl mx-auto text-sm sm:text-base">
            Heimdall Desktop membawa serangkaian fitur enterprise yang kini bisa Anda nikmati secara mudah dan intuitif.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 items-stretch">
          
          <WindowCard title="smart_inspector.exe" noPadding className="flex flex-col h-full shadow-sm hover:-translate-y-1 transition-transform">
            <div className="p-6 flex-1 flex flex-col justify-start">
              <h3 className="font-sans font-bold text-lg text-slate-900 dark:text-zinc-100 mb-3">Smart Inspector</h3>
              <p className="font-sans text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                Bedah elemen UI aplikasi Android dan Web secara instan. Cukup klik elemen di layar, dan Heimdall akan langsung membuatkan kodenya untuk Anda. Tidak perlu lagi mencari ID secara manual.
              </p>
            </div>
          </WindowCard>

          <WindowCard title="device_fleet.sh" noPadding className="flex flex-col h-full shadow-sm hover:-translate-y-1 transition-transform">
            <div className="p-6 flex-1 flex flex-col justify-start">
              <h3 className="font-sans font-bold text-lg text-slate-900 dark:text-zinc-100 mb-3">Manajemen Perangkat</h3>
              <p className="font-sans text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                Hubungkan HP fisik Anda atau buat Android Virtual Device (AVD) langsung dari aplikasi. Pantau baterai, OS, dan log sistem secara real-time dari satu tempat.
              </p>
            </div>
          </WindowCard>
          
          <WindowCard title="host_telemetry.sys" noPadding className="flex flex-col h-full shadow-sm hover:-translate-y-1 transition-transform">
            <div className="p-6 flex-1 flex flex-col justify-start">
              <h3 className="font-sans font-bold text-lg text-slate-900 dark:text-zinc-100 mb-3">Pemantauan Performa</h3>
              <p className="font-sans text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
                Tak perlu khawatir mesin Anda kewalahan. Fitur Host Telemetry secara otomatis mengawasi beban CPU, RAM, dan penyimpanan, memberi peringatan dini sebelum batas kritis tercapai.
              </p>
            </div>
          </WindowCard>

        </div>
      </div>
    </section>
  );
};