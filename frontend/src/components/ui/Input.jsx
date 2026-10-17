import React from 'react';

export const Input = ({
  label,
  error,
  helper,
  icon: Icon,
  className = '',
  containerClassName = '',
  ...props
}) => {
  return (
    <div className={`space-y-1.5 w-full ${containerClassName}`}>
      {label && (
        <label className="block text-xs font-semibold text-slate-300">
          {label}
        </label>
      )}
      <div className="relative flex items-center">
        {Icon && (
          <div className="absolute left-3.5 text-slate-400 pointer-events-none flex items-center justify-center">
            <Icon className="w-4 h-4" />
          </div>
        )}
        <input
          className={`w-full px-3.5 py-2.5 ${Icon ? 'pl-10' : ''} bg-slate-900/90 border ${
            error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-700/80 focus:border-indigo-500 focus:ring-indigo-500/20'
          } rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
      {helper && !error && <p className="text-[11px] text-slate-500">{helper}</p>}
    </div>
  );
};

export const Textarea = ({
  label,
  error,
  helper,
  className = '',
  containerClassName = '',
  rows = 4,
  ...props
}) => {
  return (
    <div className={`space-y-1.5 w-full ${containerClassName}`}>
      {label && (
        <label className="block text-xs font-semibold text-slate-300">
          {label}
        </label>
      )}
      <textarea
        rows={rows}
        className={`w-full px-3.5 py-2.5 bg-slate-900/90 border ${
          error ? 'border-rose-500 focus:border-rose-500 focus:ring-rose-500/20' : 'border-slate-700/80 focus:border-indigo-500 focus:ring-indigo-500/20'
        } rounded-xl text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 transition-all resize-none ${className}`}
        {...props}
      />
      {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
      {helper && !error && <p className="text-[11px] text-slate-500">{helper}</p>}
    </div>
  );
};

export const Select = ({
  label,
  error,
  options = [],
  className = '',
  containerClassName = '',
  ...props
}) => {
  return (
    <div className={`space-y-1.5 w-full ${containerClassName}`}>
      {label && (
        <label className="block text-xs font-semibold text-slate-300">
          {label}
        </label>
      )}
      <select
        className={`w-full px-3.5 py-2.5 bg-slate-900/90 border ${
          error ? 'border-rose-500 focus:border-rose-500' : 'border-slate-700/80 focus:border-indigo-500'
        } rounded-xl text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 transition-all ${className}`}
        {...props}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value} className="bg-slate-900 text-white">
            {opt.label}
          </option>
        ))}
      </select>
      {error && <p className="text-xs text-rose-400 font-medium">{error}</p>}
    </div>
  );
};
