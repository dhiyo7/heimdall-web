import React from 'react';
import { Button } from '../../components/ui/Button';

export const Hero: React.FC = () => {
  return (
    <section id="home" className="relative overflow-hidden bg-white dark:bg-zinc-950 border-b border-slate-200/80 dark:border-zinc-900/80 transition-colors duration-300">
      {/* Background Decorative Elements */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/5 dark:bg-emerald-500/5 rounded-full filter blur-[100px] pointer-events-none"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-teal-500/5 dark:bg-teal-500/5 rounded-full filter blur-[80px] pointer-events-none animate-pulse"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-28 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">

          {/* Left Content */}
          <div className="space-y-8">
            
            
            <h1 className="font-sans font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] tracking-tight text-slate-900 dark:text-white">
              Revolusi QA.<br />
              <span className="text-gradient">Tinggalkan Cara Lama.</span>
            </h1>

            <div className="font-sans text-base sm:text-lg md:text-xl border-l-2 border-emerald-600/30 pl-5 text-slate-600 dark:text-zinc-400 space-y-4">
              <p className="font-bold text-slate-800 dark:text-zinc-200">
                "Bagaimana jika pengujian tak lagi butuh coding semalaman?"
              </p>
              <p className="leading-relaxed">
                Heimdall bukan sekadar tool pengujian—ini adalah <span className="font-semibold text-emerald-600 dark:text-emerald-400">asisten pintar Anda</span>. Bayangkan robot tester yang bekerja tanpa lelah, membaca skenario dalam bahasa manusia, lalu mengubahnya menjadi mindmap, laporan, dan pengujian presisi secara instan.
              </p>
              <p className="text-xs text-slate-400 dark:text-zinc-500">
                Sudah siap melihat keajaiban dari eksekusi tanpa batas?
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              {/* <Button onClick={() => window.open('https://github.com/dhiyo7/heimdall', '_blank')}>
                Jelajahi di GitHub
              </Button>
              <Button variant="outline" onClick={() => document.getElementById('desktop-app')?.scrollIntoView({ behavior: 'smooth' })}>
                Lihat Versi Desktop
              </Button> */}
            </div>
          </div>

          {/* Right Content - Illustration */}
          <div className="relative flex justify-center items-center order-first md:order-none">
            <div className="absolute w-72 h-72 bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 rounded-full filter blur-[50px] animate-blob"></div>
            <div className="relative z-10 w-full max-w-md">
              <div className="relative group rounded-2xl overflow-hidden border border-slate-200/80 dark:border-zinc-800/80 bg-white/50 dark:bg-zinc-950/50 backdrop-blur-sm p-3 shadow-2xl transition-all duration-500 hover:border-slate-350 dark:hover:border-zinc-700/85">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-500/10 to-teal-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <img
                  src="/heimdall-hero.jpg"
                  alt="Heimdall Guardian"
                  className="w-full h-auto rounded-xl border border-slate-100/50 dark:border-zinc-900/50 transition-all duration-500 object-cover"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};