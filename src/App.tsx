import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Outlet } from 'react-router-dom';
import { I18nProvider } from './i18n/I18nContext';
import { AuthProvider, RequireAuth } from './lib/auth/AuthContext';
import { RequireRole } from './modules/console/RequireRole';
import { ToastProvider } from './modules/console/Toast';
import { Navbar } from './modules/layout/Navbar';
import { Hero } from './modules/landing/Hero';
import { TrustStrip } from './modules/landing/TrustStrip';
import { EverythingInOneApp } from './modules/landing/EverythingInOneApp';
import { FiveSteps } from './modules/landing/FiveSteps';
import { FeatureStack } from './modules/landing/FeatureStack';
import { DarkNodeSection } from './modules/landing/DarkNodeSection';
import { VisualIntelligenceSection } from './modules/landing/VisualIntelligenceSection';
import { DocumentationSection } from './modules/landing/DocumentationSection';
import { Roadmap } from './modules/landing/Roadmap';
import { PricingSection } from './modules/landing/PricingSection';
import { DownloadSection } from './modules/landing/DownloadSection';
import { FAQSection } from './modules/landing/FAQSection';
import { Footer } from './modules/layout/Footer';
import { ScrollToTop } from './components/ui/ScrollToTop';
import { NotFound } from './pages/NotFound';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

// Console dimuat terpisah supaya landing tidak ikut membesar.
const ConsoleLayout = lazy(() => import('./modules/console/ConsoleLayout'));
const OverviewPage = lazy(() => import('./modules/console/pages/OverviewPage'));
const WorkspacesPage = lazy(() => import('./modules/console/pages/WorkspacesPage'));
const WorkspaceDetailPage = lazy(() => import('./modules/console/pages/WorkspaceDetailPage'));
const DashboardPage = lazy(() => import('./modules/console/pages/DashboardPage'));
const MembersPage = lazy(() => import('./modules/console/pages/MembersPage'));
const InvitationsPage = lazy(() => import('./modules/console/pages/InvitationsPage'));
const DevicesPage = lazy(() => import('./modules/console/pages/DevicesPage'));
const ScriptsPage = lazy(() => import('./modules/console/pages/ScriptsPage'));
const ReportsPage = lazy(() => import('./modules/console/pages/ReportsPage'));
const SettingsPage = lazy(() => import('./modules/console/pages/SettingsPage'));
const DeviceApprovePage = lazy(() => import('./pages/DeviceApprovePage'));
const PublicReportPage = lazy(() => import('./pages/PublicReportPage'));
const InvitationAcceptPage = lazy(() => import('./pages/InvitationAcceptPage'));
const ForgotPasswordPage = lazy(() => import('./pages/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('./pages/ResetPasswordPage'));
const VerifyEmailPage = lazy(() => import('./pages/VerifyEmailPage'));

const DOCS_URL = 'https://docs.theheimdall.com/';

const LandingPage = () => (
  <>
    <Hero />
    <TrustStrip />
    <EverythingInOneApp />
    <FiveSteps />
    <FeatureStack />
    <DarkNodeSection />
    {/* <MockupGallery /> */}
    <VisualIntelligenceSection />
    <DocumentationSection />
    <Roadmap />
    <PricingSection />
    <DownloadSection />
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

const SuspenseFallback = () => (
  <div className="flex min-h-[40vh] items-center justify-center">
    <p className="font-mono text-sm text-[var(--color-text-muted)]">memuat…</p>
  </div>
);

/** Kerangka halaman publik: navbar + footer landing. */
const SiteChrome = () => (
  <>
    <Navbar />
    <Suspense fallback={<SuspenseFallback />}>
      <Outlet />
    </Suspense>
    <Footer />
    <ScrollToTop />
  </>
);

const App: React.FC = () => {
  return (
    <I18nProvider>
      <AuthProvider>
        <ToastProvider>
          <Router>
            <div className="min-h-screen bg-[var(--color-background)] text-[var(--color-text-primary)] selection:bg-[var(--color-primary)] selection:text-white transition-colors duration-300">
              <Routes>
                <Route element={<SiteChrome />}>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/documentation" element={<DocsRedirect />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                  <Route path="/reset-password" element={<ResetPasswordPage />} />
                  <Route path="/verify-email" element={<VerifyEmailPage />} />
                  <Route
                    path="/device"
                    element={
                      <RequireAuth>
                        <DeviceApprovePage />
                      </RequireAuth>
                    }
                  />
                  <Route
                    path="/invitations/:token"
                    element={
                      <RequireAuth>
                        <InvitationAcceptPage />
                      </RequireAuth>
                    }
                  />
                  <Route path="/r/:token" element={<PublicReportPage />} />
                  <Route path="*" element={<NotFound />} />
                </Route>

                <Route
                  path="/app"
                  element={
                    <RequireAuth>
                      <Suspense fallback={<SuspenseFallback />}>
                        <ConsoleLayout />
                      </Suspense>
                    </RequireAuth>
                  }
                >
                  <Route index element={<OverviewPage />} />
                  <Route path="workspaces" element={<WorkspacesPage />} />
                  <Route path="workspaces/:id" element={<WorkspaceDetailPage />} />
                  <Route path="workspaces/:id/dashboard" element={<DashboardPage />} />
                  <Route path="members" element={<MembersPage />} />
                  <Route
                    path="invitations"
                    element={
                      <RequireRole roles={['OWNER', 'ADMIN']}>
                        <InvitationsPage />
                      </RequireRole>
                    }
                  />
                  <Route path="devices" element={<DevicesPage />} />
                  <Route
                    path="settings"
                    element={
                      <RequireRole roles={['OWNER', 'ADMIN']}>
                        <SettingsPage />
                      </RequireRole>
                    }
                  />
                  <Route path="scripts" element={<ScriptsPage />} />
                  <Route path="reports" element={<ReportsPage />} />
                </Route>
              </Routes>
            </div>
          </Router>
        </ToastProvider>
      </AuthProvider>
    </I18nProvider>
  );
};

export default App;
