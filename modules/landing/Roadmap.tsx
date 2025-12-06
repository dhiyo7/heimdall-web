import React, { useEffect, useState } from 'react';
import { WindowCard } from '../../components/ui/WindowCard';
import { Accordion, AccordionItem } from '../../components/ui/Accordion';
import { roadmapData as staticCallbacks, RoadmapPhase } from './roadmapData';
import { fetchRoadmap, parseMarkdown } from './roadmapService';
import { CheckSquare, Square, RefreshCw } from 'lucide-react';

export const Roadmap: React.FC = () => {
  const [data, setData] = useState<RoadmapPhase[]>(staticCallbacks);
  const [loading, setLoading] = useState(true);
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      const fetchedData = await fetchRoadmap();
      // Simple check to see if we got data different from fallback/empty
      if (fetchedData && fetchedData.length > 0) {
        setData(fetchedData);
        setIsLive(true);
      }
      setLoading(false);
    };
    loadData();
  }, []);

  return (
    <section id="roadmap" className="bg-dots bg-gray-100 dark:bg-retro-dark-bg py-16 md:py-24 border-b-4 border-black dark:border-white scroll-mt-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row gap-12 items-start md:items-center">
          <div className="md:w-1/2">
            <div className="inline-block bg-black text-white dark:bg-white dark:text-black px-2 py-1 font-mono text-xs font-bold mb-4 transform -rotate-2">
              COMING SOON
            </div>
            <h2 className="font-sans font-black text-4xl md:text-5xl mb-6 leading-tight dark:text-white">
              Roadmap &
              <br />
              Masa Depan
            </h2>
            <div className="font-mono text-base md:text-lg mb-8 leading-relaxed bg-white dark:bg-black border-2 border-black dark:border-white p-6 shadow-retro relative dark:text-gray-300">
              <p>
                Heimdall terus berevolusi. Klik pada item di timeline untuk melihat detail teknis dari fitur yang sedang kami racik.
              </p>
              <div className="absolute -top-3 -right-3 bg-black text-white dark:bg-white dark:text-black text-xs font-bold px-2 py-1 rotate-3">
                INTERACTIVE
              </div>
            </div>
            <div className="flex flex-col gap-3">
              <a href="https://github.com/dhiyo7/heimdall" className="inline-flex items-center gap-2 font-mono text-sm font-bold underline hover:bg-black hover:text-white dark:text-gray-300 dark:hover:bg-white dark:hover:text-black transition-colors p-1 w-max">
                <span>👉 Request Fitur di GitHub</span>
              </a>
              <a href="https://github.com/dhiyo7/heimdall/issues" className="inline-flex items-center gap-2 font-mono text-sm font-bold underline hover:bg-black hover:text-white dark:text-gray-300 dark:hover:bg-white dark:hover:text-black transition-colors p-1 w-max">
                <span>🐛 Lapor Bug (Issue)</span>
              </a>
            </div>
          </div>

          <div className="md:w-1/2 w-full">
            <WindowCard
              title="STATUS_LOG - ROADMAP_TIMELINE.EXE"
              date={isLive ? "LIVE_SYNC" : "OFFLINE_MODE"}
              className="w-full shadow-retro-lg"
            >
              {loading ? (
                <div className="p-8 text-center font-mono text-sm animate-pulse dark:text-white">
                  <RefreshCw className="w-6 h-6 mx-auto mb-2 animate-spin" />
                  Requesting Data...
                </div>
              ) : (
                <Accordion defaultOpenIndex={0}>
                  {data.map((phase, phaseIndex) => (
                    <AccordionItem key={phaseIndex} title={phase.phase}>
                      <div className="space-y-3 p-4">
                        <p className="font-mono text-sm text-gray-600 dark:text-gray-400 mb-3 italic" dangerouslySetInnerHTML={{ __html: parseMarkdown(phase.description) }} />
                        {phase.features.map((feature: any, featureIndex) => (
                          <div key={featureIndex} className="flex items-start gap-3">
                            {feature.done ? <CheckSquare className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" /> : <Square className="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5" />}
                            <div className="flex-grow">
                              <div className="font-mono text-sm" dangerouslySetInnerHTML={{ __html: parseMarkdown(feature.title) }} />
                              {feature.subFeatures && (
                                <ul className="list-disc list-inside mt-2 space-y-1 pl-4">
                                  {feature.subFeatures.map((sub: string, subIndex: number) => (
                                    <li key={subIndex} className="font-mono text-xs" dangerouslySetInnerHTML={{ __html: parseMarkdown(sub) }} />
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
              )}
            </WindowCard>
          </div>
        </div>
      </div>
    </section>
  );
};