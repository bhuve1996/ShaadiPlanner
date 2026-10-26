'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  SlidersHorizontal,
  CheckCircle2,
  Clock,
  ExternalLink,
  ChevronRight,
  TrendingDown,
  TrendingUp
} from 'lucide-react';
import { ExpenseItem, ExpenseCategory, WeddingEvent, SplitType } from '@/types/wedding';
import { CategoryIcon } from './CategoryIcon';
import { computeExpenseShares } from '@/lib/calculator';
import { formatINR } from '@/lib/constants';
import { ExpenseEditModal } from './ExpenseEditModal';

interface ExpenseTableProps {
  expenses: ExpenseItem[];
  groomGuestCount: number;
  brideGuestCount: number;
  onUpdateExpense: (item: ExpenseItem) => void;
  onDeleteExpense: (id: string) => void;
  onAddNewExpense: (item: ExpenseItem) => void;
  sideFilter: 'ALL' | 'GROOM' | 'BRIDE';
}

const ALL_CATEGORIES: ExpenseCategory[] = [
  'Venue & Accommodation',
  'Catering & Dining',
  'Decor & Production',
  'Photography & Cinema',
  'Attire, Jewelry & MUA',
  'Music & Entertainment',
  'Logistics & Shuttles',
  'Gifts, Shagun & Favors',
  'Ritual & Puja Items',
  'Invitations & Miscellaneous',
];

const ALL_EVENTS: WeddingEvent[] = [
  'All Events',
  'Roka / Engagement',
  'Mehendi',
  'Haldi',
  'Sangeet & Cocktail',
  'Baraat & Wedding Pheras',
  'Reception',
];

