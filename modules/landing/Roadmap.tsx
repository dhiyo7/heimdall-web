import React from 'react';
import { WindowCard } from '../../components/ui/WindowCard';
import { Accordion, AccordionItem } from '../../components/ui/Accordion';
import { roadmapData } from './roadmapData';
import { CheckSquare, Square } from 'lucide-react';

export const Roadmap: React.FC = () => {
  return (
    <section id="roadmap" className="bg-dots bg-gray-100 py-16 md:py-24 border-b-4 border-black scroll-mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-12 items-start md:items-center">
          <div className="md:w-1/2">
            <div className="inline-block bg-black text-white px-2 py-1 font-mono text-xs font-bold mb-4 transform -rotate-2">
              COMING SOON
            </div>
            <h2 className="font-sans font-black text-4xl md:text-5xl mb-6 leading-tight">
              Roadmap &
              <br />
              Masa Depan
            </h2>
            <div className="font-mono text-base md:text-lg mb-8 leading-relaxed bg-white border-2 border-black p-6 shadow-retro relative">
              <p>
                Heimdall terus berevolusi. Klik pada item di timeline untuk melihat detail teknis dari fitur yang sedang kami racik.
              </p>
              <div className="absolute -top-3 -right-3 bg-black text-white text-xs font-bold px-2 py-1 rotate-3">
                INTERACTIVE
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <a href="https://github.com/dhiyo7/heimdall" className="inline-flex items-center gap-2 font-mono text-sm font-bold underline hover:bg-black hover:text-white transition-colors p-1 w-max">
                <span>👉 Request Fitur di GitHub</span>
              </a>
              <a href="https://github.com/dhiyo7/heimdall/issues" className="inline-flex items-center gap-2 font-mono text-sm font-bold underline hover:bg-black hover:text-white transition-colors p-1 w-max">
                <span>🐛 Lapor Bug (Issue)</span>
              </a>
            </div>
          </div>

          <div className="md:w-1/2 w-full">
            <WindowCard title="STATUS_LOG - ROADMAP_TIMELINE.EXE" date="FUTURE" className="w-full">
              <Accordion defaultOpenIndex={0}>
                {roadmapData.map((phase, phaseIndex) => (
                  <AccordionItem key={phaseIndex} title={phase.phase}>
                    <div className="space-y-3 p-4">
                      <p className="font-mono text-sm text-gray-600 mb-3">{phase.description}</p>
                      {phase.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-3">
                          {feature.done ? <CheckSquare className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" /> : <Square className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />}
                          <div className="flex-grow">
                            <div className="font-mono text-sm">{feature.title}</div>
                            {feature.subFeatures && (
                              <ul className="list-disc list-inside mt-2 space-y-1 pl-4">
                                {feature.subFeatures.map((sub, subIndex) => (
                                  <li key={subIndex} className="font-mono text-xs">{sub}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </AccordionItem>
                ))}
              </Accordion>
            </WindowCard>
          </div>
        </div>
      </div>
    </section>
  );
};