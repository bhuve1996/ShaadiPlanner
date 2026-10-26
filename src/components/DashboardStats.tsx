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
  CreditCard
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
      {/* Perspective Filter & Guest Ratio Strip */}
      <div className="bg-white/80 backdrop-blur-md p-3.5 sm:p-4 rounded-3xl border border-stone-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left Side: Family Perspective Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold uppercase tracking-wider text-stone-500 mr-1">
            Perspective:
          </span>
          <div className="inline-flex rounded-2xl bg-stone-100 p-1 border border-stone-200/60 shadow-inner">
            <button
              onClick={() => onSideChange('ALL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                activeSide === 'ALL'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Consolidated (Both Sides)
            </button>
            <button
              onClick={() => onSideChange('GROOM')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeSide === 'GROOM'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-stone-600 hover:text-blue-700'
              }`}
            >
              <span>🤵</span> Groom ({settings.groomName.split(' ')[0]})
            </button>
            <button
              onClick={() => onSideChange('BRIDE')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                activeSide === 'BRIDE'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-stone-600 hover:text-rose-700'
              }`}
            >
              <span>👰</span> Bride ({settings.brideName.split(' ')[0]})
            </button>
          </div>
        </div>

        {/* Right Side: Guest Split pill with click to adjust */}
        <div 
          onClick={onOpenSettings}
          className="flex items-center gap-2.5 text-xs text-stone-700 bg-amber-50/80 hover:bg-amber-100/70 border border-amber-200/80 px-3.5 py-1.5 rounded-2xl cursor-pointer transition-all group"
          title="Click to adjust guest counts and ratios"
        >
          <Users className="w-4 h-4 text-amber-600 group-hover:scale-110 transition-transform" />
          <span>
            Guests: <strong className="text-blue-700 font-bold">{settings.groomGuestCount} Groom</strong> ({summary.guestRatioGroomPercent}%) : <strong className="text-rose-700 font-bold">{settings.brideGuestCount} Bride</strong> ({summary.guestRatioBridePercent}%)
          </span>
          <span className="text-[10px] bg-amber-200/60 text-amber-900 px-1.5 py-0.5 rounded-md font-semibold">
            Adjust
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Liability */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs relative overflow-hidden flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                {activeSide === 'ALL' ? 'Total Wedding Cost' : activeSide === 'GROOM' ? "Groom Total Due" : "Bride Total Due"}
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
                <IndianRupee size={16} />
              </div>
            </div>
            <div className="mt-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                {formatINR(activeDue)}
              </h3>
              <p className="text-xs text-stone-500 mt-1">
                {activeSide === 'ALL' ? (
                  <span>Budget Target: <strong>{formatLakh(settings.totalTargetBudget)}</strong></span>
                ) : (
                  <span>~{Math.round((activeDue / (summary.totalActual || 1)) * 100)}% of joint total budget</span>
                )}
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
            <span>Estimated Initial:</span>
            <span className="font-semibold text-stone-700">{formatINR(summary.totalEstimated)}</span>
          </div>
        </div>

        {/* Card 2: Advance Paid Out */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                {activeSide === 'ALL' ? 'Total Advances Paid' : activeSide === 'GROOM' ? "Groom Cleared" : "Bride Cleared"}
              </span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-700">
                <CheckCircle2 size={16} />
              </div>
            </div>
            <div className="mt-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-emerald-700 tracking-tight">
                {formatINR(activePaid)}
              </h3>
              <p className="text-xs text-emerald-600 mt-1 font-medium">
                {percentPaid}% of obligations paid
              </p>
            </div>
          </div>

          <div className="mt-4">
            <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
              <div 
                className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
                style={{ width: `${percentPaid}%` }}
              />
            </div>
          </div>
        </div>

        {/* Card 3: Pending Balance */}
        <div className="bg-white rounded-3xl p-5 border border-stone-200 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-400">
                {activeSide === 'ALL' ? 'Pending Vendor Dues' : activeSide === 'GROOM' ? "Groom Pending" : "Bride Pending"}
              </span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 flex items-center justify-center text-amber-700">
                <Clock size={16} />
              </div>
            </div>
            <div className="mt-2">
              <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight">
                {formatINR(activePending)}
              </h3>
              <p className="text-xs text-amber-700 mt-1 font-medium">
                Due before or on event dates
              </p>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-500">
            <span>Remaining to clear:</span>
            <span className="font-semibold text-stone-800">{100 - percentPaid}%</span>
          </div>
        </div>

        {/* Card 4: Inter-Family Settlement Reconciliation */}
        <div className={`rounded-3xl p-5 border shadow-xs flex flex-col justify-between transition-colors ${
          summary.netBalance > 0 
            ? 'bg-rose-50/70 border-rose-200' 
            : summary.netBalance < 0 
            ? 'bg-blue-50/70 border-blue-200' 
            : 'bg-emerald-50/70 border-emerald-200'
        }`}>
          <div>
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold uppercase tracking-wider text-stone-600">
                Inter-Family Settlement
              </span>
              <div className="w-8 h-8 rounded-xl bg-white flex items-center justify-center shadow-xs">
                <ArrowRightLeft size={16} className={summary.netBalance !== 0 ? 'text-amber-600' : 'text-emerald-600'} />
              </div>
            </div>
            <div className="mt-2">
              {summary.netBalance > 0 ? (
                <>
                  <h3 className="text-xl sm:text-2xl font-black text-rose-800 tracking-tight">
                    Bride owes Groom {formatINR(summary.netBalance)}
                  </h3>
                  <p className="text-xs text-rose-700 mt-1 font-medium">
                    Groom side fronted joint vendor payments.
                  </p>
                </>
              ) : summary.netBalance < 0 ? (
                <>
                  <h3 className="text-xl sm:text-2xl font-black text-blue-800 tracking-tight">
                    Groom owes Bride {formatINR(Math.abs(summary.netBalance))}
                  </h3>
                  <p className="text-xs text-blue-700 mt-1 font-medium">
                    Bride side fronted joint vendor payments.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-xl sm:text-2xl font-black text-emerald-800 tracking-tight">
                    Balanced 🤝
                  </h3>
                  <p className="text-xs text-emerald-700 mt-1 font-medium">
                    Both sides have paid exact split amounts!
                  </p>
                </>
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-black/5 text-[11px] text-stone-600">
            Self-balancing ledger based on payments.
          </div>
        </div>
      </div>
    </div>
  );
};
