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
      setSortOrder('desc');
    }
  };

  // Filtered & Sorted Expenses: SMART SCOPE
  // When GROOM is clicked: shows Groom-specific (100% Groom) AND Shared/Mutual (50:50 or Guest Ratio)
  // When BRIDE is clicked: shows Bride-specific (100% Bride) AND Shared/Mutual (50:50 or Guest Ratio)
  // When ALL is clicked: shows everything
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
        // Show Groom-specific expenses and all Mutual / Shared expenses that groom participates in
        matchesSide = item.splitType !== 'BRIDE_ONLY';
      } else if (sideFilter === 'BRIDE') {
        // Show Bride-specific expenses and all Mutual / Shared expenses that bride participates in
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
      ? <ArrowUp size={13} className="text-amber-400 ml-1" />
      : <ArrowDown size={13} className="text-amber-400 ml-1" />;
  };

  return (
    <div className="space-y-4">
      {/* Table Container in Luxury Dark Theme */}
      <div className="bg-[#121624]/90 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden transition-all">
        
        {/* Top Control Bar with Comprehensive Filters */}
        <div className="p-5 sm:p-6 border-b border-white/10 flex flex-col gap-4 bg-gradient-to-r from-white/[0.03] to-amber-500/[0.04]">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-black tracking-tight text-white flex items-center gap-2">
                  <span>Expenses & Occasions Ledger</span>
                  {sideFilter === 'GROOM' && (
                    <span className="text-xs bg-blue-500/20 text-blue-400 border border-blue-500/30 font-bold px-2.5 py-0.5 rounded-full">
                      🤵 Bhuvesh & Mutual
                    </span>
                  )}
                  {sideFilter === 'BRIDE' && (
                    <span className="text-xs bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold px-2.5 py-0.5 rounded-full">
                      👰 Harsha & Mutual
                    </span>
                  )}
                  {sideFilter === 'ALL' && (
                    <span className="text-xs bg-amber-500/20 text-amber-300 border border-amber-500/30 font-bold px-2.5 py-0.5 rounded-full">
                      🤝 Consolidated
                    </span>
                  )}
                </h2>
                <span className="text-xs bg-white/10 text-slate-300 font-bold px-2.5 py-0.5 rounded-full">
                  {processedExpenses.length} entries
                </span>
              </div>
              <p className="text-xs text-slate-400 font-medium mt-0.5">
                {sideFilter === 'GROOM' 
                  ? "Showing Bhuvesh's individual expenses + all shared/mutual ceremony expenses." 
                  : sideFilter === 'BRIDE' 
                  ? "Showing Harsha's individual expenses + all shared/mutual ceremony expenses." 
                  : "Consolidated joint ledger showing all mutual, groom, and bride wedding costs."}
              </p>
            </div>

            {/* Add Expense Button */}
            <button
              onClick={handleOpenAddModal}
              className="self-start md:self-auto flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
            >
              <Plus size={16} />
              <span>Add Expense</span>
            </button>
          </div>

          {/* Filter Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5 pt-2">
            
            {/* 1. Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search vendor, item, notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-[#161B2E] border border-white/10 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/30 font-medium"
              />
            </div>

            {/* 2. Occasion / Event Filter */}
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="text-xs bg-[#161B2E] border border-white/10 rounded-xl px-3 py-2 text-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/30"
            >
              <option value="ALL">All Occasions</option>
              {ALL_EVENTS.map(ev => (
                <option key={ev} value={ev}>{ev}</option>
              ))}
            </select>

            {/* 3. Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs bg-[#161B2E] border border-white/10 rounded-xl px-3 py-2 text-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/30"
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
              className="text-xs bg-[#161B2E] border border-white/10 rounded-xl px-3 py-2 text-slate-200 font-bold focus:outline-none focus:ring-2 focus:ring-amber-500/30"
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
        <div className="px-5 sm:px-6 py-2.5 bg-black/30 border-b border-white/10 flex flex-wrap items-center justify-between text-xs text-slate-300 gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span>Filtered: <strong className="text-white">{processedExpenses.length}</strong></span>
            <span>Total Value: <strong className="text-amber-400 font-bold">{formatINR(filteredTotalCost)}</strong></span>
            <span>Paid: <strong className="text-emerald-400 font-bold">{formatINR(filteredTotalPaid)}</strong></span>
            <span>Pending: <strong className="text-rose-400 font-bold">{formatINR(filteredTotalCost - filteredTotalPaid)}</strong></span>
          </div>

          {/* Status Filter buttons */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-400 uppercase font-bold mr-1">Status:</span>
            {['ALL', 'Estimated', 'Partially Paid', 'Settled'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  statusFilter === st 
                    ? 'bg-amber-500 text-slate-950 shadow-md font-black' 
                    : 'bg-white/5 border border-white/10 text-slate-300 hover:bg-white/10'
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
              <tr className="bg-white/[0.02] text-slate-400 uppercase tracking-wider text-[11px] font-bold border-b border-white/10">
                
                {/* 1. Item Name */}
                <th 
                  onClick={() => handleSort('name')}
                  className="py-3.5 px-5 cursor-pointer hover:text-white transition-colors group select-none"
                >
                  <div className="flex items-center">
                    <span>Item & Vendor</span>
                    {renderSortIndicator('name')}
                  </div>
                </th>

                {/* 2. Occasion */}
                <th 
                  onClick={() => handleSort('event')}
                  className="py-3.5 px-3 cursor-pointer hover:text-white transition-colors group select-none"
                >
                  <div className="flex items-center">
                    <span>Occasion / Guests</span>
                    {renderSortIndicator('event')}
                  </div>
                </th>

                {/* 3. Actual Cost */}
                <th 
                  onClick={() => handleSort('actualCost')}
                  className="py-3.5 px-4 text-right cursor-pointer hover:text-white transition-colors group select-none"
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
                  className="py-3.5 px-4 text-right cursor-pointer hover:text-blue-300 transition-colors group select-none text-blue-400"
                >
                  <div className="flex items-center justify-end">
                    <span>🤵 Bhuvesh Due</span>
                    {renderSortIndicator('groomDue')}
                  </div>
                </th>

                {/* 6. Bride Liability */}
                <th 
                  onClick={() => handleSort('brideDue')}
                  className="py-3.5 px-4 text-right cursor-pointer hover:text-rose-300 transition-colors group select-none text-rose-400"
                >
                  <div className="flex items-center justify-end">
                    <span>👰 Harsha Due</span>
                    {renderSortIndicator('brideDue')}
                  </div>
                </th>

                {/* 7. Paid & Progress */}
                <th 
                  onClick={() => handleSort('paidAmount')}
                  className="py-3.5 px-4 cursor-pointer hover:text-white transition-colors group select-none"
                >
                  <div className="flex items-center">
                    <span>Payment Progress</span>
                    {renderSortIndicator('paidAmount')}
                  </div>
                </th>

                <th className="py-3.5 px-4 text-center">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-white/5">
              {processedExpenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-500">
                    <p className="text-sm font-bold text-slate-300 mb-1">No matching expenses found</p>
                    <p className="text-xs text-slate-500 mb-3">Try clearing search terms or changing your filters.</p>
                    <button
                      onClick={handleOpenAddModal}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500 text-slate-950 font-bold text-xs cursor-pointer"
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
                      className="group hover:bg-white/[0.04] transition-colors cursor-pointer"
                      onClick={() => {
                        setEditingItem(item);
                        setShowAddModal(false);
                      }}
                    >
                      {/* 1. Item Name + Category */}
                      <td className="py-3.5 px-5">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 p-2 rounded-xl bg-white/5 border border-white/10 group-hover:border-amber-400/40 transition-colors">
                            <CategoryIcon category={item.category} size={18} />
                          </div>
                          <div>
                            <div className="font-bold text-white group-hover:text-amber-300 transition-colors text-[13px] flex items-center gap-1.5">
                              <span>{item.name}</span>
                              <Edit3 size={12} className="opacity-0 group-hover:opacity-70 text-amber-400 transition-opacity" />
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5 flex flex-wrap items-center gap-2 font-medium">
                              <span>{item.category}</span>
                              {item.vendorName && (
                                <>
                                  <span className="text-slate-600">•</span>
                                  <span className="font-bold text-slate-300 bg-white/5 px-1.5 py-0.2 rounded border border-white/10">
                                    {item.vendorName}
                                  </span>
                                </>
                              )}
                              {item.dueDate && (
                                <>
                                  <span className="text-slate-600">•</span>
                                  <span className="text-amber-400/90 flex items-center gap-1 font-semibold">
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
                          <span className="inline-block px-2.5 py-1 rounded-lg bg-white/5 text-slate-200 text-[11px] font-bold border border-white/10">
                            {item.event}
                          </span>
                          
                          {/* SMART GUEST BADGE */}
                          {shares.isCustomOccasionGuests ? (
                            <div className="flex items-center gap-1 text-[10px] text-amber-300 font-bold bg-amber-500/15 px-2 py-0.5 rounded-md border border-amber-500/30">
                              <Users size={11} className="text-amber-400" />
                              <span>{shares.effectiveGroomGuests + shares.effectiveBrideGuests} Guests ({shares.effectiveGroomGuests}B : {shares.effectiveBrideGuests}H)</span>
                            </div>
                          ) : (
                            <div className="text-[10px] text-slate-500 font-medium">
                              Global: {groomGuestCount + brideGuestCount} Guests
                            </div>
                          )}
                        </div>
                      </td>

                      {/* 3. Actual Cost */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="font-black text-white text-sm">
                          {formatINR(item.actualCost || item.estimatedCost)}
                        </div>
                        {item.ratePerGuestOrPlate && item.ratePerGuestOrPlate > 0 && (
                          <div className="text-[10px] text-amber-400/90 font-semibold">
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
                          className={`text-xs font-bold px-2.5 py-1 rounded-xl border focus:outline-none transition-all ${
                            item.splitType === 'EQUAL_50_50' 
                              ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                              : item.splitType === 'GUEST_RATIO'
                              ? 'bg-purple-500/15 text-purple-300 border-purple-500/30'
                              : item.splitType === 'GROOM_ONLY'
                              ? 'bg-blue-500/15 text-blue-300 border-blue-500/30'
                              : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                          }`}
                        >
                          <option value="EQUAL_50_50" className="bg-[#121624] text-white">50 : 50 Split</option>
                          <option value="GUEST_RATIO" className="bg-[#121624] text-white">Guest Ratio ({shares.groomPercent}% : {shares.bridePercent}%)</option>
                          <option value="GROOM_ONLY" className="bg-[#121624] text-white">100% Bhuvesh</option>
                          <option value="BRIDE_ONLY" className="bg-[#121624] text-white">100% Harsha</option>
                        </select>
                      </td>

                      {/* 5. Groom Share */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="font-black text-blue-400 text-sm">
                          {formatINR(shares.groomDue)}
                        </div>
                        <div className="text-[10px] text-slate-400 font-bold">
                          {shares.groomPercent}% share
                        </div>
                      </td>

                      {/* 6. Bride Share */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <div className="font-black text-rose-400 text-sm">
                          {formatINR(shares.brideDue)}
                        </div>
                        <div className="text-[10px] text-slate-400 font-bold">
                          {shares.bridePercent}% share
                        </div>
                      </td>

                      {/* 7. Payment Progress & Status */}
                      <td 
                        className="py-3.5 px-4 whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex flex-col gap-1 w-36">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-slate-200">
                              {formatINR(item.paidAmount)}
                            </span>
                            <span className="text-[10px] font-bold text-slate-400">
                              {percentPaid}%
                            </span>
                          </div>
                          <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-300 ${
                                isFullyPaid ? 'bg-emerald-400' : 'bg-amber-400'
                              }`} 
                              style={{ width: `${percentPaid}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-400">
                            <span>By: <strong className="text-slate-300">{item.paidBy === 'SHARED' ? 'Both' : item.paidBy === 'GROOM' ? 'Bhuvesh' : item.paidBy === 'BRIDE' ? 'Harsha' : 'Unpaid'}</strong></span>
                            <span className={`font-bold ${
                              item.status === 'Settled' 
                                ? 'text-emerald-400' 
                                : item.status === 'Partially Paid' 
                                ? 'text-amber-400' 
                                : 'text-slate-400'
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
                            className="p-1.5 rounded-lg text-slate-400 hover:text-amber-300 hover:bg-white/10 transition-colors cursor-pointer"
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
                            className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-colors cursor-pointer"
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
