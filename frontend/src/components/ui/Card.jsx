import React from 'react';

export const Card = ({
  children,
  className = '',
  hoverEffect = false,
  glass = true,
  padding = 'md', // sm | md | lg | none
  ...props
}) => {
  const paddingClasses = {
    none: 'p-0',
    sm: 'p-4',
    md: 'p-5 sm:p-6',
    lg: 'p-6 sm:p-8',
  };

  const baseStyle = glass
    ? 'glass-card border border-white/[0.08] rounded-2xl sm:rounded-3xl bg-[#111827]/60 backdrop-blur-xl'
    : 'bg-slate-900/90 border border-slate-800 rounded-2xl sm:rounded-3xl';

  const hoverStyle = hoverEffect
    ? 'transition-all duration-300 hover:border-indigo-500/40 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-indigo-500/10'
    : '';

  return (
    <div className={`${baseStyle} ${paddingClasses[padding]} ${hoverStyle} ${className}`} {...props}>
      {children}
    </div>
  );
};
