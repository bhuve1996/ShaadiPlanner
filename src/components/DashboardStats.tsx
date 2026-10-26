'use client';

import React from 'react';
import { 
  IndianRupee, 
  Users, 
  CheckCircle2, 
  Clock, 
  ArrowRightLeft,
  Sparkles,
  TrendingUp,
  Percent
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
      {/* Perspective Filter & Auspicious Guest Split Strip */}
      <div className="bg-gradient-to-r from-amber-50 via-rose-50/70 to-amber-50 p-4 rounded-3xl border border-amber-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left Side: Family Perspective Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-black uppercase tracking-wider text-rose-950 flex items-center gap-1.5 mr-1">
            <span className="text-amber-600">🕉️</span> Family View:
          </span>
          <div className="inline-flex rounded-2xl bg-white/90 p-1.5 border border-amber-200 shadow-xs">
            <button
              onClick={() => onSideChange('ALL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all ${
                activeSide === 'ALL'
                  ? 'bg-gradient-to-r from-red-600 to-amber-600 text-white shadow-sm'
                  : 'text-stone-700 hover:text-red-700'
              }`}
            >
              Both Families (Combined)
            </button>
            <button
              onClick={() => onSideChange('GROOM')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                activeSide === 'GROOM'
                  ? 'bg-gradient-to-r from-blue-700 to-indigo-600 text-white shadow-sm'
                  : 'text-stone-700 hover:text-blue-800'
              }`}
            >
              <span>🤵</span> Groom ({settings.groomName.split(' ')[0]})
            </button>
            <button
              onClick={() => onSideChange('BRIDE')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                activeSide === 'BRIDE'
                  ? 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-sm'
                  : 'text-stone-700 hover:text-rose-700'
              }`}
            >
              <span>👰</span> Bride ({settings.brideName.split(' ')[0]})
            </button>
          </div>
        </div>

        {/* Right Side: Guest Split pill with click to adjust */}
        <div 
          onClick={onOpenSettings}
          className="flex items-center gap-2.5 text-xs text-stone-800 bg-white/95 hover:bg-amber-100/50 border border-amber-300 px-4 py-2 rounded-2xl cursor-pointer transition-all shadow-xs group"
          title="Click to adjust guest counts and ratios"
        >
          <Users className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
          <span>
            Guest Ratio: <strong className="text-blue-700 font-bold">{settings.groomGuestCount} Groom</strong> ({summary.guestRatioGroomPercent}%) : <strong className="text-rose-700 font-bold">{settings.brideGuestCount} Bride</strong> ({summary.guestRatioBridePercent}%)
          </span>
          <span className="text-[10px] bg-amber-500 text-white px-2 py-0.5 rounded-full font-bold shadow-2xs">
            Edit Ratios
          </span>
        </div>
      </div>

      {/* Auspicious Vibrant KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Liability */}
        <div className="bg-white rounded-3xl p-5 border-2 border-amber-200/80 shadow-sm relative overflow-hidden flex flex-col justify-between hover:border-amber-400 transition-all">
          <div className="absolute -top-6 -right-6 w-20 h-20 bg-amber-100/50 rounded-full blur-xl pointer-events-none" />
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-black uppercase tracking-wider text-amber-900">
                {activeSide === 'ALL' ? 'Total Wedding Budget' : activeSide === 'GROOM' ? "Groom Total Share" : "Bride Total Share"}
              </span>
              <div className="w-9 h-9 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                <IndianRupee size={17} />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                {formatINR(activeDue)}
              </h3>
              <p className="text-xs text-stone-600 mt-1 font-medium">
                {activeSide === 'ALL' ? (
                  <span>Budget Target: <strong className="text-amber-800">{formatLakh(settings.totalTargetBudget)}</strong></span>
                ) : (
                  <span>~{Math.round((activeDue / (summary.totalActual || 1)) * 100)}% of combined wedding expenditure</span>
                )}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-amber-100 flex items-center justify-between text-[11px] text-stone-600">
            <span>Estimated Baseline:</span>
            <span className="font-bold text-stone-800">{formatINR(summary.totalEstimated)}</span>
          </div>
        </div>

        {/* Card 2: Advance Paid Out */}
        <div className="bg-white rounded-3xl p-5 border-2 border-emerald-200/80 shadow-sm relative overflow-hidden flex flex-col justify-between hover:border-emerald-400 transition-all">
          <div className="absolute -top-6 -right-6 w-20 h-20 bg-emerald-100/50 rounded-full blur-xl pointer-events-none" />
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-black uppercase tracking-wider text-emerald-900">
                {activeSide === 'ALL' ? 'Advances / Total Cleared' : activeSide === 'GROOM' ? "Groom Cleared" : "Bride Cleared"}
              </span>
              <div className="w-9 h-9 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-xs">
                <CheckCircle2 size={17} />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl sm:text-3xl font-black text-emerald-700 tracking-tight">
                {formatINR(activePaid)}
              </h3>
              <p className="text-xs text-emerald-700 mt-1 font-semibold">
                {percentPaid}% of dues paid to vendors
              </p>
            </div>
          </div>

          <div className="mt-4">
            <div className="w-full bg-emerald-100/70 rounded-full h-2.5 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full transition-all duration-500" 
                style={{ width: `${percentPaid}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: Pending Balance */}
        <div className="bg-white rounded-3xl p-5 border-2 border-red-200/80 shadow-sm relative overflow-hidden flex flex-col justify-between hover:border-red-400 transition-all">
          <div className="absolute -top-6 -right-6 w-20 h-20 bg-red-100/50 rounded-full blur-xl pointer-events-none" />
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-black uppercase tracking-wider text-red-900">
                {activeSide === 'ALL' ? 'Remaining Vendor Dues' : activeSide === 'GROOM' ? "Groom Balance Due" : "Bride Balance Due"}
              </span>
              <div className="w-9 h-9 rounded-2xl bg-red-600 text-white flex items-center justify-center shadow-xs">
                <Clock size={17} />
              </div>
            </div>
            <div className="mt-3">
              <h3 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                {formatINR(activePending)}
              </h3>
              <p className="text-xs text-red-700 mt-1 font-bold">
                Due before or on ceremony day
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-red-100 flex items-center justify-between text-[11px] text-stone-600">
            <span>Remaining to clear:</span>
            <span className="font-bold text-red-700">{100 - percentPaid}% outstanding</span>
          </div>
        </div>

        {/* Card 4: Inter-Family Settlement Reconciliation */}
        <div className={`rounded-3xl p-5 border-2 shadow-sm flex flex-col justify-between transition-all ${
          summary.netBalance > 0 
            ? 'bg-rose-50/90 border-rose-300' 
            : summary.netBalance < 0 
            ? 'bg-blue-50/90 border-blue-300' 
            : 'bg-emerald-50/90 border-emerald-300'
        }`}>
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-black uppercase tracking-wider text-stone-800">
                Family Settlement Ledger
              </span>
              <div className="w-9 h-9 rounded-2xl bg-white flex items-center justify-center shadow-xs border border-stone-200">
                <ArrowRightLeft size={17} className={summary.netBalance !== 0 ? 'text-amber-600' : 'text-emerald-600'} />
              </div>
            </div>
            <div className="mt-3">
              {summary.netBalance > 0 ? (
                <>
                  <h3 className="text-xl sm:text-2xl font-black text-rose-800 tracking-tight">
                    Bride owes Groom {formatINR(summary.netBalance)}
                  </h3>
                  <p className="text-xs text-rose-700 mt-1 font-semibold">
                    Groom side paid more than their split share.
                  </p>
                </>
              ) : summary.netBalance < 0 ? (
                <>
                  <h3 className="text-xl sm:text-2xl font-black text-blue-800 tracking-tight">
                    Groom owes Bride {formatINR(Math.abs(summary.netBalance))}
                  </h3>
                  <p className="text-xs text-blue-700 mt-1 font-semibold">
                    Bride side paid more than their split share.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-xl sm:text-2xl font-black text-emerald-800 tracking-tight">
                    Equal Equilibrium 🤝
                  </h3>
                  <p className="text-xs text-emerald-700 mt-1 font-semibold">
                    Both sides have contributed exact split proportions!
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-black/10 text-[11px] text-stone-600 font-medium">
            Auto-calculated net reimbursement balance.
          </div>
        </div>
      </div>
    </div>
  );
};
