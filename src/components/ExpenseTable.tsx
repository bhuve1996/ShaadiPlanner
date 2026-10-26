'use client';

import React, { useState, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  Edit3, 
  Search, 
  ArrowUpDown,
  ArrowUp,
  ArrowDown,
  Filter,
  Users,
  Utensils,
  CheckCircle2,
  Clock,
  Sparkles
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

type SortField = 'name' | 'actualCost' | 'paidAmount' | 'pending' | 'event' | 'category' | 'groomDue' | 'brideDue';
type SortOrder = 'asc' | 'desc';

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
  const [selectedSplitType, setSelectedSplitType] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  
  // Sorting State
  const [sortField, setSortField] = useState<SortField>('actualCost');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Modal states
  const [editingItem, setEditingItem] = useState<ExpenseItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc'); // Default to descending for numbers
    }
  };

  // Filtered & Sorted Expenses
  const processedExpenses = useMemo(() => {
    let result = expenses.filter(item => {
      const matchesSearch = 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (item.vendorName && item.vendorName.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.notes && item.notes.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesCategory = selectedCategory === 'ALL' || item.category === selectedCategory;
      const matchesEvent = selectedEvent === 'ALL' || item.event === selectedEvent;
      const matchesSplit = selectedSplitType === 'ALL' || item.splitType === selectedSplitType;
      const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;

      let matchesSide = true;
      if (sideFilter === 'GROOM') {
        matchesSide = item.splitType !== 'BRIDE_ONLY';
      } else if (sideFilter === 'BRIDE') {
        matchesSide = item.splitType !== 'GROOM_ONLY';
      }

      return matchesSearch && matchesCategory && matchesEvent && matchesSplit && matchesStatus && matchesSide;
    });

    // Apply Sorting
    return result.sort((a, b) => {
      let aVal: any = 0;
      let bVal: any = 0;

      const aShares = computeExpenseShares(a, groomGuestCount, brideGuestCount);
      const bShares = computeExpenseShares(b, groomGuestCount, brideGuestCount);

      switch (sortField) {
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'actualCost':
          aVal = a.actualCost || a.estimatedCost || 0;
          bVal = b.actualCost || b.estimatedCost || 0;
          break;
        case 'paidAmount':
          aVal = a.paidAmount || 0;
          bVal = b.paidAmount || 0;
          break;
        case 'pending':
          aVal = (a.actualCost || 0) - (a.paidAmount || 0);
          bVal = (b.actualCost || 0) - (b.paidAmount || 0);
          break;
        case 'groomDue':
          aVal = aShares.groomDue;
          bVal = bShares.groomDue;
          break;
        case 'brideDue':
          aVal = aShares.brideDue;
          bVal = bShares.brideDue;
          break;
        case 'event':
          aVal = a.event;
          bVal = b.event;
          break;
        case 'category':
          aVal = a.category;
          bVal = b.category;
          break;
      }

      if (aVal < bVal) return sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });
  }, [
    expenses, 
    searchTerm, 
    selectedCategory, 
    selectedEvent, 
    selectedSplitType, 
    statusFilter, 
    sideFilter, 
    sortField, 
    sortOrder,
    groomGuestCount,
    brideGuestCount
  ]);

  // Aggregate stats on currently filtered items
  const filteredTotalCost = processedExpenses.reduce((sum, x) => sum + (x.actualCost || x.estimatedCost || 0), 0);
  const filteredTotalPaid = processedExpenses.reduce((sum, x) => sum + (x.paidAmount || 0), 0);

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
      paidBy: 'UNPAID',
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

  const renderSortIndicator = (field: SortField) => {
    if (sortField !== field) {
      return <ArrowUpDown size={12} className="opacity-30 group-hover:opacity-70 transition-opacity ml-1" />;
    }
    return sortOrder === 'asc' 
      ? <ArrowUp size={13} className="text-amber-600 ml-1" />
      : <ArrowDown size={13} className="text-amber-600 ml-1" />;
  };

  return (
    <div className="space-y-4">
      {/* Table Container */}
      <div className="bg-white rounded-3xl border-2 border-amber-200/90 shadow-md overflow-hidden transition-all">
        
        {/* Top Control Bar with Comprehensive Filters */}
        <div className="p-5 sm:p-6 border-b border-amber-100 flex flex-col gap-4 bg-gradient-to-r from-amber-50/40 via-white to-rose-50/30">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-black tracking-tight text-stone-900">
                  Detailed Expenses & Smart Occasion Registry
                </h2>
                <span className="text-xs bg-amber-500 text-white font-black px-2.5 py-0.5 rounded-full shadow-2xs">
                  {processedExpenses.length} entries
                </span>
              </div>
              <p className="text-xs text-stone-600 font-medium mt-0.5">
                Filter by occasion, category, or split formula. Click column headers to sort ascending / descending.
              </p>
            </div>

            {/* Add Expense Button */}
            <button
              onClick={handleOpenAddModal}
              className="self-start md:self-auto flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-600 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-black shadow-md shadow-amber-600/20 active:scale-95 transition-all cursor-pointer"
            >
              <Plus size={16} />
              <span>Add Expense</span>
            </button>
          </div>

          {/* Filter Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2">
            
            {/* 1. Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search vendor, item, notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20 font-medium"
              />
            </div>

            {/* 2. Occasion / Event Filter */}
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="text-xs bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-800 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            >
              <option value="ALL">All Occasions / Ceremonies</option>
              {ALL_EVENTS.map(ev => (
                <option key={ev} value={ev}>{ev}</option>
              ))}
            </select>

            {/* 3. Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-800 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            >
              <option value="ALL">All Categories</option>
              {ALL_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* 4. Split Type Filter */}
            <select
              value={selectedSplitType}
              onChange={(e) => setSelectedSplitType(e.target.value)}
              className="text-xs bg-white border border-stone-200 rounded-xl px-3 py-2 text-stone-800 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            >
              <option value="ALL">All Split Rules</option>
              <option value="EQUAL_50_50">50 : 50 Equal Split</option>
              <option value="GUEST_RATIO">By Guest Ratio</option>
              <option value="GROOM_ONLY">100% Bhuvesh (Groom)</option>
              <option value="BRIDE_ONLY">100% Harsha (Bride)</option>
            </select>

          </div>

        </div>

        {/* Quick Filter Pill Summary & Status Pills */}
        <div className="px-5 sm:px-6 py-2.5 bg-amber-50/50 border-b border-amber-100 flex flex-wrap items-center justify-between text-xs text-stone-700 gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span>Filtered: <strong className="text-stone-900">{processedExpenses.length}</strong></span>
            <span>Total: <strong className="text-stone-900 font-bold">{formatINR(filteredTotalCost)}</strong></span>
            <span>Paid: <strong className="text-emerald-700 font-bold">{formatINR(filteredTotalPaid)}</strong></span>
            <span>Pending: <strong className="text-amber-800 font-bold">{formatINR(filteredTotalCost - filteredTotalPaid)}</strong></span>
          </div>

          {/* Status Filter buttons */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-stone-500 uppercase font-bold mr-1">Status:</span>
            {['ALL', 'Estimated', 'Partially Paid', 'Settled'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  statusFilter === st 
                    ? 'bg-amber-600 text-white shadow-xs' 
                    : 'bg-white border border-stone-200 text-stone-700 hover:bg-stone-50'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Sortable Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-stone-50/90 text-stone-600 uppercase tracking-wider text-[11px] font-black border-b border-stone-200">
                
                {/* 1. Item Name Column */}
                <th 
                  onClick={() => handleSort('name')}
                  className="py-3.5 px-5 cursor-pointer hover:bg-stone-100/70 transition-colors group select-none"
                >
                  <div className="flex items-center">
                    <span>Item & Vendor</span>
                    {renderSortIndicator('name')}
                  </div>
                </th>

                {/* 2. Occasion Column */}
                <th 
                  onClick={() => handleSort('event')}
                  className="py-3.5 px-3 cursor-pointer hover:bg-stone-100/70 transition-colors group select-none"
                >
                  <div className="flex items-center">
                    <span>Occasion / Guests</span>
                    {renderSortIndicator('event')}
                  </div>
                </th>

                {/* 3. Actual Cost Column */}
                <th 
                  onClick={() => handleSort('actualCost')}
                  className="py-3.5 px-4 text-right cursor-pointer hover:bg-stone-100/70 transition-colors group select-none"
                >
                  <div className="flex items-center justify-end">
                    <span>Total Cost</span>
                    {renderSortIndicator('actualCost')}
                  </div>
                </th>

                {/* 4. Split Rule */}
                <th className="py-3.5 px-4 text-center">
                  <span>Split Formula</span>
                </th>

                {/* 5. Groom Liability */}
                <th 
                  onClick={() => handleSort('groomDue')}
                  className="py-3.5 px-4 text-right cursor-pointer hover:bg-blue-50/50 transition-colors group select-none text-blue-900"
                >
                  <div className="flex items-center justify-end">
                    <span>🤵 Bhuvesh Due</span>
                    {renderSortIndicator('groomDue')}
                  </div>
                </th>

                {/* 6. Bride Liability */}
                <th 
                  onClick={() => handleSort('brideDue')}
                  className="py-3.5 px-4 text-right cursor-pointer hover:bg-rose-50/50 transition-colors group select-none text-rose-900"
                >
                  <div className="flex items-center justify-end">
                    <span>👰 Harsha Due</span>
                    {renderSortIndicator('brideDue')}
                  </div>
                </th>

                {/* 7. Paid & Balance */}
                <th 
                  onClick={() => handleSort('paidAmount')}
                  className="py-3.5 px-4 cursor-pointer hover:bg-stone-100/70 transition-colors group select-none"
                >
                  <div className="flex items-center">
                    <span>Payment Progress</span>
                    {renderSortIndicator('paidAmount')}
                  </div>
                </th>

                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-stone-100">
              {processedExpenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-stone-400">
                    <p className="text-sm font-bold text-stone-700 mb-1">No matching expenses found</p>
                    <p className="text-xs text-stone-400 mb-3">Try clearing search terms or changing your filters.</p>
                    <button
                      onClick={handleOpenAddModal}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-600 text-white font-bold text-xs"
                    >
                      <Plus size={14} /> Add new expense
                    </button>
                  </td>
                </tr>
              ) : (
                processedExpenses.map((item) => {
                  const shares = computeExpenseShares(
                    item,
                    groomGuestCount,
                    brideGuestCount
                  );

                  const isFullyPaid = item.paidAmount >= item.actualCost && item.actualCost > 0;
                  const percentPaid = Math.min(100, Math.round((item.paidAmount / (item.actualCost || 1)) * 100));

                  return (
                    <tr 
                      key={item.id} 
                      className="group hover:bg-amber-50/50 transition-colors cursor-pointer"
                      onClick={() => {
                        setEditingItem(item);
                        setShowAddModal(false);
                      }}
                    >
                      {/* 1. Item Name + Category */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 p-2 rounded-xl bg-amber-50 group-hover:bg-amber-100 border border-amber-200 transition-colors">
                            <CategoryIcon category={item.category} size={18} />
                          </div>
                          <div>
                            <div className="font-bold text-stone-900 group-hover:text-amber-800 transition-colors text-[13px] flex items-center gap-1.5">
                              <span>{item.name}</span>
                              <Edit3 size={12} className="opacity-0 group-hover:opacity-70 text-amber-600 transition-opacity" />
                            </div>
                            <div className="text-[11px] text-stone-500 mt-0.5 flex flex-wrap items-center gap-2 font-medium">
                              <span>{item.category}</span>
                              {item.vendorName && (
                                <>
                                  <span className="text-stone-300">•</span>
                                  <span className="font-bold text-stone-700 bg-stone-100 px-1.5 py-0.2 rounded">
                                    {item.vendorName}
                                  </span>
                                </>
                              )}
                              {item.dueDate && (
                                <>
                                  <span className="text-stone-300">•</span>
                                  <span className="text-amber-700 flex items-center gap-1 font-semibold">
                                    <Clock size={10} /> Due: {item.dueDate}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 2. Occasion & Guest Pill */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <div className="space-y-1">
                          <span className="inline-block px-2.5 py-1 rounded-lg bg-stone-100 text-stone-800 text-[11px] font-bold border border-stone-200">
                            {item.event}
                          </span>
                          
                          {/* SMART GUEST BADGE */}
                          {shares.isCustomOccasionGuests ? (
                            <div className="flex items-center gap-1 text-[10px] text-amber-800 font-bold bg-amber-100/90 px-2 py-0.5 rounded-md border border-amber-300">
                              <Users size={11} className="text-amber-600" />
                              <span>{shares.effectiveGroomGuests + shares.effectiveBrideGuests} Guests ({shares.effectiveGroomGuests}B : {shares.effectiveBrideGuests}H)</span>
                            </div>
                          ) : (
                            <div className="text-[10px] text-stone-400 font-medium">
                              Global: {groomGuestCount + brideGuestCount} Guests
                            </div>
                          )}
                        </div>
                      </td>

                      {/* 3. Actual Cost */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="font-black text-stone-900 text-sm">
                          {formatINR(item.actualCost || item.estimatedCost)}
                        </div>
                        {item.ratePerGuestOrPlate && item.ratePerGuestOrPlate > 0 && (
                          <div className="text-[10px] text-amber-700 font-semibold">
                            ₹{item.ratePerGuestOrPlate}/guest
                          </div>
                        )}
                      </td>

                      {/* 4. Split Type Selector */}
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
                          className={`text-xs font-bold px-2.5 py-1 rounded-xl border focus:outline-none transition-all shadow-2xs ${
                            item.splitType === 'EQUAL_50_50' 
                              ? 'bg-amber-50 text-amber-900 border-amber-300 hover:bg-amber-100'
                              : item.splitType === 'GUEST_RATIO'
                              ? 'bg-purple-50 text-purple-900 border-purple-300 hover:bg-purple-100'
                              : item.splitType === 'GROOM_ONLY'
                              ? 'bg-blue-50 text-blue-900 border-blue-300 hover:bg-blue-100'
                              : 'bg-rose-50 text-rose-900 border-rose-300 hover:bg-rose-100'
                          }`}
                        >
                          <option value="EQUAL_50_50">50 : 50 Split</option>
                          <option value="GUEST_RATIO">Guest Ratio ({shares.groomPercent}% : {shares.bridePercent}%)</option>
                          <option value="GROOM_ONLY">100% Bhuvesh</option>
                          <option value="BRIDE_ONLY">100% Harsha</option>
                        </select>
                      </td>

                      {/* 5. Groom Share */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="font-black text-blue-700 text-sm">
                          {formatINR(shares.groomDue)}
                        </div>
                        <div className="text-[10px] text-stone-500 font-bold">
                          {shares.groomPercent}% share
                        </div>
                      </td>

                      {/* 6. Bride Share */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="font-black text-rose-700 text-sm">
                          {formatINR(shares.brideDue)}
                        </div>
                        <div className="text-[10px] text-stone-500 font-bold">
                          {shares.bridePercent}% share
                        </div>
                      </td>

                      {/* 7. Payment & Status */}
                      <td 
                        className="py-3.5 px-4 whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex flex-col gap-1 w-36">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-stone-700">
                              {formatINR(item.paidAmount)}
                            </span>
                            <span className="text-[10px] font-bold text-stone-500">
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
                            <span>By: <strong>{item.paidBy === 'SHARED' ? 'Both' : item.paidBy === 'GROOM' ? 'Bhuvesh' : item.paidBy === 'BRIDE' ? 'Harsha' : 'Unpaid'}</strong></span>
                            <span className={`font-bold ${
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

                      {/* 8. Actions */}
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
                            className="p-1.5 rounded-lg text-stone-500 hover:text-amber-700 hover:bg-amber-100 transition-colors cursor-pointer"
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
                            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
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
