import React from 'react';
import { Navbar } from './modules/layout/Navbar';
import { Hero } from './modules/landing/Hero';
import { QuickLinks } from './modules/landing/QuickLinks';
import { AboutSection } from './modules/landing/AboutSection';
import { Features } from './modules/landing/Features';
import { DocumentationSection } from './modules/landing/DocumentationSection';
import { VisualIntelligenceSection } from './modules/landing/VisualIntelligenceSection';
import { Roadmap } from './modules/landing/Roadmap';
import { Footer } from './modules/layout/Footer';

const App: React.FC = () => {
  return (
    <div className="min-h-screen bg-white text-black selection:bg-black selection:text-white">
      <Navbar />
      <main>
        <Hero />
        <QuickLinks />
        <AboutSection />
        <Features />
        <DocumentationSection />
        <VisualIntelligenceSection />
        <Roadmap />
      </main>
      <Footer />
    </div>
  );
};

export default App;