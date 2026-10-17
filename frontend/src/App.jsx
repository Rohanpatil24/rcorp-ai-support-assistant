import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { useSidebar } from './hooks/useSidebar';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { Sidebar } from './components/Sidebar';
import { ProtectedRoute } from './components/ProtectedRoute';

import { LandingPage } from './pages/LandingPage';
import { ContactPage } from './pages/ContactPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage, ResetPasswordPage } from './pages/PasswordResetPages';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { AIChatPage } from './pages/AIChatPage';
import { TicketsPage } from './pages/TicketsPage';
import { KnowledgeBasePage } from './pages/KnowledgeBasePage';
import { AdminDashboard } from './pages/AdminDashboard';

const AppLayout = () => {
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const {
    isCollapsed,
    isMobileOpen,
    toggle: toggleSidebar,
    openMobile: openMobileSidebar,
    closeMobile: closeMobileSidebar,
  } = useSidebar();

  const isPublicPage = ['/', '/contact', '/login', '/register', '/forgot-password', '/reset-password'].includes(
    location.pathname
  );

  return (
    <div className="min-h-screen bg-[#0B0F19] text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Responsive Fixed Navbar */}
      <Navbar
        onToggleMobileSidebar={openMobileSidebar}
        isMobileSidebarOpen={isMobileOpen}
      />

      {/* Main Content Area */}
      <div className="pt-16 flex-1 flex w-full">
        {/* Responsive Collapsible Sidebar (Authenticated App View) */}
        {isAuthenticated && !isPublicPage && (
          <Sidebar
            isCollapsed={isCollapsed}
            onToggleCollapse={toggleSidebar}
            isMobileOpen={isMobileOpen}
            onCloseMobile={closeMobileSidebar}
          />
        )}

        {/* Dynamic Page Container */}
        <main className="flex-1 w-full min-w-0 flex flex-col overflow-x-hidden">
          <Routes>
            {/* Public Marketing & Auth Routes */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Authenticated Customer & Operations Routes */}
            <Route element={<ProtectedRoute allowedRoles={['customer', 'support_agent', 'admin', 'super_admin']} />}>
              <Route path="/dashboard" element={<CustomerDashboard />} />
              <Route path="/chat" element={<AIChatPage />} />
              <Route path="/tickets" element={<TicketsPage />} />
              <Route path="/knowledge-base" element={<KnowledgeBasePage />} />
            </Route>

            {/* Operations & Admin Analytics Routes */}
            <Route element={<ProtectedRoute allowedRoles={['support_agent', 'admin', 'super_admin']} />}>
              <Route path="/admin" element={<AdminDashboard />} />
            </Route>

            {/* Fallback */}
            <Route path="*" element={<LandingPage />} />
          </Routes>

          {isPublicPage && <Footer />}
        </main>
      </div>
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <Router>
        <AppLayout />
      </Router>
    </AuthProvider>
  );
}

export default App;
