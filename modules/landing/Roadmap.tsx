import React, { useState } from 'react';
import { WindowCard } from '../../components/ui/WindowCard';
import { roadmapData } from './roadmapData';
import { ChevronRight, Sparkles } from 'lucide-react';

export const Roadmap: React.FC = () => {
  const [activePhase, setActivePhase] = useState<number>(0);

  return (
    <section id="features-timeline" className="bg-slate-50/50 dark:bg-zinc-950/20 py-16 md:py-24 border-b border-slate-200/80 dark:border-zinc-900/80 scroll-mt-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row gap-12 items-start lg:items-center">
          
          <div className="lg:w-1/3 space-y-6">
            <div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold font-sans tracking-wide uppercase bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 mb-4 border border-emerald-100 dark:border-emerald-950">
                KAPABILITAS DESKTOP
              </span>
              <h2 className="font-sans font-black text-3xl md:text-5xl tracking-tight text-slate-900 dark:text-white leading-tight">
                Dirancang untuk<br />Produktivitas.
              </h2>
            </div>
            
            <div className="font-sans text-sm sm:text-base leading-relaxed text-slate-600 dark:text-zinc-400">
              <p>
                Platform ini menggabungkan semua tool yang Anda butuhkan ke dalam satu alur kerja mulus. Jelajahi perjalanan fitur dari inspeksi hingga pelaporan.
              </p>
            </div>
            
            {/* Interactive Timeline Navigation */}
            <div className="hidden lg:flex flex-col gap-2 mt-8">
              {roadmapData.map((phase, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActivePhase(idx)}
                  className={`text-left px-4 py-3 rounded-xl transition-all duration-300 flex items-center justify-between border ${
                    activePhase === idx 
                      ? 'bg-white dark:bg-zinc-900 border-emerald-200 dark:border-emerald-500/30 shadow-sm text-emerald-600 dark:text-emerald-400' 
                      : 'border-transparent hover:bg-slate-100 dark:hover:bg-zinc-900/50 text-slate-500 dark:text-zinc-500'
                  }`}
                >
                  <span className="font-sans text-sm font-bold">{phase.phase}</span>
                  {activePhase === idx && <ChevronRight size={16} />}
                </button>
              ))}
            </div>
          </div>

          <div className="lg:w-2/3 w-full">
            {/* Mobile Navigation (Tabs) */}
            <div className="flex lg:hidden overflow-x-auto pb-4 mb-4 space-x-2 snap-x">
              {roadmapData.map((phase, idx) => (
                <button 
                  key={idx}
                  onClick={() => setActivePhase(idx)}
                  className={`shrink-0 snap-start px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    activePhase === idx 
                      ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/20' 
                      : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 border border-slate-200 dark:border-zinc-800'
                  }`}
                >
                  {phase.phase.split('.')[0]} {/* Show just the number for space */}
                </button>
              ))}
            </div>

            <WindowCard
              title={`fitur_fase_${activePhase + 1}.md`}
              date="LIVE"
              className="w-full min-h-[400px] flex flex-col"
            >
              <div className="p-6 md:p-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
                <div className="mb-8 border-b border-slate-100 dark:border-zinc-800/80 pb-6">
                  <h3 className="font-sans text-xl md:text-2xl font-black text-slate-900 dark:text-white mb-2">{roadmapData[activePhase].phase}</h3>
                  <p className="font-sans text-sm md:text-base text-slate-600 dark:text-zinc-400">{roadmapData[activePhase].description}</p>
                </div>

                <div className="space-y-6">
                  {roadmapData[activePhase].features.map((feature, fIdx) => (
                    <div key={fIdx} className="bg-slate-50/50 dark:bg-zinc-900/30 rounded-xl p-5 border border-slate-100 dark:border-zinc-800/50">
                      <div className="flex gap-3 items-start">
                        <div className="mt-1 w-6 h-6 rounded bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex flex-shrink-0 items-center justify-center">
                          <Sparkles size={12} />
                        </div>
                        <div>
                          <h4 className="font-sans text-base font-bold text-slate-900 dark:text-zinc-100 mb-1">{feature.title}</h4>
                          <p className="font-sans text-sm text-slate-600 dark:text-zinc-400 leading-relaxed mb-3">
                            {feature.description}
                          </p>
                          {feature.subFeatures && (
                            <ul className="space-y-1 mt-2">
                              {feature.subFeatures.map((sub, sIdx) => (
                                <li key={sIdx} className="flex gap-2 items-start text-xs font-sans text-slate-500 dark:text-zinc-500">
                                  <span className="text-emerald-400 mt-0.5">•</span>
                                  <span>{sub}</span>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </WindowCard>
          </div>
        </div>
      </div>
    </section>
  );
};