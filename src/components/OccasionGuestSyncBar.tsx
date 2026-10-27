'use client';

import React, { useState } from 'react';
import { 
  Users, 
  ChevronDown, 
  ChevronUp, 
  Sparkles, 
  UtensilsCrossed, 
  Check, 
  RotateCcw,
  SlidersHorizontal,
  Flame,
  ArrowRight
} from 'lucide-react';
import { WeddingEvent, WeddingSettings } from '@/types/wedding';
import { EVENT_IMAGES } from '@/lib/event-images';

interface OccasionGuestSyncBarProps {
  settings: WeddingSettings;
  onUpdateEventGuests: (event: WeddingEvent, groom: number, bride: number, perPlate?: number) => void;
  onResetToDefaults?: () => void;
}

const EVENTS_LIST: { event: WeddingEvent; defaultGroom: number; defaultBride: number; defaultPerPlate: number }[] = [
  { event: 'Roka / Engagement', defaultGroom: 100, defaultBride: 100, defaultPerPlate: 1200 },
  { event: 'Mehendi', defaultGroom: 50, defaultBride: 100, defaultPerPlate: 800 },
  { event: 'Haldi', defaultGroom: 50, defaultBride: 100, defaultPerPlate: 750 },
  { event: 'Sangeet & Cocktail', defaultGroom: 150, defaultBride: 150, defaultPerPlate: 1400 },
  { event: 'Baraat & Wedding Pheras', defaultGroom: 150, defaultBride: 350, defaultPerPlate: 2000 },
  { event: 'Vida (Bidai / Doli)', defaultGroom: 50, defaultBride: 100, defaultPerPlate: 0 },
  { event: 'Reception', defaultGroom: 220, defaultBride: 180, defaultPerPlate: 1800 },
];

export const OccasionGuestSyncBar: React.FC<OccasionGuestSyncBarProps> = ({
  settings,
  onUpdateEventGuests,
  onResetToDefaults,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const eventConfigs = settings.eventGuestCounts || {};

  return (
    <div className="theme-card bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs overflow-hidden transition-all">
      {/* Header Bar */}
      <div 
        onClick={() => setIsExpanded(prev => !prev)}
        className="p-3.5 sm:p-4 flex items-center justify-between cursor-pointer bg-slate-50/70 dark:bg-slate-800/40 hover:bg-slate-100/70 dark:hover:bg-slate-800/70 transition-all select-none"
      >
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold">
            <SlidersHorizontal size={16} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">
                Occasion Guest Headcount & Per-Plate Sync
              </h3>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                Synced with Ledger
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-normal mt-0.5">
              Change guest numbers for <strong>Roka, Mehendi, Sangeet, Baraat</strong> — all ratios & per-plate costs update automatically.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button 
            type="button"
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          >
            {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>

      {/* Expanded Grid of All Events */}
      {isExpanded && (
        <div className="p-4 sm:p-6 border-t border-purple-100 dark:border-white/10 space-y-4 animate-in slide-in-from-top-2 duration-200">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3.5">
            {EVENTS_LIST.map(({ event, defaultGroom, defaultBride, defaultPerPlate }) => {
              const currentGroom = eventConfigs[event]?.groom !== undefined ? eventConfigs[event].groom : defaultGroom;
              const currentBride = eventConfigs[event]?.bride !== undefined ? eventConfigs[event].bride : defaultBride;
              const currentRate = eventConfigs[event]?.perPlateRate !== undefined ? eventConfigs[event].perPlateRate : defaultPerPlate;
              const totalGuests = currentGroom + currentBride;
              const groomPct = Math.round((currentGroom / (totalGuests || 1)) * 100);
              const bridePct = 100 - groomPct;

              const meta = EVENT_IMAGES[event] || EVENT_IMAGES['All Events'];

              return (
                <div 
                  key={event}
                  className="p-3.5 rounded-2xl bg-slate-50/80 dark:bg-slate-900/70 border border-slate-200/80 dark:border-white/10 hover:border-purple-300 dark:hover:border-purple-600 transition-all flex flex-col justify-between"
                >
                  <div>
                    {/* Event Capsule */}
                    <div className="flex items-center justify-between gap-2 border-b border-slate-200/60 dark:border-white/5 pb-2 mb-2.5">
                      <div className="flex items-center gap-2">
                        <img 
                          src={meta.image} 
                          alt={event} 
                          className="w-7 h-7 rounded-lg object-cover border border-slate-300 dark:border-white/10 flex-shrink-0" 
                        />
                        <span className="text-xs font-black text-slate-900 dark:text-white leading-tight">
                          {event}
                        </span>
                      </div>
                      <span className="text-[11px] font-black text-purple-700 dark:text-purple-300 bg-purple-100 dark:bg-purple-950/80 px-2 py-0.5 rounded-md">
                        {totalGuests} Guests
                      </span>
                    </div>

                    {/* Guest Inputs Grid */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {/* Bhuvesh Guests */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold uppercase text-blue-700 dark:text-blue-300 block">
                          🤵 Bhuvesh ({groomPct}%)
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={currentGroom}
                          onChange={(e) => onUpdateEventGuests(event, Number(e.target.value), currentBride, currentRate)}
                          className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-blue-200 dark:border-blue-900/50 rounded-xl font-black text-xs text-blue-900 dark:text-blue-100 text-center focus:ring-2 focus:ring-blue-400 focus:outline-none"
                        />
                      </div>

                      {/* Harshu Guests */}
                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold uppercase text-rose-700 dark:text-rose-300 block">
                          👰 Harshu ({bridePct}%)
                        </label>
                        <input
                          type="number"
                          min={0}
                          value={currentBride}
                          onChange={(e) => onUpdateEventGuests(event, currentGroom, Number(e.target.value), currentRate)}
                          className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-800 border border-rose-200 dark:border-rose-900/50 rounded-xl font-black text-xs text-rose-900 dark:text-rose-100 text-center focus:ring-2 focus:ring-rose-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    {/* Per Plate Rate Input */}
                    <div className="mt-2.5 pt-2 border-t border-slate-200/50 dark:border-white/5 flex items-center justify-between text-xs">
                      <label className="text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400 flex items-center gap-1">
                        <UtensilsCrossed size={12} className="text-slate-400" />
                        <span>Plate Rate:</span>
                      </label>
                      <div className="flex items-center gap-1">
                        <span className="text-[11px] font-bold text-slate-400">₹</span>
                        <input
                          type="number"
                          min={0}
                          step={50}
                          value={currentRate}
                          onChange={(e) => onUpdateEventGuests(event, currentGroom, currentBride, Number(e.target.value))}
                          className="w-20 px-2 py-0.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg font-black text-xs text-slate-900 dark:text-white text-right focus:outline-none focus:ring-1 focus:ring-slate-400"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Ratio bar */}
                  <div className="mt-3 pt-2 border-t border-slate-200/50 dark:border-white/5 flex items-center justify-between text-[10px] text-slate-500 font-medium">
                    <span>Ratio Sync:</span>
                    <span className="font-bold">
                      <strong className="text-blue-600">{groomPct}%</strong> : <strong className="text-rose-600">{bridePct}%</strong>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex items-center justify-between pt-2 text-xs text-slate-500">
            <span>💡 <strong>Real-time Sync:</strong> Any updates above automatically recalculate per-plate catering rows, guest-ratio splits, and hover cards below.</span>
            <button
              onClick={onResetToDefaults}
              className="text-[11px] font-bold text-slate-500 hover:text-purple-600 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw size={12} />
              <span>Reset Defaults</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
