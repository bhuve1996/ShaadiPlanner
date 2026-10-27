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
    <div className="space-y-2">
      {/* KPI Row: Ultra-Compact Modern Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5">
        
        {/* Card 1: Total Liability */}
        <div className="theme-card bg-white dark:bg-slate-900 rounded-xl p-3 border border-slate-200 dark:border-white/10 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
            <span>{activeSide === 'ALL' ? 'Total Budget' : activeSide === 'GROOM' ? "Bhuvi's Total" : "Harsha's Total"}</span>
            <IndianRupee size={13} className="text-slate-400" />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
              {formatINR(activeDue)}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
              Target: {formatLakh(settings.totalTargetBudget)}
            </span>
          </div>
        </div>

        {/* Card 2: Advance Paid */}
        <div className="theme-card bg-white dark:bg-slate-900 rounded-xl p-3 border border-slate-200 dark:border-white/10 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
            <span>{activeSide === 'ALL' ? 'Paid Advances' : activeSide === 'GROOM' ? "Bhuvi Paid" : "Harsha Paid"}</span>
            <CheckCircle2 size={13} className="text-emerald-500" />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-lg sm:text-xl font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
              {formatINR(activePaid)}
            </span>
            <span className="text-[10px] text-emerald-600 font-bold">
              {percentPaid}% cleared
            </span>
          </div>
        </div>

        {/* Card 3: Pending Balance */}
        <div className="theme-card bg-white dark:bg-slate-900 rounded-xl p-3 border border-slate-200 dark:border-white/10 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
            <span>{activeSide === 'ALL' ? 'Remaining Due' : activeSide === 'GROOM' ? "Bhuvi Due" : "Harsha Due"}</span>
            <Clock size={13} className="text-rose-500" />
          </div>
          <div className="mt-1 flex items-baseline justify-between">
            <span className="text-lg sm:text-xl font-black text-slate-900 dark:text-white tracking-tight">
              {formatINR(activePending)}
            </span>
            <span className="text-[10px] text-rose-600 font-semibold">
              {100 - percentPaid}% pending
            </span>
          </div>
        </div>

        {/* Card 4: Spending Allocation */}
        <div className="theme-card bg-white dark:bg-slate-900 rounded-xl p-3 border border-slate-200 dark:border-white/10 shadow-xs flex flex-col justify-between">
          <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider">
            <span>Allocation</span>
            <div 
              onClick={onOpenSettings}
              className="text-[10px] text-slate-500 hover:text-slate-800 dark:hover:text-white font-bold cursor-pointer"
            >
              {settings.groomGuestCount}B : {settings.brideGuestCount}H ({summary.guestRatioGroomPercent}%)
            </div>
          </div>
          <div className="mt-1 flex items-center justify-between text-xs font-bold">
            <span className="text-blue-700 dark:text-blue-300">
              🤵 {formatINR(summary.groomShareDue)}
            </span>
            <span className="text-slate-300 dark:text-slate-600">|</span>
            <span className="text-rose-700 dark:text-rose-300">
              👰 {formatINR(summary.brideShareDue)}
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};
