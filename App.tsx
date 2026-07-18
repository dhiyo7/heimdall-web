import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Navbar } from './modules/layout/Navbar';
import { Hero } from './modules/landing/Hero';
import { Features } from './modules/landing/Features';
import { MockupGallery } from './modules/landing/MockupGallery';
import { Roadmap } from './modules/landing/Roadmap';
import { Footer } from './modules/layout/Footer';
import { ScrollToTop } from './components/ui/ScrollToTop';
import { NotFound } from './pages/NotFound';
import { motion } from 'framer-motion';

const SectionWrapper = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6, ease: "easeOut" }}
  >
    {children}
  </motion.div>
);

const LandingPage = () => (
  <>
    <Hero />
    <SectionWrapper>
      <MockupGallery />
    </SectionWrapper>
    <SectionWrapper>
      <Features />
    </SectionWrapper>
    <SectionWrapper>
      <Roadmap />
    </SectionWrapper>
  </>
);

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-white dark:bg-retro-dark-bg text-black dark:text-gray-200 selection:bg-black selection:text-white dark:selection:bg-green-500 dark:selection:text-black transition-colors duration-300">
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Footer />
        <ScrollToTop />
      </div>
    </Router>
  );
};

export default App;