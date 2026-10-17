import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  Bot,
  Sparkles,
  LogOut,
  LayoutDashboard,
  MessageSquareText,
  Menu,
  X
} from 'lucide-react';
import { Button } from './ui/Button';

export const Navbar = ({ onToggleMobileSidebar, isMobileSidebarOpen }) => {
  const { user, isAuthenticated, logout, isAdmin } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-40 h-16 glass-nav border-b border-white/[0.08] bg-[#0B0F19]/90 backdrop-blur-xl">
      <div className="w-full h-full px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
        {/* Left Section: Mobile Menu Button + Brand Logo */}
        <div className="flex items-center gap-3">
          {isAuthenticated && (
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/80 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500"
              aria-label={isMobileSidebarOpen ? 'Close navigation drawer' : 'Open navigation drawer'}
            >
              {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}

          <Link to="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#0B0F19] rounded-[11px] flex items-center justify-center">
                <Bot className="w-5 h-5 text-indigo-400 group-hover:text-cyan-300 transition-colors" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base sm:text-lg text-white tracking-tight">R Corporation</span>
                <span className="hidden sm:inline-block text-[10px] font-semibold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30 px-1.5 py-0.5 rounded-full uppercase tracking-wider">
                  AI Support
                </span>
              </div>
              <p className="text-[10px] text-slate-400 hidden sm:block -mt-0.5">Enterprise Intelligence</p>
            </div>
          </Link>
        </div>

        {/* Center: Desktop Navigation Links (Landing Page) */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium text-slate-300">
          <Link to="/" className="hover:text-white transition-colors">Platform</Link>
          <a href="/#features" className="hover:text-white transition-colors">Features</a>
          <a href="/#how-it-works" className="hover:text-white transition-colors">How It Works</a>
          <a href="/#pricing" className="hover:text-white transition-colors">Pricing</a>
          <Link to="/contact" className="hover:text-white transition-colors">Contact</Link>
        </nav>

        {/* Right Section: Actions & Profile */}
        <div className="flex items-center gap-2.5 sm:gap-4">
          {/* AI SLA Online indicator */}
          <div className="hidden sm:flex items-center gap-2 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            <span className="font-mono text-[11px]">SLA 99.98%</span>
          </div>

          {isAuthenticated ? (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link to={isAdmin ? '/admin' : '/dashboard'}>
                <Button variant="secondary" size="sm" icon={LayoutDashboard} className="hidden sm:inline-flex">
                  Dashboard
                </Button>
              </Link>
              <Link to="/chat">
                <Button variant="primary" size="sm" icon={MessageSquareText}>
                  <span className="hidden xs:inline">Support </span>Chat
                </Button>
              </Link>

              {/* User Avatar + Logout */}
              <div className="flex items-center gap-2 pl-2 border-l border-slate-800">
                <div
                  className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-xs font-bold text-white shadow shrink-0"
                  title={user?.fullname || 'User'}
                >
                  {user?.fullname ? user.fullname.charAt(0).toUpperCase() : 'U'}
                </div>
                <button
                  onClick={handleLogout}
                  title="Sign Out"
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-400 hover:bg-rose-500/10 transition-colors"
                  aria-label="Log Out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 sm:gap-3">
              <Link
                to="/login"
                className="text-xs sm:text-sm font-medium text-slate-300 hover:text-white px-2.5 py-1.5 transition-colors"
              >
                Sign In
              </Link>
              <Link to="/register">
                <Button variant="primary" size="sm" icon={Sparkles}>
                  <span>Get Started</span>
                </Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
