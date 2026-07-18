import React from 'react';
import { motion } from 'framer-motion';

const images = [
  {
    src: "https://res.cloudinary.com/devloops7/image/upload/v1784408215/Heimdall/Pasted_image_hnumzq.png",
    alt: "Heimdall Desktop Interface",
    delay: 0.1
  },
  {
    src: "https://res.cloudinary.com/devloops7/image/upload/v1784408215/Heimdall/Pasted_image_2_xiwra6.png",
    alt: "Visual Report & Telemetry",
    delay: 0.2
  },
  {
    src: "https://res.cloudinary.com/devloops7/image/upload/v1784408215/Heimdall/Pasted_image_3_dl9vx4.png",
    alt: "Smart Inspector & Multi-Tab",
    delay: 0.3
  },
  {
    src: "https://res.cloudinary.com/devloops7/image/upload/v1784408215/Heimdall/Pasted_image_4_awylhw.png",
    alt: "Live Test Runner",
    delay: 0.4
  }
];

export const MockupGallery: React.FC = () => {
  return (
    <section id="gallery" className="py-16 md:py-24 bg-slate-50/50 dark:bg-zinc-900/20 border-b border-slate-200/80 dark:border-zinc-900/80 overflow-hidden scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-100 dark:border-emerald-800/50">
            <span className="font-sans text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Desktop UI Sneak Peek
            </span>
          </div>
          <h2 className="font-sans font-black text-3xl md:text-5xl tracking-tight text-slate-900 dark:text-white">
            Pengalaman <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">Visual Menawan</span>
          </h2>
          <p className="mt-6 text-slate-500 dark:text-zinc-400 max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Antarmuka kelas enterprise yang dirancang khusus untuk memanjakan mata sekaligus meningkatkan produktivitas QA Automation Anda tanpa kompromi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {images.map((img, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.7, delay: img.delay, ease: "easeOut" }}
              className="relative group rounded-2xl overflow-hidden shadow-xl border border-slate-200/60 dark:border-zinc-800/60 bg-slate-200/50 dark:bg-zinc-800/30 ring-1 ring-black/5 dark:ring-white/10"
            >
              {/* Overlay Gradient on Hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-slate-900/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10 pointer-events-none" />
              
              {/* Image */}
              <img 
                src={img.src} 
                alt={img.alt} 
                loading="lazy"
                className="w-full h-auto object-cover transform group-hover:scale-105 transition-transform duration-700 ease-out" 
              />
              
              {/* Info Pill on Hover */}
              <div className="absolute bottom-0 left-0 p-6 z-20 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none">
                <span className="px-3 py-1.5 text-xs font-bold uppercase tracking-wider text-white bg-emerald-600/90 rounded-md backdrop-blur-md shadow-lg">
                  {img.alt}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
