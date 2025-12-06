import React from 'react';
import { WindowCard } from '../../components/ui/WindowCard';
import { FeatureItem } from '../../types';

const features: FeatureItem[] = [
  {
    id: '1',
    title: 'Python_3.10.py',
    description: 'Otak utama logika automation. Menggunakan versi 3.10+ yang lebih cepat dan modern untuk memproses skenario testing.',
    imageUrl: 'https://images.unsplash.com/photo-1526379095098-d400fd0bf935?q=80&w=1000&auto=format&fit=crop&grayscale'
  },
  {
    id: '2',
    title: 'uiautomator2.apk',
    description: 'Driver android yang lebih ringan dibanding Appium. Menangani interaksi UI level sistem tanpa setup server yang rumit.',
    imageUrl: 'https://images.unsplash.com/photo-1607252650355-f7fd0460ccdb?q=80&w=1000&auto=format&fit=crop&grayscale'
  },
  {
    id: '3',
    title: 'Mermaid_JS.js',
    description: 'Engine visualisasi untuk menggambar Mindmap Flowchart. Memetakan alur aplikasi secara otomatis berdasarkan skenario.',
  },
  {
    id: '4',
    title: 'Docx_Reporter.log',
    description: 'Generator laporan dokumen otomatis (Saga). Menyajikan langkah demi langkah naratif + screenshot bukti dalam format Word.',
  }
];

export const Features: React.FC = () => {
  return (
    <section id="features" className="py-16 md:py-24 bg-dots bg-gray-100 dark:bg-retro-dark-bg scroll-mt-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-sans font-black text-4xl md:text-5xl mb-4 dark:text-white">Dapur Pacu (Tech Stack)</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, idx) => (
            <WindowCard
              key={feature.id}
              title={feature.title}
              date={`STACK-0${idx + 1}`}
              noPadding={!!feature.imageUrl}
              className="group transition-all duration-300 ease-in-out hover:-translate-y-2 shadow-retro-lg hover:shadow-retro-xl"
            >
              {feature.imageUrl && (
                <div className="w-full h-48 border-b-2 border-black dark:border-white overflow-hidden relative">
                  <img
                    src={feature.imageUrl}
                    alt={feature.title}
                    className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-110 filter grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
                </div>
              )}
              <div className="p-6">
                <h3 className="font-sans font-bold text-2xl mb-4 group-hover:text-blue-700 dark:group-hover:text-green-400 transition-colors dark:text-white">{feature.title}</h3>
                <p className="font-mono text-sm leading-relaxed mb-6 dark:text-gray-300">
                  {feature.description}
                </p>
                <a
                  href="https://github.com/dhiyo7/heimdall#%EF%B8%8F-tech-stack-dapur-pacu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-block px-4 py-2 border-2 border-black dark:border-white font-bold text-xs uppercase hover:bg-black hover:text-white dark:hover:bg-white dark:hover:text-black transition-colors dark:text-white"
                >
                  Pelajari Lebih Lanjut
                </a>
              </div>
            </WindowCard>
          ))}
        </div>
      </div>
    </section>
  );
};