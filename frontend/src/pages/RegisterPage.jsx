import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import {
  Bot,
  Mail,
  Lock,
  User,
  Phone,
  Building,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Sparkles,
} from 'lucide-react';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    fullname: '',
    email: '',
    mobile: '',
    company_name: '',
    password: '',
    confirm_password: '',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirm_password) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }

    setLoading(true);

    try {
      await register({
        ...formData,
        role: 'customer',
      });
      navigate('/dashboard');
    } catch (err) {
      const errorData = err.response?.data;
      if (typeof errorData === 'object' && errorData !== null) {
        const msg = Object.entries(errorData)
          .map(([k, v]) => `${k}: ${Array.isArray(v) ? v.join(' ') : v}`)
          .join(' | ');
        setError(msg);
      } else {
        setError('Registration failed. Please check your information.');
      }
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
          className="w-full max-w-md sm:max-w-lg lg:max-w-xl mx-auto rounded-2xl sm:rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-xl p-5 sm:p-8 lg:border-none lg:bg-transparent lg:backdrop-blur-none lg:p-0 space-y-6 shadow-xl lg:shadow-none"
        >
          {/* Header */}
          <header className="space-y-1.5 text-center sm:text-left">
            <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-medium mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Get Started Free</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Create Workspace Account
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
              Join enterprise teams elevating customer experience with R Corporation AI.
            </p>
          </header>

          {/* Error Banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              role="alert"
              aria-live="polite"
              className="p-3 sm:p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-start gap-2.5"
            >
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <span className="leading-relaxed break-words">{error}</span>
            </motion.div>
          )}

          {/* Registration Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            {/* Full Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="register-fullname"
                className="block text-xs font-semibold text-slate-300"
              >
                Full Name *
              </label>
              <div className="relative flex items-center">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  id="register-fullname"
                  type="text"
                  name="fullname"
                  required
                  autoComplete="name"
                  value={formData.fullname}
                  onChange={handleChange}
                  placeholder="e.g. David Miller"
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>

            {/* Email & Mobile Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="register-email"
                  className="block text-xs font-semibold text-slate-300"
                >
                  Work Email *
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    id="register-email"
                    type="email"
                    name="email"
                    required
                    autoComplete="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="david@company.com"
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="register-mobile"
                  className="block text-xs font-semibold text-slate-300"
                >
                  Mobile Number
                </label>
                <div className="relative flex items-center">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    id="register-mobile"
                    type="tel"
                    name="mobile"
                    autoComplete="tel"
                    value={formData.mobile}
                    onChange={handleChange}
                    placeholder="+1 (555) 234-8901"
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Company Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="register-company"
                className="block text-xs font-semibold text-slate-300"
              >
                Company Name
              </label>
              <div className="relative flex items-center">
                <Building className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                <input
                  id="register-company"
                  type="text"
                  name="company_name"
                  autoComplete="organization"
                  value={formData.company_name}
                  onChange={handleChange}
                  placeholder="Miller Logistics LLC"
                  className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                />
              </div>
            </div>

            {/* Password & Confirm Password Responsive Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="register-password"
                  className="block text-xs font-semibold text-slate-300"
                >
                  Password *
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    id="register-password"
                    type="password"
                    name="password"
                    required
                    autoComplete="new-password"
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Min. 8 characters"
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="register-confirm-password"
                  className="block text-xs font-semibold text-slate-300"
                >
                  Confirm Password *
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 pointer-events-none" />
                  <input
                    id="register-confirm-password"
                    type="password"
                    name="confirm_password"
                    required
                    autoComplete="new-password"
                    value={formData.confirm_password}
                    onChange={handleChange}
                    placeholder="Repeat password"
                    className="w-full pl-10 pr-4 py-2.5 sm:py-3 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/20 transition-all"
                  />
                </div>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              aria-label="Complete Registration"
              className="w-full py-2.5 sm:py-3.5 rounded-xl bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 active:scale-[0.99] mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin shrink-0" />
                  <span>Creating Workspace Account...</span>
                </>
              ) : (
                <>
                  <span>Complete Registration</span>
                  <ArrowRight className="w-4 h-4 shrink-0" />
                </>
              )}
            </button>
          </form>

          {/* Footer Link */}
          <p className="text-center text-xs text-slate-400">
            Already registered?{' '}
            <Link
              to="/login"
              className="text-indigo-400 font-semibold hover:text-indigo-300 transition-colors focus:outline-none focus:underline"
            >
              Sign in to your account
            </Link>
          </p>
        </motion.div>
      </div>

      {/* Right Visual Brand Column */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-purple-950/40 via-indigo-950/60 to-[#070A11] p-8 xl:p-12 relative overflow-hidden items-center justify-center border-l border-slate-800/80">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 -right-20 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-lg space-y-6 relative z-10">
          <div className="w-14 h-14 rounded-2xl bg-indigo-600/30 border border-indigo-500/30 text-indigo-400 flex items-center justify-center shadow-lg">
            <Bot className="w-7 h-7" />
          </div>

          <div className="space-y-4">
            <h2 className="text-2xl xl:text-3xl font-extrabold text-white tracking-tight leading-tight">
              Next-Gen Customer Support Starts Here
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Gain immediate access to R Corporation’s self-learning AI Support Assistant, RAG vector search, and integrated multi-role ticketing.
            </p>
          </div>

          <div className="space-y-3.5 pt-4 border-t border-slate-800/80 text-sm text-slate-300">
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <span>Full compliance with R Corporation SLA guidelines</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <span>Automatic sentiment telemetry & priority escalation</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-5 h-5 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              </div>
              <span>Instant knowledge-base vectorization and grounding</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
