'use client';

import React from 'react';
import { 
  IndianRupee, 
  Users, 
  CheckCircle2, 
  Clock, 
  ArrowRightLeft,
  Sparkles,
  ShieldCheck,
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
      {/* Top Smart Perspective Pills (Mutual vs Groom vs Bride) */}
      <div className="bg-[#121624]/90 backdrop-blur-xl p-3 sm:p-4 rounded-3xl border border-amber-500/20 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-3">
        
        {/* Family Perspective Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-amber-200/70 mr-1 flex items-center gap-1.5">
            <Scale size={14} className="text-amber-400" />
            <span>Family Scope:</span>
          </span>

          <div className="inline-flex rounded-2xl bg-[#090B12] p-1 border border-white/5 shadow-inner">
            
            {/* 1. Mutual / Both */}
            <button
              onClick={() => onSideChange('ALL')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeSide === 'ALL'
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-black shadow-lg shadow-amber-500/20'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <span>🤝</span>
              <span>Mutual & Joint ({formatLakh(summary.totalActual)})</span>
            </button>

            {/* 2. Groom Bhuvesh */}
            <button
              onClick={() => onSideChange('GROOM')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeSide === 'GROOM'
                  ? 'bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-black shadow-lg shadow-blue-500/25'
                  : 'text-slate-400 hover:text-blue-300'
              }`}
            >
              <span>🤵</span>
              <span>Bhuvesh's Side ({formatLakh(summary.groomShareDue)})</span>
            </button>

            {/* 3. Bride Harsha */}
            <button
              onClick={() => onSideChange('BRIDE')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                activeSide === 'BRIDE'
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white font-black shadow-lg shadow-rose-500/25'
                  : 'text-slate-400 hover:text-rose-300'
              }`}
            >
              <span>👰</span>
              <span>Harsha's Side ({formatLakh(summary.brideShareDue)})</span>
            </button>

          </div>
        </div>

        {/* Guest Ratio Pill */}
        <div 
          onClick={onOpenSettings}
          className="flex items-center gap-2.5 text-xs text-slate-300 bg-[#161B2E] hover:bg-[#1E243C] border border-amber-500/30 px-4 py-2 rounded-2xl cursor-pointer transition-all shadow-xs group"
          title="Click to adjust guest ratios"
        >
          <Users className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
          <span>
            Split Ratio: <strong className="text-blue-400">{settings.groomGuestCount} Groom</strong> ({summary.guestRatioGroomPercent}%) : <strong className="text-rose-400">{settings.brideGuestCount} Bride</strong> ({summary.guestRatioBridePercent}%)
          </span>
          <span className="text-[10px] bg-amber-400/20 text-amber-300 border border-amber-400/40 px-2 py-0.5 rounded-full font-bold">
            Edit
          </span>
        </div>

      </div>

      {/* KPI Cards in Luxury Glassmorphism */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* Card 1: Total Liability */}
        <div className="bg-[#121624]/90 backdrop-blur-xl rounded-3xl p-5 border border-white/10 shadow-xl flex flex-col justify-between hover:border-amber-400/50 transition-all group">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {activeSide === 'ALL' ? 'Total Combined Budget' : activeSide === 'GROOM' ? "Bhuvesh's Total Share" : "Harsha's Total Share"}
              </span>
              <div className="w-9 h-9 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center">
                <IndianRupee size={17} />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {formatINR(activeDue)}
              </h3>
              <p className="text-xs text-slate-400 mt-1 font-medium">
                {activeSide === 'ALL' ? (
                  <span>Target: <strong className="text-amber-300">{formatLakh(settings.totalTargetBudget)}</strong></span>
                ) : (
                  <span>~{Math.round((activeDue / (summary.totalActual || 1)) * 100)}% of joint expenses</span>
                )}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
            <span>Scope:</span>
            <span className="font-bold text-amber-300">
              {activeSide === 'ALL' ? 'Mutual & Joint Weddings' : activeSide === 'GROOM' ? 'Groom Obligations' : 'Bride Obligations'}
            </span>
          </div>
        </div>

        {/* Card 2: Advance Paid */}
        <div className="bg-[#121624]/90 backdrop-blur-xl rounded-3xl p-5 border border-white/10 shadow-xl flex flex-col justify-between hover:border-emerald-500/50 transition-all">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {activeSide === 'ALL' ? 'Total Cleared Advances' : activeSide === 'GROOM' ? "Bhuvesh Paid" : "Harsha Paid"}
              </span>
              <div className="w-9 h-9 rounded-2xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 size={17} />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl sm:text-3xl font-black text-emerald-400 tracking-tight">
                {formatINR(activePaid)}
              </h3>
              <p className="text-xs text-emerald-400/90 mt-1 font-semibold">
                {percentPaid}% of dues paid
              </p>
            </div>
          </div>

          <div className="mt-4">
            <div className="w-full bg-white/5 rounded-full h-2 overflow-hidden border border-white/5">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full transition-all duration-500" 
                style={{ width: `${percentPaid}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: Pending Balance */}
        <div className="bg-[#121624]/90 backdrop-blur-xl rounded-3xl p-5 border border-white/10 shadow-xl flex flex-col justify-between hover:border-rose-500/50 transition-all">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                {activeSide === 'ALL' ? 'Remaining Vendor Dues' : activeSide === 'GROOM' ? "Bhuvesh Remaining" : "Harsha Remaining"}
              </span>
              <div className="w-9 h-9 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center">
                <Clock size={17} />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                {formatINR(activePending)}
              </h3>
              <p className="text-xs text-rose-400 mt-1 font-bold">
                Due before ceremonies
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-[11px] text-slate-400">
            <span>Outstanding:</span>
            <span className="font-bold text-rose-400">{100 - percentPaid}% remaining</span>
          </div>
        </div>

        {/* Card 4: Inter-Family Net Settlement */}
        <div className={`rounded-3xl p-5 border shadow-xl flex flex-col justify-between backdrop-blur-xl transition-all ${
          summary.netBalance > 0 
            ? 'bg-rose-950/40 border-rose-500/30' 
            : summary.netBalance < 0 
            ? 'bg-blue-950/40 border-blue-500/30' 
            : 'bg-emerald-950/40 border-emerald-500/30'
        }`}>
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Settlement Balance
              </span>
              <div className="w-9 h-9 rounded-2xl bg-white/10 flex items-center justify-center border border-white/10 text-amber-400">
                <ArrowRightLeft size={17} />
              </div>
            </div>
            <div className="mt-3">
              {summary.netBalance > 0 ? (
                <>
                  <h3 className="text-xl sm:text-2xl font-black text-rose-300 tracking-tight">
                    Harsha owes Bhuvesh {formatINR(summary.netBalance)}
                  </h3>
                  <p className="text-xs text-rose-400 mt-1 font-medium">
                    Bhuvesh side advanced joint payments.
                  </p>
                </>
              ) : summary.netBalance < 0 ? (
                <>
                  <h3 className="text-xl sm:text-2xl font-black text-blue-300 tracking-tight">
                    Bhuvesh owes Harsha {formatINR(Math.abs(summary.netBalance))}
                  </h3>
                  <p className="text-xs text-blue-400 mt-1 font-medium">
                    Harsha side advanced joint payments.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-xl sm:text-2xl font-black text-emerald-300 tracking-tight">
                    Equilibrium 🤝
                  </h3>
                  <p className="text-xs text-emerald-400 mt-1 font-medium">
                    Both sides are in exact proportion!
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/5 text-[11px] text-slate-400 font-medium">
            Auto-reconciled inter-family ledger.
          </div>
        </div>

      </div>
    </div>
  );
};