export const ExpenseTable: React.FC<ExpenseTableProps> = ({
  expenses,
  groomGuestCount,
  brideGuestCount,
  onUpdateExpense,
  onDeleteExpense,
  onAddNewExpense,
  sideFilter,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedEvent, setSelectedEvent] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  
  // Modal states
  const [editingItem, setEditingItem] = useState<ExpenseItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Filter expenses
  const filteredExpenses = expenses.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.vendorName && item.vendorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesEvent = selectedEvent === 'ALL' || item.event === selectedEvent;
    const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;

    // Filter by active perspective (Groom only, Bride only, or joint)
    let matchesSide = true;
    if (sideFilter === 'GROOM') {
      matchesSide = item.splitType !== 'BRIDE_ONLY';
    } else if (sideFilter === 'BRIDE') {
      matchesSide = item.splitType !== 'GROOM_ONLY';
    }

    return matchesSearch && matchesCategory && matchesEvent && matchesStatus && matchesSide;
  });

  // Calculate quick stats on filtered data
  const filteredTotalCost = filteredExpenses.reduce((sum, x) => sum + (x.actualCost || x.estimatedCost || 0), 0);
  const filteredTotalPaid = filteredExpenses.reduce((sum, x) => sum + (x.paidAmount || 0), 0);

  const handleOpenAddModal = () => {
    const template: ExpenseItem = {
      id: `exp-${Date.now()}`,
      name: '',
      category: 'Venue & Accommodation',
      event: 'Baraat & Wedding Pheras',
      vendorName: '',
      estimatedCost: 100000,
      actualCost: 100000,
      paidAmount: 0,
      splitType: 'EQUAL_50_50',
      paidBy: 'SHARED',
      status: 'Estimated',
      notes: '',
      dueDate: '',
    };
    setEditingItem(template);
    setShowAddModal(true);
  };

  const handleSaveModal = (savedItem: ExpenseItem) => {
    if (showAddModal) {
      onAddNewExpense(savedItem);
      setShowAddModal(false);
    } else {
      onUpdateExpense(savedItem);
    }
    setEditingItem(null);
  };

  return (
    <div className="space-y-4">
      {/* Table Container */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden transition-all">
        
        {/* Top Control Bar */}
        <div className="p-5 sm:p-6 border-b border-stone-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-gradient-to-r from-stone-50/50 via-white to-amber-50/30">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold tracking-tight text-stone-900">
                Expense & Split Registry
              </h2>
              <span className="text-xs bg-amber-100 text-amber-900 font-bold px-2.5 py-0.5 rounded-full border border-amber-200">
                {filteredExpenses.length} items
              </span>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              Click any row or edit icon to modify costs, vendors, payment progress, or split ratios.
            </p>
          </div>

          {/* Action Buttons & Search */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search vendor, item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 pr-3.5 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 w-48 sm:w-60 shadow-xs"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-700 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-xs"
            >
              <option value="ALL">All Categories</option>
              {ALL_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Event Filter */}
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="text-xs bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-700 font-medium focus:outline-none focus:ring-2 focus:ring-amber-500/20 shadow-xs"
            >
              <option value="ALL">All Events</option>
              {ALL_EVENTS.map(ev => (
                <option key={ev} value={ev}>{ev}</option>
              ))}
            </select>

            {/* Add Item Button */}
            <button
              onClick={handleOpenAddModal}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 active:scale-95 text-white text-xs font-bold shadow-md shadow-amber-600/20 transition-all cursor-pointer"
            >
              <Plus size={16} />
              <span>Add Expense</span>
            </button>
          </div>
        </div>

        {/* Quick Filter Summary Pill */}
        <div className="px-6 py-2.5 bg-stone-50/70 border-b border-stone-100 flex flex-wrap items-center justify-between text-xs text-stone-600 gap-2">
          <div className="flex items-center gap-4">
            <span>Showing: <strong>{filteredExpenses.length}</strong> entries</span>
            <span>Total Value: <strong className="text-stone-900 font-bold">{formatINR(filteredTotalCost)}</strong></span>
            <span>Paid: <strong className="text-emerald-700 font-bold">{formatINR(filteredTotalPaid)}</strong></span>
            <span>Remaining: <strong className="text-amber-700 font-bold">{formatINR(filteredTotalCost - filteredTotalPaid)}</strong></span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-[11px] text-stone-400 uppercase font-semibold">Filter Status:</span>
            {['ALL', 'Estimated', 'Partially Paid', 'Settled'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2 py-0.5 rounded-lg text-[11px] font-medium transition-colors ${
                  statusFilter === st 
                    ? 'bg-amber-600 text-white' 
                    : 'bg-white border border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50/80 text-stone-500 uppercase tracking-wider text-[11px] font-bold border-b border-stone-200/80">
                <th className="py-3.5 px-5">Expense & Details</th>
                <th className="py-3.5 px-3">Ceremony</th>
                <th className="py-3.5 px-4 text-right">Actual Cost</th>
                <th className="py-3.5 px-4 text-center">Split Rule</th>
                <th className="py-3.5 px-4 text-right text-blue-700">Groom Liability</th>
                <th className="py-3.5 px-4 text-right text-rose-700">Bride Liability</th>
                <th className="py-3.5 px-4">Payment & Paid By</th>
                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredExpenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-stone-400">
                    <div className="max-w-xs mx-auto">
                      <p className="text-sm font-semibold text-stone-600 mb-1">No matching expenses found</p>
                      <p className="text-xs text-stone-400 mb-3">Try adjusting your search terms or filters above.</p>
                      <button
                        onClick={handleOpenAddModal}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 text-white font-semibold text-xs"
                      >
                        <Plus size={14} /> Add new expense
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredExpenses.map((item) => {
                  const { groomDue, brideDue, groomPercent, bridePercent } = computeExpenseShares(
                    item,
                    groomGuestCount,
                    brideGuestCount
                  );

                  const isFullyPaid = item.paidAmount >= item.actualCost && item.actualCost > 0;
                  const percentPaid = Math.min(100, Math.round((item.paidAmount / (item.actualCost || 1)) * 100));

                  return (
                    <tr 
                      key={item.id} 
                      className="group hover:bg-amber-50/40 transition-colors cursor-pointer"
                      onClick={() => {
                        setEditingItem(item);
                        setShowAddModal(false);
                      }}
                    >
                      {/* Item Name + Category */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 p-2 rounded-xl bg-stone-100 group-hover:bg-amber-100/70 transition-colors">
                            <CategoryIcon category={item.category} size={18} />
                          </div>
                          <div>
                            <div className="font-bold text-stone-900 group-hover:text-amber-800 transition-colors text-[13px] flex items-center gap-1.5">
                              <span>{item.name}</span>
                              <Edit3 size={12} className="opacity-0 group-hover:opacity-70 text-amber-600 transition-opacity" />
                            </div>
                            <div className="text-[11px] text-stone-500 mt-0.5 flex flex-wrap items-center gap-2">
                              <span className="font-medium text-stone-600">{item.category}</span>
                              {item.vendorName && (
                                <>
                                  <span className="text-stone-300">•</span>
                                  <span className="font-semibold text-stone-700 bg-stone-100 px-1.5 py-0.2 rounded">
                                    {item.vendorName}
                                  </span>
                                </>
                              )}
                              {item.dueDate && (
                                <>
                                  <span className="text-stone-300">•</span>
                                  <span className="text-amber-700 flex items-center gap-1">
                                    <Clock size={10} /> Due: {item.dueDate}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Event Tag */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span className="inline-block px-2.5 py-1 rounded-lg bg-stone-100 text-stone-700 text-[11px] font-semibold border border-stone-200/50">
                          {item.event}
                        </span>
                      </td>

                      {/* Actual Cost */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="font-bold text-stone-900 text-sm">
                          {formatINR(item.actualCost || item.estimatedCost)}
                        </div>
                        {item.estimatedCost !== item.actualCost && item.estimatedCost > 0 && (
                          <div className="text-[10px] text-stone-400">
                            Est: {formatINR(item.estimatedCost)}
                          </div>
                        )}
                      </td>

                      {/* Split Type Selector */}
                      <td 
                        className="py-3.5 px-4 text-center whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <select
                          value={item.splitType}
                          onChange={(e) => {
                            onUpdateExpense({
                              ...item,
                              splitType: e.target.value as SplitType,
                            });
                          }}
                          className={`text-xs font-semibold px-2.5 py-1 rounded-xl border focus:outline-none transition-all shadow-2xs ${
                            item.splitType === 'EQUAL_50_50' 
                              ? 'bg-amber-50 text-amber-900 border-amber-200 hover:bg-amber-100'
                              : item.splitType === 'GUEST_RATIO'
                              ? 'bg-purple-50 text-purple-900 border-purple-200 hover:bg-purple-100'
                              : item.splitType === 'GROOM_ONLY'
                              ? 'bg-blue-50 text-blue-900 border-blue-200 hover:bg-blue-100'
                              : 'bg-rose-50 text-rose-900 border-rose-200 hover:bg-rose-100'
                          }`}
                        >
                          <option value="EQUAL_50_50">50 : 50 Split</option>
                          <option value="GUEST_RATIO">Guest Ratio ({groomPercent}% : {bridePercent}%)</option>
                          <option value="GROOM_ONLY">100% Groom Side</option>
                          <option value="BRIDE_ONLY">100% Bride Side</option>
                        </select>
                      </td>

                      {/* Groom Share */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="font-bold text-blue-700 text-sm">
                          {formatINR(groomDue)}
                        </div>
                        <div className="text-[10px] text-stone-500 font-medium">
                          {groomPercent}% share
                        </div>
                      </td>

                      {/* Bride Share */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="font-bold text-rose-700 text-sm">
                          {formatINR(brideDue)}
                        </div>
                        <div className="text-[10px] text-stone-500 font-medium">
                          {bridePercent}% share
                        </div>
                      </td>

                      {/* Payment & Status */}
                      <td 
                        className="py-3.5 px-4 whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex flex-col gap-1 w-36">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-semibold text-stone-700">
                              {formatINR(item.paidAmount)}
                            </span>
                            <span className="text-[10px] text-stone-500">
                              {percentPaid}%
                            </span>
                          </div>
                          <div className="w-full bg-stone-100 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-300 ${
                                isFullyPaid ? 'bg-emerald-500' : 'bg-amber-500'
                              }`} 
                              style={{ width: `${percentPaid}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-stone-500">
                            <span>By: <strong>{item.paidBy === 'SHARED' ? 'Both' : item.paidBy}</strong></span>
                            <span className={`font-semibold ${
                              item.status === 'Settled' 
                                ? 'text-emerald-700' 
                                : item.status === 'Partially Paid' 
                                ? 'text-amber-700' 
                                : 'text-stone-500'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Actions */}
                      <td 
                        className="py-3.5 px-4 text-center whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => {
                              setEditingItem(item);
                              setShowAddModal(false);
                            }}
                            className="p-1.5 rounded-lg text-stone-500 hover:text-amber-700 hover:bg-amber-100/60 transition-colors"
                            title="Edit full expense"
                          >
                            <Edit3 size={15} />
                          </button>
                          <button
                            onClick={() => {
                              if (confirm(`Delete "${item.name}"?`)) {
                                onDeleteExpense(item.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors"
                            title="Delete expense"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit & Add Expense Modal */}
      <ExpenseEditModal
        item={editingItem}
        isOpen={Boolean(editingItem)}
        onClose={() => {
          setEditingItem(null);
          setShowAddModal(false);
        }}
        onSave={handleSaveModal}
        onDelete={onDeleteExpense}
        groomGuestCount={groomGuestCount}
        brideGuestCount={brideGuestCount}
      />
    </div>
  );
};
