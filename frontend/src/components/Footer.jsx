import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Shield, Globe, Terminal, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-[#070A11] pt-14 pb-10 text-slate-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 pb-12 border-b border-slate-800/60">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-400 p-[1px]">
                <div className="w-full h-full bg-[#0B0F19] rounded-[11px] flex items-center justify-center">
                  <Bot className="w-4 h-4 text-indigo-400" />
                </div>
              </div>
              <span className="font-bold text-lg text-white">R Corporation</span>
            </div>
            <p className="text-sm text-slate-400 leading-relaxed">
              Enterprise customer support powered by next-generation multi-modal emotion intelligence, RAG vector retrieval, and automated ticket resolution.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md w-fit">
              <Shield className="w-3.5 h-3.5" />
              <span>SOC2 Type II & GDPR Certified</span>
            </div>
          </div>

          {/* Product */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/chat" className="hover:text-white transition-colors">AI Support Chat</Link></li>
              <li><a href="/#features" className="hover:text-white transition-colors">Emotion Detection Engine</a></li>
              <li><Link to="/knowledge-base" className="hover:text-white transition-colors">Vector Knowledge Base</Link></li>
              <li><Link to="/tickets" className="hover:text-white transition-colors">Support Ticketing SLA</Link></li>
              <li><Link to="/admin" className="hover:text-white transition-colors">Executive Analytics</Link></li>
            </ul>
          </div>

          {/* Resources */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">Resources</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/contact" className="hover:text-white transition-colors">Request a Demo</Link></li>
              <li><a href="/#faq" className="hover:text-white transition-colors">Product FAQs</a></li>
              <li><a href="/#how-it-works" className="hover:text-white transition-colors">Architecture Workflow</a></li>
              <li><span className="text-slate-500 cursor-not-allowed">API Documentation (v1.4)</span></li>
              <li><span className="text-slate-500 cursor-not-allowed">Security Whitepaper</span></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-white font-semibold text-sm mb-4 tracking-wide uppercase">R Corporation</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/contact" className="hover:text-white transition-colors">Contact Support Team</Link></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Global Headquarters</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Privacy & Data Governance</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span></li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} R Corporation International. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Globe className="w-3.5 h-3.5 text-cyan-400" />
              <span>English (US)</span>
            </span>
            <span>Uptime: 99.98%</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
