import React from 'react';
import { Smile, Frown, AlertCircle, HelpCircle, Flame, ShieldAlert, CheckCircle2 } from 'lucide-react';

export const EmotionBadge = ({ emotion = 'Neutral', sentiment = 'Neutral', confidence = 90, showDetails = true, size = 'md' }) => {
  const getBadgeConfig = () => {
    switch (emotion?.toLowerCase()) {
      case 'happy':
      case 'satisfied':
        return {
          icon: Smile,
          bg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/25',
          dot: 'bg-emerald-400',
        };
      case 'confused':
        return {
          icon: HelpCircle,
          bg: 'bg-amber-500/10 text-amber-300 border-amber-500/25',
          dot: 'bg-amber-400',
        };
      case 'frustrated':
        return {
          icon: Frown,
          bg: 'bg-orange-500/10 text-orange-400 border-orange-500/25',
          dot: 'bg-orange-400',
        };
      case 'angry':
        return {
          icon: ShieldAlert,
          bg: 'bg-rose-500/15 text-rose-400 border-rose-500/30 font-semibold',
          dot: 'bg-rose-500 animate-pulse',
        };
      case 'urgent':
        return {
          icon: Flame,
          bg: 'bg-red-500/15 text-red-400 border-red-500/30',
          dot: 'bg-red-400 animate-ping',
        };
      default:
        return {
          icon: AlertCircle,
          bg: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/25',
          dot: 'bg-cyan-400',
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1';

  return (
    <div className={`inline-flex items-center gap-1.5 rounded-full border ${config.bg} ${sizeClasses} backdrop-blur-md`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      <Icon className="w-3.5 h-3.5" />
      <span>{emotion}</span>
      {showDetails && (
        <>
          <span className="opacity-40">•</span>
          <span className="opacity-75">{sentiment}</span>
          <span className="opacity-40">•</span>
          <span className="font-mono text-[10px] font-medium opacity-85">{confidence}%</span>
        </>
      )}
    </div>
  );
};
