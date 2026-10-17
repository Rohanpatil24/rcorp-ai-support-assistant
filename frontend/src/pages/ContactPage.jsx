import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { contactService } from '../services/domainServices';
import {
  Mail,
  Phone,
  Building,
  Send,
  CheckCircle2,
  Sparkles,
  MessageSquare,
  Shield,
  AlertCircle,
  User,
  Clock,
} from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Input, Textarea } from '../components/ui/Input';

export const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    company: '',
    subject: '',
    message: '',
    is_demo_request: false,
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await contactService.submitInquiry(formData);
      setSuccess(true);
      setFormData({
        name: '',
        email: '',
        phone: '',
        company: '',
        subject: '',
        message: '',
        is_demo_request: false,
      });
    } catch (err) {
      setError(
        err.response?.data?.error ||
        err.response?.data?.detail ||
        'Failed to submit inquiry. Please verify your fields.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="w-full min-h-[calc(100vh-4rem)] overflow-x-hidden">
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, ease: 'easeOut' }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16"
      >
        {/* Header Section */}
        <header className="text-center max-w-3xl mx-auto mb-8 sm:mb-12 lg:mb-14">
          <div className="inline-flex items-center gap-2 px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/25 text-cyan-300 text-xs font-semibold mb-3 sm:mb-4">
            <Sparkles className="w-3.5 h-3.5 shrink-0" />
            <span>Connect with R Corporation Support Specialists</span>
          </div>
          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            Let’s Discuss Your Support Operations
          </h1>
          <p className="mt-3 sm:mt-4 text-xs sm:text-sm lg:text-base text-slate-400 leading-relaxed max-w-2xl mx-auto">
            Whether you want to schedule a live technical architecture demo, explore enterprise pricing, or speak with our engineers, we’re here to help.
          </p>
        </header>

        {/* 2-Column Responsive Layout */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start">
          {/* Left Information Panel */}
          <aside className="lg:col-span-5 space-y-4 sm:space-y-6">
            <Card glass padding="lg" className="border-indigo-500/20 space-y-6">
              <div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold mb-3">
                  <Building className="w-3.5 h-3.5 shrink-0" />
                  <span>Global Support Network</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                  Enterprise Headquarters
                </h2>
                <p className="mt-2 text-xs sm:text-sm text-slate-300 leading-relaxed">
                  R Corporation provides 24/7 mission-critical customer support automation for telecom, fintech, and high-growth SaaS enterprises worldwide.
                </p>
              </div>

              {/* Contact Channels */}
              <div className="space-y-3 pt-4 border-t border-slate-800">
                <a
                  href="mailto:support@rcorporation.com"
                  className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800/80 hover:border-indigo-500/30 transition-all group"
                  aria-label="Direct email to support@rcorporation.com"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0 group-hover:bg-indigo-500/20 transition-colors">
                    <Mail className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-slate-400">Direct Inquiries</p>
                    <p className="font-semibold text-white text-xs sm:text-sm truncate group-hover:text-indigo-300 transition-colors">
                      support@rcorporation.com
                    </p>
                  </div>
                </a>

                <a
                  href="tel:+18005557267"
                  className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-900/40 hover:bg-slate-800/60 border border-slate-800/80 hover:border-cyan-500/30 transition-all group"
                  aria-label="Call toll-free +1 (800) 555-RCORP (7267)"
                >
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-400 flex items-center justify-center shrink-0 group-hover:bg-cyan-500/20 transition-colors">
                    <Phone className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-slate-400">Toll-Free Enterprise Line</p>
                    <p className="font-semibold text-white text-xs sm:text-sm truncate group-hover:text-cyan-300 transition-colors">
                      +1 (800) 555-RCORP (7267)
                    </p>
                  </div>
                </a>

                <div className="flex items-center gap-3.5 p-3 rounded-xl bg-slate-900/40 border border-slate-800/80">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 text-purple-400 flex items-center justify-center shrink-0">
                    <Building className="w-4 h-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[11px] font-medium text-slate-400">Global Innovation Center</p>
                    <p className="font-semibold text-white text-xs sm:text-sm">
                      R Corporation Tower, Silicon Valley, CA
                    </p>
                  </div>
                </div>
              </div>

              {/* SLA Guarantee Box */}
              <div className="p-3.5 sm:p-4 rounded-2xl bg-indigo-950/30 border border-indigo-500/20 text-xs sm:text-sm text-indigo-300 space-y-1.5">
                <div className="flex items-center gap-2 font-semibold text-white">
                  <Shield className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>Enterprise SLA Guaranteed</span>
                </div>
                <p className="text-slate-300 text-xs leading-relaxed">
                  Inquiries are triaged automatically by our AI system with maximum 15-minute response thresholds for enterprise clients.
                </p>
              </div>

              {/* Trust Metric Badges */}
              <div className="grid grid-cols-2 gap-3 pt-1">
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center">
                  <div className="flex items-center justify-center gap-1 text-emerald-400 mb-0.5">
                    <Clock className="w-3.5 h-3.5" />
                    <span className="text-base sm:text-lg font-bold text-white">&lt; 15 min</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">Enterprise SLA</p>
                </div>
                <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800/80 text-center">
                  <div className="flex items-center justify-center gap-1 text-cyan-400 mb-0.5">
                    <Shield className="w-3.5 h-3.5" />
                    <span className="text-base sm:text-lg font-bold text-white">99.99%</span>
                  </div>
                  <p className="text-[11px] text-slate-400 font-medium">Uptime Reliable</p>
                </div>
              </div>
            </Card>
          </aside>

          {/* Right Form Card */}
          <div className="lg:col-span-7">
            <Card glass padding="lg" className="border-slate-800 shadow-2xl relative">
              {success ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  className="py-10 sm:py-14 text-center space-y-4"
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20 animate-bounce">
                    <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10" />
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
                    Inquiry Received!
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-300 max-w-md mx-auto leading-relaxed">
                    Thank you for reaching out to R Corporation. A dedicated technical solution architect has received your inquiry and will connect with you within 2 business hours.
                  </p>
                  <div className="pt-4">
                    <Button
                      type="button"
                      variant="secondary"
                      size="md"
                      onClick={() => setSuccess(false)}
                      className="px-6 py-2.5 font-medium"
                    >
                      Send Another Inquiry
                    </Button>
                  </div>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5" noValidate={false}>
                  {error && (
                    <div
                      role="alert"
                      className="p-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs sm:text-sm flex items-start gap-2.5"
                    >
                      <AlertCircle className="w-4 h-4 text-rose-400 mt-0.5 shrink-0" />
                      <span>{error}</span>
                    </div>
                  )}

                  {/* Form fields: 1-col mobile, 2-col desktop */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <Input
                        label="Full Name *"
                        name="name"
                        type="text"
                        required
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="e.g. Elena Rostova"
                        icon={User}
                        autoComplete="name"
                        aria-label="Full Name"
                      />
                    </div>

                    <div>
                      <Input
                        label="Email Address *"
                        name="email"
                        type="email"
                        required
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="elena@company.com"
                        icon={Mail}
                        autoComplete="email"
                        aria-label="Email Address"
                      />
                    </div>

                    <div>
                      <Input
                        label="Phone Number"
                        name="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="+1 (555) 019-2834"
                        icon={Phone}
                        autoComplete="tel"
                        aria-label="Phone Number"
                      />
                    </div>

                    <div>
                      <Input
                        label="Company Name"
                        name="company"
                        type="text"
                        value={formData.company}
                        onChange={handleChange}
                        placeholder="Acme Corporation"
                        icon={Building}
                        autoComplete="organization"
                        aria-label="Company Name"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <Input
                        label="Subject *"
                        name="subject"
                        type="text"
                        required
                        value={formData.subject}
                        onChange={handleChange}
                        placeholder="e.g. Migration to R Corporation AI Platform"
                        icon={MessageSquare}
                        aria-label="Subject"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <Textarea
                        label="Message / Requirements *"
                        name="message"
                        required
                        rows={4}
                        value={formData.message}
                        onChange={handleChange}
                        placeholder="Tell us about your team size, support channels, ticket volume, or technical requirements..."
                        aria-label="Message / Requirements"
                      />
                    </div>

                    {/* Request Demo Checkbox */}
                    <div className="sm:col-span-2">
                      <label
                        htmlFor="is_demo_request"
                        className="flex items-start sm:items-center gap-3 p-3.5 sm:p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-indigo-500/40 transition-colors cursor-pointer group"
                      >
                        <input
                          type="checkbox"
                          id="is_demo_request"
                          name="is_demo_request"
                          checked={formData.is_demo_request}
                          onChange={handleChange}
                          className="mt-0.5 sm:mt-0 w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 bg-slate-900 border-slate-700 cursor-pointer"
                        />
                        <div className="select-none text-xs sm:text-sm">
                          <span className="font-semibold text-slate-200 group-hover:text-white transition-colors">
                            Request an Interactive Architecture & Emotion Intelligence Demo
                          </span>
                          <p className="text-[11px] sm:text-xs text-slate-400 mt-0.5">
                            Includes custom live benchmark against your existing CSAT and SLA metrics.
                          </p>
                        </div>
                      </label>
                    </div>

                    {/* Submit Button */}
                    <div className="sm:col-span-2 pt-2">
                      <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        loading={loading}
                        disabled={loading}
                        icon={Send}
                        className="w-full text-sm sm:text-base font-semibold shadow-lg shadow-indigo-600/25"
                      >
                        {loading
                          ? 'Submitting Inquiry...'
                          : formData.is_demo_request
                          ? 'Submit Demo Request'
                          : 'Send Message'}
                      </Button>
                    </div>
                  </div>
                </form>
              )}
            </Card>
          </div>
        </section>
      </motion.div>
    </main>
  );
};
