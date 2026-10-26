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
    <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-500 via-purple-600 to-sky-500 border-2 border-white/40 shadow-2xl text-white">
      {/* Background Graphic Floral Pattern Overlay */}
      <div 
        className="absolute inset-0 opacity-15 mix-blend-overlay pointer-events-none bg-cover bg-center"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80')`
        }}
      />

      {/* Decorative Floral Mandala in Corner */}
      <div className="absolute -right-16 -top-16 w-80 h-80 opacity-15 pointer-events-none animate-spin-slow">
        <svg viewBox="0 0 200 200" className="w-full h-full fill-white">
          <circle cx="100" cy="100" r="90" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 4" />
          <circle cx="100" cy="100" r="70" fill="none" stroke="currentColor" strokeWidth="2" />
          {Array.from({ length: 16 }).map((_, i) => (
            <path
              key={i}
              d="M100 100 Q110 30 100 10 Q90 30 100 100"
              transform={`rotate(${i * 22.5} 100 100)`}
            />
          ))}
        </svg>
      </div>

      <div className="relative z-10 p-6 sm:p-8 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        
        {/* Left Column: Flowery Pink & Blue Couple Title */}
        <div className="space-y-3 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/20 border border-white/40 text-white text-xs font-black backdrop-blur-md shadow-xs">
            <Flower2 size={14} className="text-yellow-300 animate-spin-slow" />
            <span>🌸 Bhuvesh & Harsha Vivaah • Flowery Wedding Edition 🌺</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-black tracking-tight text-white flex flex-wrap items-center gap-2.5 drop-shadow-md">
            <span>{settings.coupleTitle}</span>
            <span 
              onClick={onCelebration}
              className="inline-block cursor-pointer hover:scale-125 transition-transform" 
              title="Click for flower shower!"
            >
              💐
            </span>
          </h2>

          <p className="text-white/90 text-xs sm:text-sm font-medium leading-relaxed drop-shadow-xs">
            A vibrant, color-coded wedding celebration. <strong className="text-pink-200">Pink for Harsha's side</strong>, <strong className="text-sky-200">Blue for Bhuvesh's side</strong>, and <strong className="text-purple-200">Purple for Mutual ceremonies</strong> with dynamic guest count ratios.
          </p>

          {/* Quick Info Badges */}
          <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
            <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/20 text-white font-bold">
              <Calendar size={14} className="text-yellow-300" />
              <span>{settings.weddingDate}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/20 text-white font-bold">
              <Heart size={14} className="text-pink-300 fill-pink-300" />
              <span>{daysLeft > 0 ? `${daysLeft} Days to Grand Celebration` : 'Wedding Day Celebration!'}</span>
            </div>

            <div className="flex items-center gap-1.5 bg-black/20 backdrop-blur-md px-3 py-1.5 rounded-2xl border border-white/20 text-white font-bold">
              <Users size={14} className="text-sky-300" />
              <span>{settings.groomGuestCount + settings.brideGuestCount} Total Guests</span>
            </div>
          </div>
        </div>

        {/* Right Column: Visual Budget Card */}
        <div className="bg-white/20 backdrop-blur-xl rounded-3xl p-5 border-2 border-white/40 flex flex-col gap-3 min-w-[280px] shadow-2xl">
          <div className="flex items-center justify-between pb-2 border-b border-white/20">
            <span className="text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
              <Coins size={14} className="text-yellow-300" />
              Wedding Budget Target
            </span>
            <button
              onClick={onOpenSettings}
              className="text-[11px] font-bold text-yellow-200 hover:text-white underline decoration-yellow-300 cursor-pointer"
            >
              Adjust Settings
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between text-xs">
              <span className="text-white/80">Total Planned / Actual:</span>
              <span className="font-black text-white">{formatLakh(totalActual)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/80">Target Budget:</span>
              <span className="font-black text-yellow-300">{formatLakh(settings.totalTargetBudget)}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-white/80">Cleared Advances:</span>
              <span className="font-black text-emerald-300">{formatINR(totalPaid)}</span>
            </div>
          </div>

          <div className="w-full bg-black/30 rounded-full h-2.5 overflow-hidden mt-1 border border-white/20">
            <div 
              className="h-full bg-gradient-to-r from-yellow-300 via-pink-300 to-sky-300 rounded-full transition-all duration-700"
              style={{ width: `${Math.min(100, Math.round((totalActual / (settings.totalTargetBudget || 1)) * 100))}%` }}
            />
          </div>

          <button
            onClick={onCelebration}
            className="mt-1 w-full py-2.5 px-3 rounded-2xl bg-white text-pink-700 hover:bg-pink-50 font-black text-xs shadow-lg hover:brightness-105 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
          >
            <span>🌸</span>
            <span>Shower Flowers & Confetti</span>
          </button>
        </div>

      </div>
    </div>
  );
};
