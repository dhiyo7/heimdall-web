import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { I18nProvider } from './i18n/I18nContext';
import { Navbar } from './modules/layout/Navbar';
import { Hero } from './modules/landing/Hero';
import { Features } from './modules/landing/Features';
import { MockupGallery } from './modules/landing/MockupGallery';
import { AboutSection } from './modules/landing/AboutSection';
import { VisualIntelligenceSection } from './modules/landing/VisualIntelligenceSection';
import { DocumentationSection } from './modules/landing/DocumentationSection';
import { Roadmap } from './modules/landing/Roadmap';
import { PricingSection } from './modules/landing/PricingSection';
import { FAQSection } from './modules/landing/FAQSection';
import { Footer } from './modules/layout/Footer';
import { ScrollToTop } from './components/ui/ScrollToTop';
import { NotFound } from './pages/NotFound';

const DOCS_URL = 'https://docs.theheimdall.com/';

const LandingPage = () => (
  <>
    <Hero />
    <Features />
    <MockupGallery />
    <AboutSection />
    <VisualIntelligenceSection />
    <DocumentationSection />
    <Roadmap />
    <PricingSection />
    <FAQSection />
  </>
);

// Route /documentation redirects to VitePress documentation (User Guide).
const DocsRedirect = () => {
  React.useEffect(() => {
    window.open(DOCS_URL, '_blank');
  }, []);

  return (
    <section className="min-h-screen flex items-center justify-center bg-[var(--color-background)]">
      <div className="text-center font-mono">
        <p className="text-lg mb-4">Redirecting to Heimdall Documentation…</p>
        <a
          href={DOCS_URL}
          target="_blank"
          className="inline-block bg-[var(--color-text-primary)] text-white px-4 py-2 text-sm font-bold hover:bg-[var(--color-text-secondary)] transition-colors rounded-md"
        >
          Open Documentation →
        </a>
      </div>
    </section>
  );
};

const App: React.FC = () => {
  return (
    <I18nProvider>
      <Router>
        <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)] selection:bg-[var(--color-primary)] selection:text-white transition-colors duration-300">
          <Navbar />
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/documentation" element={<DocsRedirect />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
          <ScrollToTop />
        </div>
      </Router>
    </I18nProvider>
  );
};

export default App;