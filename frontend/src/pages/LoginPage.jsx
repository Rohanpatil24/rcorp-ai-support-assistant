import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  Bot,
  Mail,
  Lock,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';

export const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login, googleLogin, quickLoginAs } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = await login(email, password);
      if (['admin', 'super_admin'].includes(data.user?.role)) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid email or password credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleMock = async () => {
    try {
      setLoading(true);
      setError('');
      await googleLogin({
        email: 'google.user@example.com',
        fullname: 'Google User',
        avatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      });
      navigate('/dashboard');
    } catch (err) {
      setError('Google Sign-In failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = async (role) => {
    try {
      setLoading(true);
      setError('');
      const data = await quickLoginAs(role);
      if (['admin', 'super_admin'].includes(data.user?.role)) {
        navigate('/admin');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      setError(`Quick login as ${role} failed: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="min-h-[calc(100vh-4rem)] w-full flex flex-col lg:flex-row items-stretch justify-center">
      {/* Left Form Column */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-4 sm:p-6 lg:p-8 xl:p-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
          className="w-full max-w-md mx-auto rounded-2xl sm:rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/50 backdrop-blur-xl p-5 sm:p-8 lg:border-none lg:bg-transparent lg:backdrop-blur-none lg:p-0 space-y-6 shadow-xl lg:shadow-none"
        >
          {/* Header */}
          <header className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 text-indigo-700 dark:text-indigo-400 text-xs font-medium mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Enterprise AI Workspace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Welcome Back
            </h1>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
              Sign in to access your R Corporation AI support workspace.
            </p>
          </header>

          {/* Quick Demo Role Selectors */}
          <div className="p-3 sm:p-3.5 rounded-2xl bg-indigo-50/70 dark:bg-indigo-950/30 border border-indigo-200 dark:border-indigo-500/20 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider">
                1-Click Demo Evaluation Roles:
              </span>
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              <button
                type="button"
                onClick={() => handleQuickLogin('customer')}
                disabled={loading}
                aria-label="Quick login as Customer"
                className="min-h-[40px] px-2 py-2 rounded-lg bg-white dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-[11px] sm:text-xs font-medium text-slate-700 dark:text-slate-200 transition-all hover:border-slate-300 dark:hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 active:scale-95 disabled:opacity-50 cursor-pointer shadow-sm dark:shadow-none"
              >
                👤 Customer
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('support_agent')}
                disabled={loading}
                aria-label="Quick login as Support Agent"
                className="min-h-[40px] px-2 py-2 rounded-lg bg-white dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-[11px] sm:text-xs font-medium text-indigo-700 dark:text-indigo-300 transition-all hover:border-indigo-300 dark:hover:border-indigo-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 active:scale-95 disabled:opacity-50 cursor-pointer shadow-sm dark:shadow-none"
              >
                🎧 Agent
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('admin')}
                disabled={loading}
                aria-label="Quick login as Admin"
                className="min-h-[40px] px-2 py-2 rounded-lg bg-white dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-[11px] sm:text-xs font-medium text-purple-700 dark:text-purple-300 transition-all hover:border-purple-300 dark:hover:border-purple-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 active:scale-95 disabled:opacity-50 cursor-pointer shadow-sm dark:shadow-none"
              >
                🛡️ Admin
              </button>
              <button
                type="button"
                onClick={() => handleQuickLogin('super_admin')}
                disabled={loading}
                aria-label="Quick login as Super Admin"
                className="min-h-[40px] px-2 py-2 rounded-lg bg-white dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 text-[11px] sm:text-xs font-medium text-cyan-700 dark:text-cyan-300 transition-all hover:border-cyan-300 dark:hover:border-cyan-500/40 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 active:scale-95 disabled:opacity-50 cursor-pointer shadow-sm dark:shadow-none"
              >
                👑 Super
              </button>
            </div>
          </div>

          {/* Error Banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              role="alert"
              aria-live="polite"
              className="p-3 sm:p-3.5 rounded-xl bg-rose-50 dark:bg-rose-500/15 border border-rose-200 dark:border-rose-500/30 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 dark:text-rose-400 mt-0.5" />
              <span className="leading-relaxed">{error}</span>
            </motion.div>
          )}

          {/* Google Sign In */}
          <button
            type="button"
            onClick={handleGoogleMock}
            disabled={loading}
            aria-label="Continue with Google"
            className="w-full py-2.5 sm:py-3 px-4 rounded-xl bg-white dark:bg-slate-900/90 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700/80 hover:border-slate-300 dark:hover:border-slate-600 flex items-center justify-center gap-3 text-xs sm:text-sm font-semibold text-slate-800 dark:text-white transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.8-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.24v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.24C.45 8.15 0 9.92 0 12s.45 3.85 1.24 5.42l4.04-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.24 6.58l4.04 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Divider */}
          <div className="relative flex items-center justify-center my-1">
            <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
            <span className="bg-slate-50 dark:bg-[#0B0F19] px-3 text-[11px] sm:text-xs text-slate-500 uppercase tracking-wider font-medium absolute">
              Or with email
            </span>
          </div>

          {/* Standard Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label
                htmlFor="login-email"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
              >
                Work Email Address
              </label>
              <div className="relative flex items-center">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  id="login-email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label
                  htmlFor="login-password"
                  className="block text-xs font-semibold text-slate-700 dark:text-slate-300"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300 font-medium transition-colors focus:outline-none focus:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative flex items-center">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  id="login-password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-white dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700/80 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              aria-label="Sign In to Workspace"
              className="w-full py-2.5 sm:py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 active:scale-[0.99]"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  <span>Authenticating...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Workspace</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <p className="text-center text-xs text-slate-400">
            Don’t have an account yet?{' '}
            <Link
              to="/register"
              className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors focus:outline-none focus:underline"
            >
              Create an account
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Visual Brand Column (Split Screen Showcase on LG+) */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-50/80 via-purple-50/50 to-slate-100 dark:from-indigo-950/60 dark:via-purple-950/40 dark:to-[#070A11] p-8 xl:p-12 relative overflow-hidden items-center justify-center border-l border-slate-200 dark:border-slate-800/80 transition-colors">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 -right-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-lg space-y-8 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-500 to-cyan-400 p-[1px] shadow-xl">
            <div className="w-full h-full bg-white dark:bg-[#0B0F19] rounded-[15px] flex items-center justify-center">
              <Bot className="w-7 h-7 text-indigo-600 dark:text-indigo-400" />
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl xl:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
              AI Customer Support Built on Empathy & Deep Grounding
            </h2>
            <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed">
              Every conversation is protected by strict retrieval guardrails and enriched by real-time emotion telemetry to de-escalate frustration before it impacts retention.
            </p>
          </div>

          <div className="space-y-3.5 pt-4 border-t border-slate-200 dark:border-slate-800/80 text-sm text-slate-700 dark:text-slate-300">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span>Multi-tenant Role-Based Access Control (RBAC)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span>Direct RAG retrieval with zero hallucination guarantee</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              </div>
              <span>Automated Ticket Generation on Customer Escalation</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
