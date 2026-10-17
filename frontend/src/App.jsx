import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './components/ProtectedRoute';

import { AuthLayout } from './layouts/AuthLayout';
import { DashboardLayout } from './layouts/DashboardLayout';

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

const AppRoutes = () => {
  const { isAuthenticated, isAdmin } = useAuth();

  return (
    <Routes>
      {/* ========================================================================= */}
      {/* PUBLIC ROUTES (Uses AuthLayout with Top Header Navbar)                   */}
      {/* ========================================================================= */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />
          ) : (
            <AuthLayout showFooter={true}>
              <LandingPage />
            </AuthLayout>
          )
        }
      />
      <Route
        path="/contact"
        element={
          <AuthLayout showFooter={true}>
            <ContactPage />
          </AuthLayout>
        }
      />
      <Route
        path="/login"
        element={
          isAuthenticated ? (
            <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />
          ) : (
            <AuthLayout showFooter={false}>
              <LoginPage />
            </AuthLayout>
          )
        }
      />
      <Route
        path="/register"
        element={
          isAuthenticated ? (
            <Navigate to={isAdmin ? '/admin' : '/dashboard'} replace />
          ) : (
            <AuthLayout showFooter={false}>
              <RegisterPage />
            </AuthLayout>
          )
        }
      />
      <Route
        path="/forgot-password"
        element={
          <AuthLayout showFooter={false}>
            <ForgotPasswordPage />
          </AuthLayout>
        }
      />
      <Route
        path="/reset-password"
        element={
          <AuthLayout showFooter={false}>
            <ResetPasswordPage />
          </AuthLayout>
        }
      />

      {/* ========================================================================= */}
      {/* AUTHENTICATED DASHBOARD ROUTES (Uses DashboardLayout: NO Top Nav)        */}
      {/* ========================================================================= */}
      <Route element={<ProtectedRoute allowedRoles={['customer', 'support_agent', 'admin', 'super_admin']} />}>
        <Route
          path="/dashboard"
          element={
            <DashboardLayout>
              <CustomerDashboard />
            </DashboardLayout>
          }
        />
        <Route
          path="/chat"
          element={
            <DashboardLayout>
              <AIChatPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/tickets"
          element={
            <DashboardLayout>
              <TicketsPage />
            </DashboardLayout>
          }
        />
        <Route
          path="/knowledge-base"
          element={
            <DashboardLayout>
              <KnowledgeBasePage />
            </DashboardLayout>
          }
        />
      </Route>

      {/* Operations & Admin Analytics Routes */}
      <Route element={<ProtectedRoute allowedRoles={['support_agent', 'admin', 'super_admin']} />}>
        <Route
          path="/admin"
          element={
            <DashboardLayout>
              <AdminDashboard />
            </DashboardLayout>
          }
        />
      </Route>

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <AppRoutes />
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
