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
import { CategoryIcon } from './CategoryIcon';

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
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-stone-900">
            Category Breakdown
          </h3>
          <span className="text-xs text-stone-500">Expenses by department</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={95}
                paddingAngle={3}
                dataKey="value"
              >
                {pieData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip 
                formatter={(value: any) => [formatINR(Number(value) || 0), 'Total Spent']}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Legend listing top categories */}
        <div className="grid grid-cols-2 gap-2 mt-4 pt-3 border-t border-stone-100 text-xs">
          {pieData.slice(0, 6).map((item) => (
            <div key={item.name} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5 truncate">
                <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ backgroundColor: item.color }} />
                <span className="text-stone-600 truncate">{item.name}</span>
              </div>
              <span className="font-semibold text-stone-800 ml-2">{formatINR(item.value)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Groom vs Bride Split across Events (Stacked Bar Chart) */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs flex flex-col">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-stone-900">
            Split by Wedding Event
          </h3>
          <span className="text-xs text-stone-500">Groom vs Bride share</span>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={barData}
              margin={{ top: 10, right: 10, left: -10, bottom: 25 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
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
                formatter={(value: any, name: any) => [
                  formatINR(Number(value) || 0), 
                  name === 'groom' ? "Groom's Share" : "Bride's Share"
                ]}
              />
              <Legend 
                verticalAlign="top" 
                align="right" 
                wrapperStyle={{ paddingBottom: '10px', fontSize: '12px' }}
                formatter={(val) => val === 'groom' ? '🤵 Groom Share' : '👰 Bride Share'}
              />
              <Bar dataKey="groom" name="groom" fill="#2563EB" stackId="a" radius={[0, 0, 4, 4]} />
              <Bar dataKey="bride" name="bride" fill="#E11D48" stackId="a" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <p className="text-xs text-stone-500 mt-2 text-center">
          Bar heights show total event cost, divided by each side's contractual liability.
        </p>
      </div>
    </div>
  );
};

