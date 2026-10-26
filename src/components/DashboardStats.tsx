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
      <div className="bg-white/95 backdrop-blur-md p-3.5 sm:p-4 rounded-3xl border-2 border-pink-200/80 shadow-md flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Family Perspective Scope */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-slate-700 mr-1 flex items-center gap-1.5">
            <Heart size={14} className="text-pink-500 fill-pink-500" />
            <span>Select View:</span>
          </span>

          <div className="inline-flex rounded-2xl bg-slate-100 p-1 border border-slate-200 shadow-inner">
            
            {/* 1. Mutual / Both */}
            <button
              onClick={() => onSideChange('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 cursor-pointer ${
                activeSide === 'ALL'
                  ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-md'
                  : 'text-slate-600 hover:text-slate-900'
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
                  : 'text-slate-600 hover:text-blue-700'
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
                  : 'text-slate-600 hover:text-rose-700'
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
          className="flex items-center gap-2.5 text-xs text-slate-700 bg-pink-50/70 hover:bg-pink-100/70 border border-pink-300 px-4 py-2 rounded-2xl cursor-pointer transition-all shadow-xs group"
          title="Click to adjust guest ratios"
        >
          <Users className="w-4 h-4 text-purple-600 group-hover:scale-110 transition-transform" />
          <span>
            Guests: <strong className="text-blue-600">{settings.groomGuestCount} Bhuvesh</strong> ({summary.guestRatioGroomPercent}%) : <strong className="text-rose-600">{settings.brideGuestCount} Harsha</strong> ({summary.guestRatioBridePercent}%)
          </span>
          <span className="text-[10px] bg-pink-500 text-white px-2 py-0.5 rounded-full font-bold shadow-2xs">
            Edit
          </span>
        </div>

      </div>

      {/* KPI Cards: Flowery Pastel Theme */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Liability */}
        <div className="bg-white/95 rounded-3xl p-5 border-2 border-purple-200/90 shadow-md flex flex-col justify-between hover:border-purple-400 transition-all">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-black uppercase tracking-wider text-purple-900">
                {activeSide === 'ALL' ? 'Total Wedding Budget' : activeSide === 'GROOM' ? "Bhuvesh's Total Share" : "Harsha's Total Share"}
              </span>
              <div className="w-9 h-9 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
                <IndianRupee size={17} />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {formatINR(activeDue)}
              </h3>
              <p className="text-xs text-slate-500 mt-1 font-semibold">
                {activeSide === 'ALL' ? (
                  <span>Budget Target: <strong className="text-purple-700">{formatLakh(settings.totalTargetBudget)}</strong></span>
                ) : (
                  <span>~{Math.round((activeDue / (summary.totalActual || 1)) * 100)}% of joint expenditure</span>
                )}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-purple-100 flex items-center justify-between text-[11px] text-slate-600">
            <span>Perspective:</span>
            <span className="font-bold text-purple-700">
              {activeSide === 'ALL' ? 'Mutual & Both Families' : activeSide === 'GROOM' ? "Bhuvesh's Obligations" : "Harsha's Obligations"}
            </span>
          </div>
        </div>

        {/* Card 2: Advance Paid */}
        <div className="bg-white/95 rounded-3xl p-5 border-2 border-emerald-200/90 shadow-md flex flex-col justify-between hover:border-emerald-400 transition-all">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-900">
                {activeSide === 'ALL' ? 'Cleared Advances' : activeSide === 'GROOM' ? "Bhuvesh Paid" : "Harsha Paid"}
              </span>
              <div className="w-9 h-9 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center">
                <CheckCircle2 size={17} />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight">
                {formatINR(activePaid)}
              </h3>
              <p className="text-xs text-emerald-600 mt-1 font-bold">
                {percentPaid}% of dues cleared
              </p>
            </div>
          </div>

          <div className="mt-4">
            <div className="w-full bg-emerald-100/70 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full transition-all duration-500" 
                style={{ width: `${percentPaid}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: Pending Balance */}
        <div className="bg-white/95 rounded-3xl p-5 border-2 border-rose-200/90 shadow-md flex flex-col justify-between hover:border-rose-400 transition-all">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-black uppercase tracking-wider text-rose-900">
                {activeSide === 'ALL' ? 'Remaining Vendor Dues' : activeSide === 'GROOM' ? "Bhuvesh Remaining" : "Harsha Remaining"}
              </span>
              <div className="w-9 h-9 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center">
                <Clock size={17} />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
                {formatINR(activePending)}
              </h3>
              <p className="text-xs text-rose-600 mt-1 font-bold">
                Pending before ceremonies
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-rose-100 flex items-center justify-between text-[11px] text-slate-600">
            <span>Outstanding:</span>
            <span className="font-bold text-rose-700">{100 - percentPaid}% remaining</span>
          </div>
        </div>

        {/* Card 4: Inter-Family Net Settlement */}
        <div className={`rounded-3xl p-5 border-2 shadow-md flex flex-col justify-between transition-all ${
          summary.netBalance > 0 
            ? 'bg-rose-50/90 border-rose-300' 
            : summary.netBalance < 0 
            ? 'bg-blue-50/90 border-blue-300' 
            : 'bg-purple-50/90 border-purple-300'
        }`}>
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-black uppercase tracking-wider text-slate-800">
                Family Settlement Ledger
              </span>
              <div className="w-9 h-9 rounded-2xl bg-white shadow-xs flex items-center justify-center text-purple-600 border border-slate-200">
                <ArrowRightLeft size={17} />
              </div>
            </div>
            <div className="mt-3">
              {summary.netBalance > 0 ? (
                <>
                  <h3 className="text-xl sm:text-2xl font-black text-rose-700 tracking-tight">
                    Harsha owes Bhuvesh {formatINR(summary.netBalance)}
                  </h3>
                  <p className="text-xs text-rose-600 mt-1 font-bold">
                    Bhuvesh fronted shared vendor advances.
                  </p>
                </>
              ) : summary.netBalance < 0 ? (
                <>
                  <h3 className="text-xl sm:text-2xl font-black text-blue-700 tracking-tight">
                    Bhuvesh owes Harsha {formatINR(Math.abs(summary.netBalance))}
                  </h3>
                  <p className="text-xs text-blue-600 mt-1 font-bold">
                    Harsha fronted shared vendor advances.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-xl sm:text-2xl font-black text-purple-700 tracking-tight">
                    Perfect Harmony 🌸
                  </h3>
                  <p className="text-xs text-purple-600 mt-1 font-bold">
                    Both sides have paid exact split amounts!
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-black/10 text-[11px] text-slate-600 font-medium">
            Self-balancing net reimbursement.
          </div>
        </div>

      </div>
    </div>
  );
};
