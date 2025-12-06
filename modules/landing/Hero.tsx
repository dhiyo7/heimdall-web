import React from 'react';
import { Button } from '../../components/ui/Button';


export const Hero: React.FC = () => {
  return (
    <section id="home" className="bg-white dark:bg-black border-b-4 border-black dark:border-white transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">

          {/* Left Content */}
          <div className="space-y-6">
            <h1 className="font-sans font-black text-5xl md:text-7xl leading-[0.9] tracking-tight dark:text-white">
              Halo.<br />
              Saya Heimdall.
            </h1>
            <div className="font-mono text-lg md:text-xl border-l-4 border-black dark:border-white pl-4 dark:text-gray-300">
              <p className="mb-4 font-bold">
                "The All-Seeing QA Automation Tool"
              </p>
              <p className="mb-4">
                Tools automation lokal untuk mengatasi kejenuhan regression test manual.
                Baca skenario bahasa manusia, jalankan di Android, lalu sajikan Laporan & Mindmap rapi.
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Dibuat dengan ❤️ dan rasa kekhawatiran yang tinggi oleh <a href="https://github.com/dhiyo7" className="underline font-bold hover:text-black dark:hover:text-white">dhiyo7</a>.
              </p>
            </div>

            <div className="pt-4 flex flex-col sm:flex-row gap-4">
              <Button onClick={() => window.open('https://github.com/dhiyo7/heimdall', '_blank')}>
                Clone di GitHub
              </Button>
              <Button variant="outline" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}>
                Lihat Dapur Pacu
              </Button>
            </div>
          </div>

          {/* Right Content - Illustration */}
          <div className="relative hidden md:flex justify-center items-center order-first md:order-none">
            <div className="absolute top-0 right-0 -mr-4 -mt-4 w-24 h-24 bg-gray-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="relative z-10 w-full max-w-sm">
              <div className="border-4 border-black dark:border-white p-2 bg-white dark:bg-black shadow-retro-lg transform rotate-2 hover:rotate-0 transition-all duration-300">
                <img
                  src="/heimdall-hero.jpg"
                  alt="Heimdall Guardian"
                  className="w-full h-auto border-2 border-black dark:border-white grayscale hover:grayscale-0 transition-all duration-500"
                />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};