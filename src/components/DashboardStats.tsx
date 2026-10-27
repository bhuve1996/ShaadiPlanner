'use client';

import React from 'react';
import { 
  IndianRupee, 
  Users, 
  CheckCircle2, 
  Clock, 
  ArrowRightLeft,
  Sparkles,
  Heart,
  Scale
} from 'lucide-react';
import { SplitCalculation } from '@/lib/calculator';
import { WeddingSettings } from '@/types/wedding';
import { formatINR, formatLakh } from '@/lib/constants';

interface DashboardStatsProps {
  summary: SplitCalculation;
  settings: WeddingSettings;
  activeSide: 'ALL' | 'GROOM' | 'BRIDE';
  onSideChange: (side: 'ALL' | 'GROOM' | 'BRIDE') => void;
  onOpenSettings: () => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  summary,
  settings,
  activeSide,
  onSideChange,
  onOpenSettings,
}) => {
  const activeDue = activeSide === 'ALL' 
    ? summary.totalActual 
    : activeSide === 'GROOM' 
    ? summary.groomShareDue 
    : summary.brideShareDue;

  const activePaid = activeSide === 'ALL' 
    ? summary.totalPaid 
    : activeSide === 'GROOM' 
    ? summary.groomSharePaid 
    : summary.brideSharePaid;

  const activePending = activeSide === 'ALL' 
    ? summary.totalPending 
    : activeSide === 'GROOM' 
    ? summary.groomSharePending 
    : summary.brideSharePending;

  const percentPaid = Math.min(100, Math.round((activePaid / (activeDue || 1)) * 100));

  return (
    <div className="space-y-4">
      {/* Scope Selector: Clean Minimalist Filter */}
      <div className="theme-card bg-white dark:bg-slate-900 p-3 sm:p-4 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors">
        
        {/* Family Perspective Scope */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mr-1 flex items-center gap-1.5">
            <Heart size={14} className="text-slate-400" />
            <span>View:</span>
          </span>

          <div className="inline-flex rounded-xl bg-slate-100 dark:bg-slate-800 p-1 border border-slate-200 dark:border-slate-700">
            
            {/* 1. Mutual / Both */}
            <button
              onClick={() => onSideChange('ALL')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSide === 'ALL'
                  ? 'bg-white dark:bg-slate-900 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>Mutual & Total ({formatLakh(summary.totalActual)})</span>
            </button>

            {/* 2. Groom Bhuvesh (Blue) */}
            <button
              onClick={() => onSideChange('GROOM')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSide === 'GROOM'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-blue-600 dark:hover:text-blue-400'
              }`}
            >
              <span>🤵 Bhuvesh ({formatLakh(summary.groomShareDue)})</span>
            </button>

            {/* 3. Bride Harsha (Pink) */}
            <button
              onClick={() => onSideChange('BRIDE')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                activeSide === 'BRIDE'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400'
              }`}
            >
              <span>👰 Harsha ({formatLakh(summary.brideShareDue)})</span>
            </button>

          </div>
        </div>

        {/* Guest Ratio Pill */}
        <div 
          onClick={onOpenSettings}
          className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-white/10 px-3.5 py-1.5 rounded-xl cursor-pointer transition-all shadow-xs group"
          title="Click to adjust guest ratios"
        >
          <Users className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
          <span>
            Guests: <strong className="text-blue-600 dark:text-blue-400">{settings.groomGuestCount} Bhuvesh</strong> ({summary.guestRatioGroomPercent}%) : <strong className="text-rose-600 dark:text-rose-400">{settings.brideGuestCount} Harsha</strong> ({summary.guestRatioBridePercent}%)
          </span>
          <span className="text-[10px] bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 px-2 py-0.5 rounded-md font-bold">
            Edit
          </span>
        </div>

      </div>

      {/* KPI Cards: Refined, Minimalist 4-Column Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        
        {/* Card 1: Total Liability */}
        <div className="theme-card bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-white/10 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {activeSide === 'ALL' ? 'Total Wedding Budget' : activeSide === 'GROOM' ? "Bhuvesh's Total Share" : "Harsha's Total Share"}
              </span>
              <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold">
                <IndianRupee size={15} />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {formatINR(activeDue)}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-medium">
                {activeSide === 'ALL' ? (
                  <span>Budget Target: <strong>{formatLakh(settings.totalTargetBudget)}</strong></span>
                ) : (
                  <span>~{Math.round((activeDue / (summary.totalActual || 1)) * 100)}% of joint expenditure</span>
                )}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Perspective:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              {activeSide === 'ALL' ? 'Mutual & Both Families' : activeSide === 'GROOM' ? "Bhuvesh's Obligations" : "Harsha's Obligations"}
            </span>
          </div>
        </div>

        {/* Card 2: Advance Paid */}
        <div className="theme-card bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-white/10 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {activeSide === 'ALL' ? 'Cleared Advances' : activeSide === 'GROOM' ? "Bhuvesh Paid" : "Harsha Paid"}
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 size={15} />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {formatINR(activePaid)}
              </h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-bold">
                {percentPaid}% of dues cleared
              </p>
            </div>
          </div>

          <div className="mt-4">
            <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-1.5 overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                style={{ width: `${percentPaid}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: Pending Balance */}
        <div className="theme-card bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-white/10 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                {activeSide === 'ALL' ? 'Remaining Balance' : activeSide === 'GROOM' ? "Bhuvesh Remaining" : "Harsha Remaining"}
              </span>
              <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <Clock size={15} />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {formatINR(activePending)}
              </h3>
              <p className="text-xs text-rose-600 dark:text-rose-400 mt-1 font-semibold">
                Pending before ceremonies
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Outstanding:</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">{100 - percentPaid}% remaining</span>
          </div>
        </div>

        {/* Card 4: Spending Allocation */}
        <div className="theme-card bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200 dark:border-white/10 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Allocation Breakdown
              </span>
              <div className="w-8 h-8 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center">
                <Sparkles size={15} />
              </div>
            </div>
            
            <div className="mt-3 space-y-2">
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1.5 rounded-xl border border-slate-200/60 dark:border-white/5">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>Bhuvesh:</span>
                </span>
                <span className="text-xs sm:text-sm font-black text-blue-700 dark:text-blue-300">
                  {formatINR(summary.groomShareDue)}
                </span>
              </div>

              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-800/60 px-2.5 py-1.5 rounded-xl border border-slate-200/60 dark:border-white/5">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-rose-500" />
                  <span>Harsha:</span>
                </span>
                <span className="text-xs sm:text-sm font-black text-rose-700 dark:text-rose-300">
                  {formatINR(summary.brideShareDue)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Independent allocation</span>
            <span className="font-semibold text-slate-700 dark:text-slate-300">Clean ledger</span>
          </div>
        </div>

      </div>
    </div>
  );
};
