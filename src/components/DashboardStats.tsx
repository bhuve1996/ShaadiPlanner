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
      {/* Scope Selector: Pink (Bride), Blue (Groom), Mix (Mutual) */}
      <div className="theme-card bg-white/95 p-3.5 sm:p-4 rounded-3xl border-2 border-pink-200 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-3 transition-colors">
        
        {/* Family Perspective Scope */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-slate-700 dark:text-slate-300 mr-1 flex items-center gap-1.5">
            <Heart size={14} className="text-pink-500 fill-pink-500" />
            <span>Select View:</span>
          </span>

          <div className="inline-flex rounded-2xl bg-slate-100 dark:bg-slate-900 p-1 border border-slate-200 dark:border-white/10 shadow-inner">
            
            {/* 1. Mutual / Both */}
            <button
              onClick={() => onSideChange('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeSide === 'ALL'
                  ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-md'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <span>🌸</span>
              <span>Mutual & Combined ({formatLakh(summary.totalActual)})</span>
            </button>

            {/* 2. Groom Bhuvesh (Blue) */}
            <button
              onClick={() => onSideChange('GROOM')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeSide === 'GROOM'
                  ? 'bg-blue-600 text-white shadow-md shadow-blue-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-300'
              }`}
            >
              <span>🤵</span>
              <span>Bhuvesh & Shared ({formatLakh(summary.groomShareDue)})</span>
            </button>

            {/* 3. Bride Harsha (Pink) */}
            <button
              onClick={() => onSideChange('BRIDE')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeSide === 'BRIDE'
                  ? 'bg-rose-500 text-white shadow-md shadow-rose-500/30'
                  : 'text-slate-600 dark:text-slate-400 hover:text-rose-500 dark:hover:text-rose-300'
              }`}
            >
              <span>👰</span>
              <span>Harsha & Shared ({formatLakh(summary.brideShareDue)})</span>
            </button>

          </div>
        </div>

        {/* Guest Ratio Pill */}
        <div 
          onClick={onOpenSettings}
          className="flex items-center gap-2.5 text-xs text-slate-700 dark:text-slate-300 bg-pink-50/70 dark:bg-slate-900/80 hover:bg-pink-100/70 dark:hover:bg-slate-800 border border-pink-300 dark:border-white/10 px-4 py-2 rounded-2xl cursor-pointer transition-all shadow-xs group"
          title="Click to adjust guest ratios"
        >
          <Users className="w-4 h-4 text-purple-600 dark:text-purple-400 group-hover:scale-110 transition-transform" />
          <span>
            Guests: <strong className="text-blue-600 dark:text-blue-400">{settings.groomGuestCount} Bhuvesh</strong> ({summary.guestRatioGroomPercent}%) : <strong className="text-rose-600 dark:text-rose-400">{settings.brideGuestCount} Harsha</strong> ({summary.guestRatioBridePercent}%)
          </span>
          <span className="text-[10px] bg-pink-500 text-white px-2 py-0.5 rounded-full font-bold shadow-2xs">
            Edit
          </span>
        </div>

      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Liability */}
        <div className="theme-card bg-white/95 rounded-3xl p-5 border-2 border-purple-200 shadow-md flex flex-col justify-between hover:border-purple-400 transition-all">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-black uppercase tracking-wider text-purple-900 dark:text-purple-300">
                {activeSide === 'ALL' ? 'Total Wedding Budget' : activeSide === 'GROOM' ? "Bhuvesh's Total Share" : "Harsha's Total Share"}
              </span>
              <div className="w-9 h-9 rounded-2xl bg-purple-100 dark:bg-purple-950/70 text-purple-700 dark:text-purple-300 flex items-center justify-center font-bold">
                <IndianRupee size={17} />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {formatINR(activeDue)}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold">
                {activeSide === 'ALL' ? (
                  <span>Budget Target: <strong className="text-purple-700 dark:text-purple-400">{formatLakh(settings.totalTargetBudget)}</strong></span>
                ) : (
                  <span>~{Math.round((activeDue / (summary.totalActual || 1)) * 100)}% of joint expenditure</span>
                )}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-purple-100 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
            <span>Perspective:</span>
            <span className="font-bold text-purple-700 dark:text-purple-300">
              {activeSide === 'ALL' ? 'Mutual & Both Families' : activeSide === 'GROOM' ? "Bhuvesh's Obligations" : "Harsha's Obligations"}
            </span>
          </div>
        </div>

        {/* Card 2: Advance Paid */}
        <div className="theme-card bg-white/95 rounded-3xl p-5 border-2 border-emerald-200 shadow-md flex flex-col justify-between hover:border-emerald-400 transition-all">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-900 dark:text-emerald-300">
                {activeSide === 'ALL' ? 'Cleared Advances' : activeSide === 'GROOM' ? "Bhuvesh Paid" : "Harsha Paid"}
              </span>
              <div className="w-9 h-9 rounded-2xl bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300 flex items-center justify-center">
                <CheckCircle2 size={17} />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl sm:text-3xl font-black text-emerald-700 dark:text-emerald-400 tracking-tight">
                {formatINR(activePaid)}
              </h3>
              <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-bold">
                {percentPaid}% of dues cleared
              </p>
            </div>
          </div>

          <div className="mt-4">
            <div className="w-full bg-emerald-100/70 dark:bg-white/10 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-500" 
                style={{ width: `${percentPaid}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: Pending Balance */}
        <div className="theme-card bg-white/95 rounded-3xl p-5 border-2 border-rose-200 shadow-md flex flex-col justify-between hover:border-rose-400 transition-all">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-black uppercase tracking-wider text-rose-900 dark:text-rose-300">
                {activeSide === 'ALL' ? 'Remaining Vendor Dues' : activeSide === 'GROOM' ? "Bhuvesh Remaining" : "Harsha Remaining"}
              </span>
              <div className="w-9 h-9 rounded-2xl bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 flex items-center justify-center">
                <Clock size={17} />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                {formatINR(activePending)}
              </h3>
              <p className="text-xs text-rose-600 dark:text-rose-400 mt-1 font-bold">
                Pending before ceremonies
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-rose-100 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-600 dark:text-slate-400">
            <span>Outstanding:</span>
            <span className="font-bold text-rose-700 dark:text-rose-400">{100 - percentPaid}% remaining</span>
          </div>
        </div>

        {/* Card 4: Clean Spending Allocation (Who Spends How Much) */}
        <div className="rounded-3xl p-5 border-2 border-purple-200 dark:border-purple-800/40 bg-purple-50/70 dark:bg-purple-950/30 shadow-md flex flex-col justify-between transition-all">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-black uppercase tracking-wider text-purple-900 dark:text-purple-300">
                Spending Allocation Overview
              </span>
              <div className="w-9 h-9 rounded-2xl bg-white dark:bg-slate-800 shadow-xs flex items-center justify-center text-purple-600 dark:text-purple-400 border border-slate-200 dark:border-white/10">
                <Sparkles size={17} />
              </div>
            </div>
            
            <div className="mt-3 space-y-2.5">
              <div className="flex items-center justify-between bg-white/80 dark:bg-slate-900/60 p-2 rounded-xl border border-blue-100 dark:border-blue-900/30">
                <span className="text-xs font-bold text-blue-700 dark:text-blue-300 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span>Bhuvesh Spends:</span>
                </span>
                <span className="text-sm sm:text-base font-black text-blue-800 dark:text-blue-200">
                  {formatINR(summary.groomShareDue)}
                </span>
              </div>

              <div className="flex items-center justify-between bg-white/80 dark:bg-slate-900/60 p-2 rounded-xl border border-rose-100 dark:border-rose-900/30">
                <span className="text-xs font-bold text-rose-700 dark:text-rose-300 flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span>Harsha Spends:</span>
                </span>
                <span className="text-sm sm:text-base font-black text-rose-800 dark:text-rose-200">
                  {formatINR(summary.brideShareDue)}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-purple-200/60 dark:border-white/10 flex items-center justify-between text-[11px] text-slate-500 dark:text-slate-400">
            <span>Independent allocation</span>
            <span className="font-bold text-purple-700 dark:text-purple-300">No mutual debts or IOUs</span>
          </div>
        </div>

      </div>
    </div>
  );
};
