'use client';

import React from 'react';
import { 
  IndianRupee, 
  Scale, 
  Users, 
  CheckCircle2, 
  Clock, 
  TrendingUp, 
  ArrowRightLeft 
} from 'lucide-react';
import { SplitCalculation } from '@/lib/calculator';
import { WeddingSettings } from '@/types/wedding';
import { formatINR, formatLakh } from '@/lib/constants';

interface DashboardStatsProps {
  summary: SplitCalculation;
  settings: WeddingSettings;
  activeSide: 'ALL' | 'GROOM' | 'BRIDE';
  onSideChange: (side: 'ALL' | 'GROOM' | 'BRIDE') => void;
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({
  summary,
  settings,
  activeSide,
  onSideChange,
}) => {
  const percentSpent = Math.min(
    100, 
    Math.round((summary.totalActual / (settings.totalTargetBudget || 1)) * 100)
  );

  return (
    <div className="space-y-4">
      {/* View Switcher: Overall vs Groom vs Bride */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3 rounded-2xl border border-amber-100 shadow-sm">
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold uppercase tracking-wider text-amber-800/70">
            Family Perspective:
          </span>
          <div className="inline-flex rounded-xl bg-amber-50/70 p-1 border border-amber-200/50">
            <button
              onClick={() => onSideChange('ALL')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                activeSide === 'ALL'
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'text-stone-700 hover:text-stone-900'
              }`}
            >
              Consolidated (Both Sides)
            </button>
            <button
              onClick={() => onSideChange('GROOM')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeSide === 'GROOM'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-stone-700 hover:text-blue-700'
              }`}
            >
              <span>🤵</span> Groom ({settings.groomName.split(' ')[0]})
            </button>
            <button
              onClick={() => onSideChange('BRIDE')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
                activeSide === 'BRIDE'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-stone-700 hover:text-rose-700'
              }`}
            >
              <span>👰</span> Bride ({settings.brideName.split(' ')[0]})
            </button>
          </div>
        </div>

        {/* Dynamic Guest Ratio Indicator */}
        <div className="flex items-center gap-2 text-xs text-stone-600 bg-stone-50 px-3 py-1.5 rounded-lg border border-stone-200">
          <Users className="w-4 h-4 text-amber-600" />
          <span>
            Guests: <strong className="text-blue-700">{settings.groomGuestCount} Groom</strong> ({summary.guestRatioGroomPercent}%) : <strong className="text-rose-700">{settings.brideGuestCount} Bride</strong> ({summary.guestRatioBridePercent}%)
          </span>
        </div>
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Budget vs Actual */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs relative overflow-hidden">
          <div className="flex justify-between items-start">
            <p className="text-xs font-medium text-stone-500 uppercase tracking-wide">
              {activeSide === 'ALL' ? 'Total Wedding Cost' : activeSide === 'GROOM' ? "Groom's Total Due" : "Bride's Total Due"}
            </p>
            <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
              <IndianRupee size={16} />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-bold text-stone-900">
              {formatINR(activeSide === 'ALL' ? summary.totalActual : activeSide === 'GROOM' ? summary.groomShareDue : summary.brideShareDue)}
            </h3>
            <p className="text-xs text-stone-500 mt-1 flex items-center gap-1">
              {activeSide === 'ALL' && (
                <>
                  <span>Target: {formatLakh(settings.totalTargetBudget)}</span>
                  <span className={`font-semibold ${percentSpent > 100 ? 'text-red-500' : 'text-emerald-600'}`}>
                    ({percentSpent}% used)
                  </span>
                </>
              )}
              {activeSide === 'GROOM' && (
                <span>~{Math.round((summary.groomShareDue / (summary.totalActual || 1)) * 100)}% of joint expenses</span>
              )}
              {activeSide === 'BRIDE' && (
                <span>~{Math.round((summary.brideShareDue / (summary.totalActual || 1)) * 100)}% of joint expenses</span>
              )}
            </p>
          </div>
          {/* Micro Progress bar */}
          <div className="w-full bg-stone-100 rounded-full h-1.5 mt-3 overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ${percentSpent > 100 ? 'bg-red-500' : 'bg-amber-500'}`} 
              style={{ width: `${Math.min(100, percentSpent)}%` }}
            />
          </div>
        </div>

        {/* Card 2: Total Paid Out */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
          <div className="flex justify-between items-start">
            <p className="text-xs font-medium text-stone-500 uppercase tracking-wide">
              {activeSide === 'ALL' ? 'Advances / Total Paid' : activeSide === 'GROOM' ? "Groom Paid to Vendors" : "Bride Paid to Vendors"}
            </p>
            <div className="w-8 h-8 rounded-full bg-emerald-50 flex items-center justify-center text-emerald-600">
              <CheckCircle2 size={16} />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-bold text-emerald-700">
              {formatINR(activeSide === 'ALL' ? summary.totalPaid : activeSide === 'GROOM' ? summary.groomSharePaid : summary.brideSharePaid)}
            </h3>
            <p className="text-xs text-emerald-600/90 mt-1">
              {Math.round(((activeSide === 'ALL' ? summary.totalPaid : activeSide === 'GROOM' ? summary.groomSharePaid : summary.brideSharePaid) / ((activeSide === 'ALL' ? summary.totalActual : activeSide === 'GROOM' ? summary.groomShareDue : summary.brideShareDue) || 1)) * 100)}% cleared
            </p>
          </div>
        </div>

        {/* Card 3: Pending Balance */}
        <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs">
          <div className="flex justify-between items-start">
            <p className="text-xs font-medium text-stone-500 uppercase tracking-wide">
              {activeSide === 'ALL' ? 'Remaining Balance Due' : activeSide === 'GROOM' ? "Groom's Pending" : "Bride's Pending"}
            </p>
            <div className="w-8 h-8 rounded-full bg-amber-50 flex items-center justify-center text-amber-600">
              <Clock size={16} />
            </div>
          </div>
          <div className="mt-2">
            <h3 className="text-2xl font-bold text-stone-900">
              {formatINR(activeSide === 'ALL' ? summary.totalPending : activeSide === 'GROOM' ? summary.groomSharePending : summary.brideSharePending)}
            </h3>
            <p className="text-xs text-amber-600 font-medium mt-1">
              Due across booked vendors
            </p>
          </div>
        </div>

        {/* Card 4: Inter-Family Reconciliation / Settlement */}
        <div className={`rounded-2xl p-4 border shadow-xs transition-colors ${
          summary.netBalance > 0 
            ? 'bg-rose-50/50 border-rose-200' 
            : summary.netBalance < 0 
            ? 'bg-blue-50/50 border-blue-200' 
            : 'bg-emerald-50/50 border-emerald-200'
        }`}>
          <div className="flex justify-between items-start">
            <p className="text-xs font-semibold uppercase tracking-wide text-stone-700">
              Inter-Family Settlement
            </p>
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-xs">
              <ArrowRightLeft size={16} className={summary.netBalance !== 0 ? 'text-amber-600' : 'text-emerald-600'} />
            </div>
          </div>
          <div className="mt-2">
            {summary.netBalance > 0 ? (
              <>
                <h3 className="text-xl font-bold text-rose-700">
                  Bride owes Groom {formatINR(summary.netBalance)}
                </h3>
                <p className="text-xs text-stone-600 mt-1">
                  Groom side advanced shared payments.
                </p>
              </>
            ) : summary.netBalance < 0 ? (
              <>
                <h3 className="text-xl font-bold text-blue-700">
                  Groom owes Bride {formatINR(Math.abs(summary.netBalance))}
                </h3>
                <p className="text-xs text-stone-600 mt-1">
                  Bride side advanced shared payments.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-xl font-bold text-emerald-700">
                  Perfect Equilibrium 🤝
                </h3>
                <p className="text-xs text-stone-600 mt-1">
                  Both sides have settled exact proportions!
                </p>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

