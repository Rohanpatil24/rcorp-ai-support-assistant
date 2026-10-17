import React from 'react';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';

export const AuthLayout = ({ children, showFooter = true }) => {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#0B0F19] text-slate-900 dark:text-slate-100 flex flex-col font-sans transition-colors duration-200">
      {/* Top Header Navigation for Public Landing & Auth Pages */}
      <Navbar />

      {/* Main Content Area */}
      <main className="flex-1 w-full pt-16 flex flex-col">
        {children}
      </main>

      {showFooter && <Footer />}
    </div>
  );
};
