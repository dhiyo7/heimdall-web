import React from 'react';
import { WindowCard } from '../../components/ui/WindowCard';
import { languageFeatures, syntaxHighlight } from './featureData';

export const VisualIntelligenceSection: React.FC = () => {
  const otherFeatures = languageFeatures.slice(1);

  return (
    <section id="other-features" className="bg-retro-bg dark:bg-retro-dark-bg py-16 md:py-24 border-b-4 border-black dark:border-white scroll-mt-20 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="font-sans font-black text-4xl md:text-5xl dark:text-white">💡 Fitur Cerdas Lainnya</h2>
          <p className="font-mono text-lg md:text-xl mt-4 max-w-3xl mx-auto dark:text-gray-300">
            Selain cerdas secara visual, Heimdall juga dibekali dengan fitur-fitur logis untuk skrip yang lebih dinamis dan modular.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 items-start">
          {otherFeatures.map((feature, index) => (
            <WindowCard key={index} title={feature.title} noPadding className="shadow-retro-lg group transition-all duration-300 ease-in-out hover:-translate-y-2 hover:shadow-retro-xl">
              <div className="p-8" style={{ backgroundImage: 'radial-gradient(rgba(223, 223, 223, 0.3) 1px, transparent 1px)', backgroundSize: '1rem 1rem' }}>
                <div className="border-2 border-black dark:border-white shadow-retro-xl transition-all duration-300">
                  <div className="bg-white dark:bg-black font-mono text-sm text-black dark:text-white p-4 leading-relaxed transition-colors duration-300">
                    {feature.script.map((line, i) => (
                      <p key={i} dangerouslySetInnerHTML={{ __html: syntaxHighlight(line) }} />
                    ))}
                  </div>
                </div>
              </div>
              <div className="p-4 border-t-2 border-black dark:border-white transition-colors duration-300">
                <p className="font-mono text-sm dark:text-gray-300">
                  {feature.description}
                </p>
              </div>
            </WindowCard>
          ))}
        </div>
      </div>
    </section>
  );
};