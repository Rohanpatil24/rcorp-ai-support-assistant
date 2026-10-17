import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

export const PageHeader = ({
  title,
  subtitle,
  badge,
  badgeIcon: BadgeIcon,
  action,
  breadcrumbs = [],
  className = '',
}) => {
  return (
    <div className={`space-y-3 pb-6 border-b border-slate-200 dark:border-slate-800/80 ${className}`}>
      {/* Optional Breadcrumbs */}
      {breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 overflow-x-auto" aria-label="Breadcrumb">
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              {idx > 0 && <ChevronRight className="w-3.5 h-3.5 text-slate-400 dark:text-slate-600 shrink-0" />}
              {crumb.path ? (
                <Link to={crumb.path} className="hover:text-slate-900 dark:hover:text-white transition-colors truncate">
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-slate-800 dark:text-slate-200 font-medium truncate">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      {/* Main Title Row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1 min-w-0">
          {badge && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-500/15 border border-indigo-200 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-300 text-xs font-semibold mb-1">
              {BadgeIcon && <BadgeIcon className="w-3.5 h-3.5 text-indigo-500 dark:text-cyan-400 shrink-0" />}
              <span>{badge}</span>
            </div>
          )}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight truncate">
            {title}
          </h1>
          {subtitle && (
            <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          )}
        </div>

        {action && <div className="shrink-0 flex items-center gap-3">{action}</div>}
      </div>
    </div>
  );
};
