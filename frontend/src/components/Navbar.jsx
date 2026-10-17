import React from 'react';
import { Link } from 'react-router-dom';
import { Bot, Sparkles } from 'lucide-react';
import { Button } from './ui/Button';
import { ThemeToggle } from './ThemeToggle';

export const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 glass-nav border-b border-slate-200 dark:border-white/[0.08] bg-white/90 dark:bg-[#0B0F19]/90 backdrop-blur-xl transition-colors duration-200">
      <div className="w-full max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-white dark:bg-[#0B0F19] rounded-[11px] flex items-center justify-center">
              <Bot className="w-5 h-5 text-indigo-600 dark:text-indigo-400 group-hover:text-cyan-400 transition-colors" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base sm:text-lg text-slate-900 dark:text-white tracking-tight">
                R Corporation
              </span>
              <span className="hidden sm:inline-block text-[10px] font-semibold bg-indigo-50 dark:bg-indigo-500/20 text-indigo-600 dark:text-indigo-300 border border-indigo-200 dark:border-indigo-500/30 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                AI Support
              </span>
            </div>
            <p className="text-[10px] text-slate-500 dark:text-slate-400 hidden sm:block -mt-0.5">
              Enterprise Intelligence
            </p>
          </div>
        </Link>

        {/* Center: Desktop Navigation Links (Landing Page) */}
        <nav aria-label="Main Landing Navigation" className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
          <Link to="/" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Platform</Link>
          <a href="/#features" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Features</a>
          <a href="/#how-it-works" className="hover:text-indigo-600 dark:hover:text-white transition-colors">How It Works</a>
          <a href="/#pricing" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Pricing</a>
          <Link to="/contact" className="hover:text-indigo-600 dark:hover:text-white transition-colors">Contact</Link>
        </nav>

        {/* Right Section: Theme Toggle & Auth Buttons */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* Theme Toggle Button */}
          <div className="w-auto">
            <ThemeToggle showLabel={false} className="!w-auto !p-2" />
          </div>

          <Link
            to="/login"
            className="text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-white px-2.5 py-1.5 transition-colors"
          >
            Sign In
          </Link>
          <Link to="/register">
            <Button variant="primary" size="sm" icon={Sparkles}>
              <span>Get Started</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
};
