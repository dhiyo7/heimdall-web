import React from 'react';
import { WindowCard } from '../../components/ui/WindowCard';

export const AboutSection: React.FC = () => {
  return (
    <section id="about" className="bg-retro-bg dark:bg-retro-dark-bg py-16 md:py-24 border-b-4 border-black dark:border-white scroll-mt-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-12">

          {/* Left Column: Heading & Origin */}
          <div className="md:w-1/3 space-y-8">
            <h2 className="font-sans font-black text-4xl md:text-5xl leading-none dark:text-white">
              👁️<br />Apa itu<br />Heimdall?
            </h2>
            <div className="font-mono text-sm leading-relaxed border-l-4 border-black dark:border-white pl-4 py-2 dark:text-gray-300">
              <h3 className="font-bold text-lg mb-2 uppercase dark:text-white">Asal Nama</h3>
              <p>
                Diambil dari <strong>Heimdall</strong>, dewa penjaga jembatan Bifrost dalam mitologi Nordik yang memiliki penglihatan dan pendengaran super.
              </p>
            </div>
          </div>

          {/* Right Column: Philosophy */}
          <div className="md:w-2/3">
            <WindowCard title="philosophy.md" date="VISION" className="h-full shadow-retro-lg">
              <div className="space-y-8">
                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold font-mono">1</div>
                    <h3 className="font-sans font-bold text-xl uppercase dark:text-white">Visi Jangka Panjang</h3>
                  </div>
                  <p className="font-mono text-sm md:text-base leading-relaxed pl-11 dark:text-gray-300">
                    Tidak ada bug yang lolos dari pengawasan Heimdall. Tools ini memantau status HTTP (API), performa, dan UI secara <em>pixel-perfect</em>.
                  </p>
                </div>

                <div className="border-t-2 border-dashed border-gray-300 dark:border-gray-600"></div>

                <div>
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-black text-white dark:bg-white dark:text-black flex items-center justify-center font-bold font-mono">2</div>
                    <h3 className="font-sans font-bold text-xl uppercase dark:text-white">Security (Quality Gate)</h3>
                  </div>
                  <p className="font-mono text-sm md:text-base leading-relaxed pl-11 dark:text-gray-300">
                    Heimdall adalah penjaga gerbang sebelum aplikasi dirilis ke user. Jika Heimdall bilang <span className="bg-red-500 text-white px-1 font-bold rounded-sm">"Merah"</span>, berarti dilarang rilis!
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