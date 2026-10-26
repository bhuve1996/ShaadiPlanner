'use client';

import React from 'react';
import { Sparkles, Calendar, Heart, MapPin, Users, Coins } from 'lucide-react';
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
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-950 via-rose-900 to-amber-900 border-2 border-amber-400/60 shadow-xl text-white">
      {/* Background Graphic Imagery Overlay */}
      <div 
        className="absolute inset-0 opacity-25 mix-blend-overlay pointer-events-none bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=1600&q=80')`
        }}
      />

      {/* Decorative Traditional Indian Mandala Motif SVG in corner */}
      <div className="absolute -right-16 -top-16 w-80 h-80 opacity-15 pointer-events-none animate-spin-slow">
        <svg viewBox="0 0 200 200" className="w-full h-full fill-amber-300">
          <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
          <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="2" />
          <circle cx="100" cy="100" r="50" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="2 4" />
          {Array.from({ length: 12 }).map((_, i) => (
            <path
              key={i}
              d="M100 100 L100 20 A10 10 0 0 1 110 30 Z"
              transform={`rotate(${i * 30} 100 100)`}
            />
          ))}
        </svg>
      </div>

      <div className="relative z-10 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Left Column: Couple Title & Traditional Greetings */}
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-300/40 text-amber-200 text-xs font-black backdrop-blur-xs">
            <Sparkles size={14} className="text-amber-300 animate-pulse" />
            <span>॥ श्री गणेशाय नमः ॥ मंगलम भगवान विष्णु</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-amber-100 flex flex-wrap items-center gap-2.5">
            <span>{settings.coupleTitle}</span>
            <span 
              onClick={onCelebration}
              className="inline-block cursor-pointer hover:scale-125 transition-transform" 
              title="Click for flower shower!"
            >
              🌺
            </span>
          </h2>

          <p className="text-amber-200/90 text-xs sm:text-sm font-medium leading-relaxed">
            Planning the auspicious union of two families. Track joint catering, luxury stay, pheras, guest splits, and clear vendor liabilities with absolute harmony.
          </p>

          {/* Quick Info Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
            <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/10 text-amber-200 font-semibold">
              <Calendar size={14} className="text-amber-400" />
              <span>{settings.weddingDate}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/10 text-rose-200 font-semibold">
              <Heart size={14} className="text-rose-400 fill-rose-400" />
              <span>{daysLeft > 0 ? `${daysLeft} Days to Grand Celebration` : 'Wedding Day Celebration!'}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-black/30 backdrop-blur-xs px-3 py-1.5 rounded-xl border border-white/10 text-amber-200 font-semibold">
              <Users size={14} className="text-amber-400" />
              <span>{settings.groomGuestCount + settings.brideGuestCount} Total Guests Invited</span>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Shagun & Wedding Milestones Card */}
        <div className="bg-gradient-to-b from-white/15 to-white/5 backdrop-blur-md rounded-2xl p-5 border border-amber-300/30 flex flex-col gap-3 min-w-[280px]">
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <span className="text-xs font-bold uppercase tracking-wider text-amber-200 flex items-center gap-1.5">
              <Coins size={14} className="text-amber-400" />
              Budget Progress
            </span>
            <button
              onClick={onOpenSettings}
              className="text-[11px] font-bold text-amber-300 hover:text-white underline decoration-amber-400"
            >
              Adjust Settings
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-amber-100/80">Committed / Actual:</span>
              <span className="font-extrabold text-amber-200">{formatLakh(totalActual)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-amber-100/80">Target Budget:</span>
              <span className="font-extrabold text-white">{formatLakh(settings.totalTargetBudget)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-amber-100/80">Cleared Advances:</span>
              <span className="font-extrabold text-emerald-300">{formatINR(totalPaid)}</span>
            </div>
          </div>

          <div className="w-full bg-black/40 rounded-full h-2.5 overflow-hidden mt-1 border border-white/10">
            <div 
              className="h-full bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-500 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, Math.round((totalActual / (settings.totalTargetBudget || 1)) * 100))}%` }}
            />
          </div>

          <button
            onClick={onCelebration}
            className="mt-1 w-full py-2 px-3 rounded-xl bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-500 text-stone-900 font-black text-xs shadow-md hover:brightness-110 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>💐</span>
            <span>Celebrate & Shower Petals</span>
          </button>
        </div>

      </div>
    </div>
  );
};
