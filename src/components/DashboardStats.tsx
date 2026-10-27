'use client';

import React from 'react';
import { 
  IndianRupee, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  Users
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
  isSimplifiedView?: boolean;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  summary,
  settings,
  activeSide,
  onSideChange,
  onOpenSettings,
  isSimplifiedView = false,
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
    <div className="space-y-2">
      {/* If in Simplified / Planning view: Clean 2-card layout (Total + Allocation split) */}
      {isSimplifiedView ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {/* Card 1: Total Wedding Liability */}
          <div className="theme-card bg-white dark:bg-[#11141D] rounded-2xl p-4 border border-slate-200 dark:border-white/10 shadow-xs flex flex-col justify-between">
            <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
              <span>{activeSide === 'ALL' ? 'Total Wedding Budget' : activeSide === 'BRIDE' ? "Harsha's Total Allocation" : "Bhuvi's Total Allocation"}</span>
              <IndianRupee size={15} className="text-slate-400" />
            </div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight font-mono">
                {formatINR(activeDue)}
              </span>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Target Cap: {formatLakh(settings.totalTargetBudget)}
              </span>
            </div>
          </div>

          {/* Card 2: Groom vs Bride Allocation Split */}
          <div className="theme-card bg-white dark:bg-[#11141D] rounded-2xl p-4 border border-slate-200 dark:border-white/10 shadow-xs flex flex-col justify-between">
            <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
              <span>Family Split Ratio</span>
              <div 
                onClick={onOpenSettings}
                className="text-[11px] text-slate-500 hover:text-slate-800 dark:hover:text-white font-bold cursor-pointer underline underline-offset-2"
                title="Edit wedding guest counts"
              >
                {settings.brideGuestCount}H : {settings.groomGuestCount}B ({summary.guestRatioBridePercent}%)
              </div>
            </div>
            <div className="mt-2 flex items-center justify-between text-base sm:text-lg font-bold font-mono">
              <div className="flex flex-col">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase">👰 Harsha</span>
                <span className="text-slate-900 dark:text-white font-extrabold">{formatINR(summary.brideShareDue)}</span>
              </div>
              <span className="text-slate-300 dark:text-slate-700 text-xl font-light">|</span>
              <div className="flex flex-col text-right">
                <span className="text-[11px] font-medium text-slate-500 dark:text-slate-400 uppercase">🤵 Bhuvi</span>
                <span className="text-slate-900 dark:text-white font-extrabold">{formatINR(summary.groomShareDue)}</span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Full Detailed 4-Card View (shows Advances & Remaining Dues) */
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
          {/* Card 1: Total Liability */}
          <div className="theme-card bg-white dark:bg-[#11141D] rounded-xl p-3 border border-slate-200 dark:border-white/10 shadow-xs flex flex-col justify-between">
            <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
              <span>{activeSide === 'ALL' ? 'Total Budget' : activeSide === 'BRIDE' ? "Harsha's Total" : "Bhuvi's Total"}</span>
              <IndianRupee size={13} className="text-slate-400" />
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
                {formatINR(activeDue)}
              </span>
              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                Target: {formatLakh(settings.totalTargetBudget)}
              </span>
            </div>
          </div>

          {/* Card 2: Advance Paid */}
          <div className="theme-card bg-white dark:bg-[#11141D] rounded-xl p-3 border border-slate-200 dark:border-white/10 shadow-xs flex flex-col justify-between">
            <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
              <span>{activeSide === 'ALL' ? 'Paid Advances' : activeSide === 'BRIDE' ? "Harsha Paid" : "Bhuvi Paid"}</span>
              <CheckCircle2 size={13} className="text-emerald-500" />
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight font-mono">
                {formatINR(activePaid)}
              </span>
              <span className="text-[10px] text-emerald-600 font-bold">
                {percentPaid}% cleared
              </span>
            </div>
          </div>

          {/* Card 3: Pending Balance */}
          <div className="theme-card bg-white dark:bg-[#11141D] rounded-xl p-3 border border-slate-200 dark:border-white/10 shadow-xs flex flex-col justify-between">
            <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
              <span>{activeSide === 'ALL' ? 'Remaining Due' : activeSide === 'BRIDE' ? "Harsha Due" : "Bhuvi Due"}</span>
              <Clock size={13} className="text-rose-500" />
            </div>
            <div className="mt-1 flex items-baseline justify-between">
              <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight font-mono">
                {formatINR(activePending)}
              </span>
              <span className="text-[10px] text-rose-600 font-semibold">
                {100 - percentPaid}% pending
              </span>
            </div>
          </div>

          {/* Card 4: Spending Allocation */}
          <div className="theme-card bg-white dark:bg-[#11141D] rounded-xl p-3 border border-slate-200 dark:border-white/10 shadow-xs flex flex-col justify-between">
            <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
              <span>Allocation</span>
              <div 
                onClick={onOpenSettings}
                className="text-[10px] text-slate-500 hover:text-slate-800 dark:hover:text-white font-bold cursor-pointer"
              >
                {settings.groomGuestCount}B : {settings.brideGuestCount}H ({summary.guestRatioGroomPercent}%)
              </div>
            </div>
            <div className="mt-1 flex items-center justify-between text-xs font-bold font-mono">
              <span className="text-slate-900 dark:text-white">
                🤵 {formatINR(summary.groomShareDue)}
              </span>
              <span className="text-slate-300 dark:text-slate-600">|</span>
              <span className="text-slate-900 dark:text-white">
                👰 {formatINR(summary.brideShareDue)}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
