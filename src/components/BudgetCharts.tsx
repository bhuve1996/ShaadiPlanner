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
}

export const BudgetCharts: React.FC<BudgetChartsProps> = ({
  expenses,
  groomGuestCount,
  brideGuestCount,
}) => {
  // Aggregate cost by Category
  const categoryTotals: Record<string, number> = {};
  expenses.forEach(item => {
    const cost = item.actualCost || item.estimatedCost || 0;
    categoryTotals[item.category] = (categoryTotals[item.category] || 0) + cost;
  });

  const pieData = Object.entries(categoryTotals)
    .map(([name, value]) => ({
      name,
      value,
      color: CATEGORY_COLORS[name as ExpenseCategory] || '#94A3B8',
    }))
    .filter(d => d.value > 0)
    .sort((a, b) => b.value - a.value);

  // Aggregate cost by Event
  const eventTotals: Record<string, { event: string; groom: number; bride: number }> = {};
  const totalGuests = (groomGuestCount + brideGuestCount) || 1;

  expenses.forEach(item => {
    const cost = item.actualCost || item.estimatedCost || 0;
    const ev = item.event;
    if (!eventTotals[ev]) {
      eventTotals[ev] = { event: ev, groom: 0, bride: 0 };
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
  });

  const barData = Object.values(eventTotals);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* Category Breakdown (Donut Chart) */}
      <div className="bg-[#121624]/90 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-white/10 shadow-xl flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white">
            Category Breakdown
          </h3>
          <span className="text-xs text-slate-400">Total wedding portfolio</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ backgroundColor: '#1E2438', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                formatter={(value: any) => [formatINR(Number(value) || 0), 'Total Spent']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend listing top categories */}
        <div className="grid grid-cols-2 gap-2.5 mt-4 pt-3 border-t border-white/10 text-xs">
          {pieData.slice(0, 6).map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-2 truncate">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-slate-300 truncate">{item.name}</span>
              </div>
              <span className="font-bold text-white ml-2">{formatINR(item.value)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Groom vs Bride Split across Events */}
      <div className="bg-[#121624]/90 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-white/10 shadow-xl flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-bold text-white">
            Event Share Breakdown
          </h3>
          <span className="text-xs text-slate-400">Bhuvesh vs Harsha</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              margin={{ top: 10, right: 10, left: -10, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="rgba(255,255,255,0.06)" />
              <XAxis 
                dataKey="event" 
                tick={{ fontSize: 10, fill: '#94A3B8' }} 
                angle={-18}
                textAnchor="end"
                interval={0}
              />
              <YAxis 
                tick={{ fontSize: 10, fill: '#94A3B8' }}
                tickFormatter={(val) => `₹${Math.round(val / 1000)}k`}
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#1E2438', borderColor: '#334155', borderRadius: '12px', color: '#fff' }}
                formatter={(value: any, name: any) => [
                  formatINR(Number(value) || 0), 
                  name === 'groom' ? "Bhuvesh's Share" : "Harsha's Share"
                ]}
              />
              <Legend 
                verticalAlign="top" 
                align="right" 
                wrapperStyle={{ paddingBottom: '10px', fontSize: '12px' }}
                formatter={(val) => val === 'groom' ? '🤵 Bhuvesh Share' : '👰 Harsha Share'}
              />
              <Bar dataKey="groom" name="groom" fill="#3B82F6" stackId="a" radius={[0, 0, 4, 4]} />
              <Bar dataKey="bride" name="bride" fill="#F43F5E" stackId="a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <p className="text-xs text-slate-400 mt-2 text-center">
          Stacked bars show total ceremony investment distributed between families.
        </p>
      </div>
    </div>
  );
};
