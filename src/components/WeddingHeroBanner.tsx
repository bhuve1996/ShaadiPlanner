'use client';

import React from 'react';
import { Sparkles, Calendar, Heart, MapPin, Users, Coins, Flower2 } from 'lucide-react';
import { WeddingSettings } from '@/types/wedding';
import { formatLakh, formatINR } from '@/lib/constants';

interface WeddingHeroBannerProps {
  settings: WeddingSettings;
  totalActual: number;
  totalPaid: number;
  onOpenSettings: () => void;
  onCelebration: () => void;
}

export const WeddingHeroBanner: React.FC<WeddingHeroBannerProps> = ({
  settings,
  totalActual,
  totalPaid,
  onOpenSettings,
  onCelebration,
}) => {
  const [daysLeft, setDaysLeft] = React.useState<number>(30);

  React.useEffect(() => {
    try {
      const weddingDate = new Date(settings.weddingDate);
      const today = new Date();
      const diffTime = weddingDate.getTime() - today.getTime();
      setDaysLeft(Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24))));
    } catch {
      setDaysLeft(30);
    }
  }, [settings.weddingDate]);

  return (
    <div className="relative overflow-hidden rounded-2xl bg-slate-900 dark:bg-[#11141D] border border-slate-800 dark:border-white/10 shadow-sm text-white">
      <div className="relative z-10 p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
        
        {/* Left Column: Couple Title */}
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/10 border border-white/15 text-slate-200 text-[11px] font-semibold">
            <span>Wedding Planner</span>
          </div>

          <div>
            <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
              <span>{settings.coupleTitle}</span>
              <span 
                onClick={onCelebration}
                className="cursor-pointer hover:scale-110 transition-transform text-base" 
                title="Click for celebration!"
              >
                ✨
              </span>
            </h2>
            <p className="text-slate-400 text-xs mt-1 font-medium leading-relaxed">
              Shared finances & split ledger • <span className="text-rose-400">Harsha</span> & <span className="text-blue-400">Bhuvesh</span>.
            </p>
          </div>

          {/* Quick Info Badges */}
          <div className="flex flex-wrap items-center gap-2 pt-1 text-xs">
            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10 text-slate-300 font-medium text-xs">
              <Calendar size={13} className="text-slate-400" />
              <span>{settings.weddingDate}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10 text-slate-300 font-medium text-xs">
              <Heart size={13} className="text-rose-400" />
              <span>{daysLeft > 0 ? `${daysLeft} Days to Wedding` : 'Wedding Day!'}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-white/5 px-2.5 py-1 rounded-lg border border-white/10 text-slate-300 font-medium text-xs">
              <Users size={13} className="text-blue-400" />
              <span>{settings.groomGuestCount + settings.brideGuestCount} Total Guests</span>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Budget Summary Card */}
        <div className="bg-white/5 rounded-xl p-4 border border-white/10 flex flex-col gap-2.5 min-w-[260px]">
          <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Coins size={13} className="text-amber-400" />
              Budget Target
            </span>
            <button
              onClick={onOpenSettings}
              className="text-[11px] font-semibold text-slate-300 hover:text-white underline cursor-pointer"
            >
              Adjust
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Total Actual:</span>
              <span className="font-bold text-white">{formatLakh(totalActual)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Target Budget:</span>
              <span className="font-bold text-amber-300">{formatLakh(settings.totalTargetBudget)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">Cleared Advances:</span>
              <span className="font-bold text-emerald-400">{formatINR(totalPaid)}</span>
            </div>
          </div>

          <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden mt-0.5">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, Math.round((totalActual / (settings.totalTargetBudget || 1)) * 100))}%` }}
            />
          </div>

          <button
            onClick={onCelebration}
            className="mt-1 w-full py-2 px-3 rounded-lg bg-white text-slate-900 hover:bg-slate-100 font-bold text-xs transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <Sparkles size={13} />
            <span>Celebrate 🌸</span>
          </button>
        </div>

      </div>
    </div>
  );
};
