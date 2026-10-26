'use client';

import React, { useState } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Sliders, 
  ChevronDown, 
  Search, 
  Filter,
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { ExpenseItem, ExpenseCategory, WeddingEvent, SplitType } from '@/types/wedding';
import { CategoryIcon } from './CategoryIcon';
import { computeExpenseShares } from '@/lib/calculator';
import { formatINR } from '@/lib/constants';

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
  const [showAddModal, setShowAddModal] = useState(false);

  // New item form state
  const [newItem, setNewItem] = useState<Partial<ExpenseItem>>({
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
  });

  // Filter expenses
  const filteredExpenses = expenses.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.vendorName && item.vendorName.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
    const matchesEvent = selectedEvent === 'ALL' || item.event === selectedEvent;

    // Filter by active perspective (Groom only, Bride only, or joint)
    let matchesSide = true;
    if (sideFilter === 'GROOM') {
      matchesSide = item.splitType !== 'BRIDE_ONLY';
    } else if (sideFilter === 'BRIDE') {
      matchesSide = item.splitType !== 'GROOM_ONLY';
    }

    return matchesSearch && matchesCategory && matchesEvent && matchesSide;
  });

  const handleCreateNew = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newItem.name) return;

    const created: ExpenseItem = {
      id: `exp-${Date.now()}`,
      name: newItem.name || 'Untitled Item',
      category: (newItem.category as ExpenseCategory) || 'Venue & Accommodation',
      event: (newItem.event as WeddingEvent) || 'All Events',
      vendorName: newItem.vendorName || '',
      estimatedCost: Number(newItem.estimatedCost) || 0,
      actualCost: Number(newItem.actualCost) || 0,
      paidAmount: Number(newItem.paidAmount) || 0,
      splitType: (newItem.splitType as SplitType) || 'EQUAL_50_50',
      paidBy: (newItem.paidBy as any) || 'SHARED',
      status: (newItem.status as any) || 'Estimated',
      notes: newItem.notes || '',
      dueDate: newItem.dueDate || '',
    };

    onAddNewExpense(created);
    setShowAddModal(false);
    setNewItem({
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
    });
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
      {/* Header & Action Controls */}
      <div className="p-4 sm:p-5 border-b border-stone-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
            Detailed Expenses & Split Registry
            <span className="text-xs bg-amber-100 text-amber-800 font-semibold px-2 py-0.5 rounded-full">
              {filteredExpenses.length} items
            </span>
          </h2>
          <p className="text-xs text-stone-500 mt-0.5">
            Real-time split calculation per guest count, 50-50, or side-specific allocation.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Search bar */}
          <div className="relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search item, vendor..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 pr-3 py-1.5 text-xs bg-stone-50 border border-stone-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 w-44 sm:w-56"
            />
          </div>

          {/* Category Filter */}
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="text-xs bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-stone-700 focus:outline-none"
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
            className="text-xs bg-stone-50 border border-stone-200 rounded-xl px-2.5 py-1.5 text-stone-700 focus:outline-none"
          >
            <option value="ALL">All Events</option>
            {ALL_EVENTS.map(ev => (
              <option key={ev} value={ev}>{ev}</option>
            ))}
          </select>

          {/* Add Item Button */}
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus size={15} />
            <span>Add Expense</span>
          </button>
        </div>
      </div>

      {/* Expense Items Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs border-collapse">
          <thead>
            <tr className="bg-stone-50/80 text-stone-600 font-semibold border-b border-stone-200/80">
              <th className="py-3 px-4">Item & Category</th>
              <th className="py-3 px-3">Event</th>
              <th className="py-3 px-3 text-right">Actual Cost</th>
              <th className="py-3 px-3 text-center">Split Rule</th>
              <th className="py-3 px-3 text-right text-blue-700">Groom Share</th>
              <th className="py-3 px-3 text-right text-rose-700">Bride Share</th>
              <th className="py-3 px-3">Paid By / Status</th>
              <th className="py-3 px-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-stone-100">
            {filteredExpenses.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-10 text-center text-stone-400">
                  No matching expenses found.
                </td>
              </tr>
            ) : (
              filteredExpenses.map((item) => {
                const { groomDue, brideDue, groomPercent, bridePercent } = computeExpenseShares(
                  item,
                  groomGuestCount,
                  brideGuestCount
                );

                return (
                  <tr key={item.id} className="hover:bg-amber-50/30 transition-colors">
                    {/* Item Name + Category */}
                    <td className="py-3 px-4">
                      <div className="flex items-start gap-2.5">
                        <div className="mt-0.5">
                          <CategoryIcon category={item.category} size={16} />
                        </div>
                        <div>
                          <div className="font-semibold text-stone-900 leading-tight">
                            {item.name}
                          </div>
                          <div className="text-[11px] text-stone-500 mt-0.5 flex items-center gap-1.5">
                            <span>{item.category}</span>
                            {item.vendorName && (
                              <>
                                <span>•</span>
                                <span className="font-medium text-stone-700">{item.vendorName}</span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    {/* Event Tag */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <span className="inline-block px-2 py-0.5 rounded-md bg-stone-100 text-stone-700 text-[11px] font-medium">
                        {item.event}
                      </span>
                    </td>

                    {/* Actual Cost */}
                    <td className="py-3 px-3 text-right font-bold text-stone-900 whitespace-nowrap">
                      {formatINR(item.actualCost || item.estimatedCost)}
                      {item.paidAmount > 0 && (
                        <div className="text-[10px] text-emerald-600 font-normal">
                          Paid: {formatINR(item.paidAmount)}
                        </div>
                      )}
                    </td>

                    {/* Split Type Selector */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <select
                        value={item.splitType}
                        onChange={(e) => {
                          onUpdateExpense({
                            ...item,
                            splitType: e.target.value as SplitType,
                          });
                        }}
                        className={`text-[11px] font-medium px-2 py-1 rounded-lg border focus:outline-none transition-colors ${
                          item.splitType === 'EQUAL_50_50' 
                            ? 'bg-amber-50 text-amber-800 border-amber-200'
                            : item.splitType === 'GUEST_RATIO'
                            ? 'bg-purple-50 text-purple-800 border-purple-200'
                            : item.splitType === 'GROOM_ONLY'
                            ? 'bg-blue-50 text-blue-800 border-blue-200'
                            : 'bg-rose-50 text-rose-800 border-rose-200'
                        }`}
                      >
                        <option value="EQUAL_50_50">50 : 50 Split</option>
                        <option value="GUEST_RATIO">By Guest Count ({groomPercent}% : {bridePercent}%)</option>
                        <option value="GROOM_ONLY">100% Groom Side</option>
                        <option value="BRIDE_ONLY">100% Bride Side</option>
                      </select>
                    </td>

                    {/* Groom Share */}
                    <td className="py-3 px-3 text-right font-semibold text-blue-700 whitespace-nowrap">
                      {formatINR(groomDue)}
                      <div className="text-[10px] text-stone-500 font-normal">
                        ({groomPercent}%)
                      </div>
                    </td>

                    {/* Bride Share */}
                    <td className="py-3 px-3 text-right font-semibold text-rose-700 whitespace-nowrap">
                      {formatINR(brideDue)}
                      <div className="text-[10px] text-stone-500 font-normal">
                        ({bridePercent}%)
                      </div>
                    </td>

                    {/* Paid By & Status */}
                    <td className="py-3 px-3 whitespace-nowrap">
                      <div className="flex flex-col gap-0.5">
                        <select
                          value={item.paidBy}
                          onChange={(e) => {
                            onUpdateExpense({
                              ...item,
                              paidBy: e.target.value as any,
                            });
                          }}
                          className="text-[11px] bg-stone-50 border border-stone-200 rounded px-1.5 py-0.5 text-stone-700"
                        >
                          <option value="SHARED">Paid: Shared / Both</option>
                          <option value="GROOM">Paid: Groom Side</option>
                          <option value="BRIDE">Paid: Bride Side</option>
                          <option value="UNPAID">Unpaid Yet</option>
                        </select>
                        <span className={`text-[10px] px-1.5 py-0.5 rounded font-medium text-center ${
                          item.status === 'Settled'
                            ? 'bg-emerald-100 text-emerald-800'
                            : item.status === 'Partially Paid'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-stone-100 text-stone-600'
                        }`}>
                          {item.status}
                        </span>
                      </div>
                    </td>

                    {/* Action buttons */}
                    <td className="py-3 px-3 text-center whitespace-nowrap">
                      <button
                        onClick={() => onDeleteExpense(item.id)}
                        className="p-1 rounded hover:bg-red-50 text-stone-400 hover:text-red-600 transition-colors"
                        title="Delete expense"
                      >
                        <Trash2 size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Add New Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-lg font-bold text-stone-900 mb-1">
              Add Wedding Expense
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Enter vendor detail, estimated/actual cost, and choose how it is shared.
            </p>

            <form onSubmit={handleCreateNew} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-semibold text-stone-700 mb-1">Item / Service Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Sangeet LED Wall, Royal Rajasthani Catering"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value as any })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none bg-stone-50"
                  >
                    {ALL_CATEGORIES.map(c => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Wedding Event</label>
                  <select
                    value={newItem.event}
                    onChange={(e) => setNewItem({ ...newItem, event: e.target.value as any })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none bg-stone-50"
                  >
                    {ALL_EVENTS.map(ev => (
                      <option key={ev} value={ev}>{ev}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Vendor Name</label>
                  <input
                    type="text"
                    placeholder="e.g. ShutterBugs Studio"
                    value={newItem.vendorName}
                    onChange={(e) => setNewItem({ ...newItem, vendorName: e.target.value })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Total Cost (₹) *</label>
                  <input
                    type="number"
                    required
                    value={newItem.actualCost}
                    onChange={(e) => setNewItem({ 
                      ...newItem, 
                      actualCost: Number(e.target.value),
                      estimatedCost: Number(e.target.value)
                    })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Split Method</label>
                  <select
                    value={newItem.splitType}
                    onChange={(e) => setNewItem({ ...newItem, splitType: e.target.value as any })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none bg-stone-50 font-medium"
                  >
                    <option value="EQUAL_50_50">50 : 50 Equal Split</option>
                    <option value="GUEST_RATIO">By Guest Ratio</option>
                    <option value="GROOM_ONLY">100% Groom Side</option>
                    <option value="BRIDE_ONLY">100% Bride Side</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Advance / Paid Amount (₹)</label>
                  <input
                    type="number"
                    value={newItem.paidAmount}
                    onChange={(e) => setNewItem({ ...newItem, paidAmount: Number(e.target.value) })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Advance Paid By</label>
                  <select
                    value={newItem.paidBy}
                    onChange={(e) => setNewItem({ ...newItem, paidBy: e.target.value as any })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none bg-stone-50"
                  >
                    <option value="SHARED">Shared (Both)</option>
                    <option value="GROOM">Groom Side</option>
                    <option value="BRIDE">Bride Side</option>
                    <option value="UNPAID">Unpaid</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Payment Status</label>
                  <select
                    value={newItem.status}
                    onChange={(e) => setNewItem({ ...newItem, status: e.target.value as any })}
                    className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none bg-stone-50"
                  >
                    <option value="Estimated">Estimated</option>
                    <option value="Booked">Booked</option>
                    <option value="Partially Paid">Partially Paid</option>
                    <option value="Settled">Settled</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold shadow-xs"
                >
                  Add to Budget
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

