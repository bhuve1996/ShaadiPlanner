'use client';

import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend
} from 'recharts';
import { ExpenseItem, ExpenseCategory } from '@/types/wedding';
import { CATEGORY_COLORS, formatINR } from '@/lib/constants';

interface BudgetChartsProps {
  expenses: ExpenseItem[];
  groomGuestCount: number;
  brideGuestCount: number;
  showGold?: boolean;
  showShagun?: boolean;
}

export const BudgetCharts: React.FC<BudgetChartsProps> = ({
  expenses,
  groomGuestCount,
  brideGuestCount,
  showGold = false,
  showShagun = false,
}) => {
  // Filter expenses according to confidential visibility
  const visibleExpenses = expenses.filter(item => {
    const isGoldItem = item.category === 'Gold & Fine Jewelry' || item.name.toLowerCase().includes('gold');
    if (isGoldItem && !showGold) return false;
    const isShagunItem = item.category === 'Gifts, Shagun & Favors' || item.name.toLowerCase().includes('shagun');
    if (isShagunItem && !showShagun) return false;
    return true;
  });

  // Aggregate cost by Category
  const categoryTotals: Record<string, number> = {};
  let grandTotal = 0;

  visibleExpenses.forEach(item => {
    const cost = item.actualCost || item.estimatedCost || 0;
    categoryTotals[item.category] = (categoryTotals[item.category] || 0) + cost;
    grandTotal += cost;
  });

  const pieData = Object.entries(categoryTotals)
    .map(([name, value]) => ({
      name,
      value,
      percentage: grandTotal > 0 ? ((value / grandTotal) * 100).toFixed(1) : '0',
      color: CATEGORY_COLORS[name as ExpenseCategory] || '#94A3B8',
    }))
    .filter(d => d.value > 0)
    .sort((a, b) => b.value - a.value);

  // Aggregate cost by Occasion / Event
  const eventTotals: Record<string, { event: string; groom: number; bride: number; total: number }> = {};
  const totalGuests = (groomGuestCount + brideGuestCount) || 1;

  visibleExpenses.forEach(item => {
    const cost = item.actualCost || item.estimatedCost || 0;
    const ev = item.event;
    if (!eventTotals[ev]) {
      eventTotals[ev] = { event: ev, groom: 0, bride: 0, total: 0 };
    }

    let gPct = 0.5;
    if (item.splitType === 'GROOM_ONLY') gPct = 1.0;
    else if (item.splitType === 'BRIDE_ONLY') gPct = 0.0;
    else if (item.splitType === 'GUEST_RATIO') gPct = groomGuestCount / totalGuests;
    else if (item.splitType === 'CUSTOM') gPct = (item.customGroomPercent ?? 50) / 100;

    const gDue = Math.round(cost * gPct);
    const bDue = cost - gDue;

    eventTotals[ev].groom += gDue;
    eventTotals[ev].bride += bDue;
    eventTotals[ev].total += cost;
  });

  const barData = Object.values(eventTotals).sort((a, b) => b.total - a.total);

  // Specific key pillar summaries for quick intelligence
  const goldTotal = categoryTotals['Gold & Fine Jewelry'] || 0;
  const foodTotal = categoryTotals['Catering, Food & Sweets'] || 0;
  const venueTotal = categoryTotals['Venue & Accommodation'] || 0;
  const shagunTotal = categoryTotals['Gifts, Shagun & Favors'] || 0;
  const attireTotal = categoryTotals['Attire & Wardrobe'] || 0;

  return (
    <div className="space-y-6">
      {/* 1. Quick Intelligence Metric Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        <div className="bg-white dark:bg-[#11141D] p-3.5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>✨ Gold & Jewelry</span>
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
              {grandTotal > 0 ? ((goldTotal / grandTotal) * 100).toFixed(0) : 0}%
            </span>
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {formatINR(goldTotal)}
          </div>
        </div>

        <div className="bg-white dark:bg-[#11141D] p-3.5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>🏨 Venue & Stay</span>
            <span className="text-[10px] font-bold text-blue-600 dark:text-blue-400">
              {grandTotal > 0 ? ((venueTotal / grandTotal) * 100).toFixed(0) : 0}%
            </span>
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {formatINR(venueTotal)}
          </div>
        </div>

        <div className="bg-white dark:bg-[#11141D] p-3.5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>🍽️ Food & Sweets</span>
            <span className="text-[10px] font-bold text-orange-600 dark:text-orange-400">
              {grandTotal > 0 ? ((foodTotal / grandTotal) * 100).toFixed(0) : 0}%
            </span>
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {formatINR(foodTotal)}
          </div>
        </div>

        <div className="bg-white dark:bg-[#11141D] p-3.5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>🎁 Shagun & Gifts</span>
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400">
              {grandTotal > 0 ? ((shagunTotal / grandTotal) * 100).toFixed(0) : 0}%
            </span>
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {formatINR(shagunTotal)}
          </div>
        </div>

        <div className="bg-white dark:bg-[#11141D] p-3.5 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs">
          <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1">
            <span>👗 Attire & Wardrobe</span>
            <span className="text-[10px] font-bold text-pink-600 dark:text-pink-400">
              {grandTotal > 0 ? ((attireTotal / grandTotal) * 100).toFixed(0) : 0}%
            </span>
          </div>
          <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
            {formatINR(attireTotal)}
          </div>
        </div>
      </div>

      {/* 2. Visual Graphs */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown (Donut Chart) */}
        <div className="bg-white dark:bg-[#11141D] p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Category Distribution
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Total Portfolio: {formatINR(grandTotal)}
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={92}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#11141D', 
                    borderColor: 'rgba(255,255,255,0.1)', 
                    borderRadius: '10px', 
                    color: '#fff',
                    fontSize: '12px'
                  }}
                  formatter={(value: any) => [formatINR(Number(value) || 0), 'Amount']}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Legend listing all active categories */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-white/10 text-xs">
            {pieData.map((item) => (
              <div key={item.name} className="flex items-center justify-between py-0.5">
                <div className="flex items-center gap-2 truncate">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                  <span className="text-slate-700 dark:text-slate-300 truncate">{item.name}</span>
                </div>
                <div className="flex items-center gap-1.5 ml-2 font-mono text-[11px]">
                  <span className="font-semibold text-slate-900 dark:text-white">{formatINR(item.value)}</span>
                  <span className="text-[10px] text-slate-400">({item.percentage}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Occasion / Event Breakdown */}
        <div className="bg-white dark:bg-[#11141D] p-5 sm:p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-xs flex flex-col">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                Occasion Investment
              </h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                Ceremony allocation between Harsha & Bhuvi
              </p>
            </div>
          </div>

          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={barData}
                margin={{ top: 10, right: 10, left: -10, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(148, 163, 184, 0.15)" />
                <XAxis 
                  dataKey="event" 
                  tick={{ fontSize: 10, fill: '#64748B' }} 
                  angle={-18}
                  textAnchor="end"
                  interval={0}
                />
                <YAxis 
                  tick={{ fontSize: 10, fill: '#64748B' }}
                  tickFormatter={(val) => `₹${Math.round(val / 1000)}k`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#11141D', 
                    borderColor: 'rgba(255,255,255,0.1)', 
                    borderRadius: '10px', 
                    color: '#fff',
                    fontSize: '12px'
                  }}
                  formatter={(value: any, name: any) => [
                    formatINR(Number(value) || 0), 
                    name === 'bride' ? "Harsha's Share" : "Bhuvesh's Share"
                  ]}
                />
                <Legend 
                  verticalAlign="top" 
                  align="right" 
                  wrapperStyle={{ paddingBottom: '10px', fontSize: '11px' }}
                  formatter={(val) => val === 'bride' ? '👰 Harsha' : '🤵 Bhuvesh'}
                />
                <Bar dataKey="bride" name="bride" fill="#EC4899" stackId="a" radius={[0, 0, 3, 3]} />
                <Bar dataKey="groom" name="groom" fill="#3B82F6" stackId="a" radius={[3, 3, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Occasion summary list */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-4 pt-3 border-t border-slate-100 dark:border-white/10 text-xs">
            {barData.map((ev) => (
              <div key={ev.event} className="flex items-center justify-between py-0.5">
                <span className="text-slate-700 dark:text-slate-300 truncate">{ev.event}</span>
                <span className="font-semibold text-slate-900 dark:text-white ml-2 font-mono text-[11px]">
                  {formatINR(ev.total)}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
