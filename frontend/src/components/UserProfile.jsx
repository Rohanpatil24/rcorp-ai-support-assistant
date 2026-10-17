import React from 'react';
import { LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const UserProfile = ({ isCollapsed = false }) => {
  const { user, role, logout } = useAuth();

  const roleLabels = {
    customer: 'Customer',
    support_agent: 'Support Agent',
    admin: 'Administrator',
    super_admin: 'Super Admin',
  };

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  return (
    <div
      className={`p-2 rounded-xl flex items-center ${
        isCollapsed ? 'justify-center' : 'justify-between'
      } gap-2 bg-slate-100/80 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 transition-colors`}
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-xs shrink-0 shadow">
          {user?.fullname?.charAt(0).toUpperCase() || 'U'}
        </div>
        {!isCollapsed && (
          <div className="min-w-0 overflow-hidden">
            <p className="text-xs font-bold text-slate-800 dark:text-white truncate">
              {user?.fullname || 'Demo User'}
            </p>
            <span className="text-[10px] text-indigo-600 dark:text-indigo-300 font-medium block truncate">
              {roleLabels[role] || 'Member'}
            </span>
          </div>
        )}
      </div>

      {!isCollapsed && (
        <button
          onClick={handleLogout}
          type="button"
          title="Log Out"
          className="p-1.5 text-slate-500 hover:text-rose-500 dark:text-slate-400 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-lg transition-colors shrink-0 cursor-pointer"
          aria-label="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};
