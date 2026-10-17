import React from 'react';
import { Inbox, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from './Button';

export const Loader = ({ message = 'Loading...', size = 'md' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center space-y-3">
      <div className={`${sizeClasses[size]} border-indigo-500 border-t-transparent rounded-full animate-spin`} />
      {message && <p className="text-xs sm:text-sm text-slate-400 font-medium animate-pulse">{message}</p>}
    </div>
  );
};

export const EmptyState = ({
  icon: Icon = Inbox,
  title = 'No items found',
  description = 'There are no records matching your current criteria.',
  actionLabel,
  onAction,
  className = '',
}) => {
  return (
    <div className={`glass-card p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-4 rounded-2xl sm:rounded-3xl ${className}`}>
      <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center shadow-inner">
        <Icon className="w-6 h-6 sm:w-7 sm:h-7" />
      </div>
      <div className="max-w-sm space-y-1">
        <h4 className="text-base sm:text-lg font-bold text-white tracking-tight">{title}</h4>
        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">{description}</p>
      </div>
      {actionLabel && onAction && (
        <Button variant="primary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
};

export const ErrorState = ({
  title = 'Something went wrong',
  description = 'Failed to load data. Please check your network and try again.',
  onRetry,
}) => {
  return (
    <div className="glass-card border-rose-500/30 p-8 sm:p-10 text-center flex flex-col items-center justify-center space-y-4 rounded-2xl sm:rounded-3xl">
      <div className="w-12 h-12 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400 flex items-center justify-center">
        <AlertCircle className="w-6 h-6" />
      </div>
      <div className="max-w-sm space-y-1">
        <h4 className="text-base font-bold text-white tracking-tight">{title}</h4>
        <p className="text-xs text-slate-400">{description}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" icon={RefreshCw} onClick={onRetry}>
          Try Again
        </Button>
      )}
    </div>
  );
};
