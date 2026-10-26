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
  Users, 
  Clock, 
  Flower2, 
  Building2 
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

  // Hover Popover Card State
  const [hoveredItem, setHoveredItem] = useState<{ item: ExpenseItem; x: number; y: number } | null>(null);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortOrder(prev => prev === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

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
      ? <ArrowUp size={13} className="text-pink-600 dark:text-pink-400 ml-1" />
      : <ArrowDown size={13} className="text-blue-600 dark:text-blue-400 ml-1" />;
  };

  const getRowClassName = (splitType: SplitType) => {
    switch (splitType) {
      case 'BRIDE_ONLY':
        return 'row-bride';
      case 'GROOM_ONLY':
        return 'row-groom';
      case 'GUEST_RATIO':
      case 'EQUAL_50_50':
      case 'CUSTOM':
      default:
        return 'row-split-green';
    }
  };

  return (
    <div className="space-y-4 relative">
      {/* Table Container with proper horizontal overflow scroll */}
      <div className="theme-card bg-white/95 rounded-3xl border-2 border-pink-200 shadow-xl overflow-hidden transition-all">
        
        {/* Top Control Bar */}
        <div className="p-5 sm:p-6 border-b border-pink-100 dark:border-white/10 flex flex-col gap-4 bg-gradient-to-r from-rose-50/50 via-purple-50/30 to-sky-50/50 dark:from-rose-950/20 dark:via-purple-950/15 dark:to-sky-950/20">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2.5">
                <Flower2 className="text-pink-500 w-6 h-6 animate-spin-slow" />
                <h2 className="text-xl font-black tracking-tight text-slate-900 dark:text-white flex items-center gap-2">
                  <span>Wedding Registry & Color-Coded Splits</span>
                  {sideFilter === 'GROOM' && (
                    <span className="text-xs bg-sky-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-600 font-bold px-2.5 py-0.5 rounded-full">
                      🤵 Bhuvesh (Blue) + Shared
                    </span>
                  )}
                  {sideFilter === 'BRIDE' && (
                    <span className="text-xs bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-600 font-bold px-2.5 py-0.5 rounded-full">
                      👰 Harsha (Pink) + Shared
                    </span>
                  )}
                  {sideFilter === 'ALL' && (
                    <span className="text-xs bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-600 font-bold px-2.5 py-0.5 rounded-full">
                      🌸 Mixed Mutual (All)
                    </span>
                  )}
                </h2>
                <span className="text-xs bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 font-black px-2.5 py-0.5 rounded-full border border-pink-200 dark:border-pink-800">
                  {processedExpenses.length} items
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1">
                Tip: <strong>All columns are fully visible with dedicated min-widths and horizontal scrolling</strong>. Hover over any row for full vendor dossier card.
              </p>
            </div>

            {/* Add Expense Button */}
            <button
              onClick={handleOpenAddModal}
              className="self-start md:self-auto flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-blue-500 text-white text-xs font-black shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer"
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
                className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-900 border border-pink-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-pink-400 font-medium shadow-2xs"
              />
            </div>

            {/* 2. Occasion Filter */}
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="text-xs bg-white dark:bg-slate-900 border border-pink-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 font-bold focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-2xs"
            >
              <option value="ALL">🌸 All Occasions</option>
              {ALL_EVENTS.map(ev => (
                <option key={ev} value={ev}>{ev}</option>
              ))}
            </select>

            {/* 3. Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="text-xs bg-white dark:bg-slate-900 border border-pink-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 font-bold focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-2xs"
            >
              <option value="ALL">🌺 All Categories</option>
              {ALL_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* 4. Split Type Filter */}
            <select
              value={selectedSplitType}
              onChange={(e) => setSelectedSplitType(e.target.value)}
              className="text-xs bg-white dark:bg-slate-900 border border-pink-200 dark:border-white/10 rounded-xl px-3 py-2 text-slate-800 dark:text-slate-100 font-bold focus:outline-none focus:ring-2 focus:ring-pink-400 shadow-2xs"
            >
              <option value="ALL">✨ All Split Rules</option>
              <option value="BRIDE_ONLY">🌸 Pink (100% Harsha Bride)</option>
              <option value="GROOM_ONLY">🤵 Blue (100% Bhuvesh Groom)</option>
              <option value="GUEST_RATIO">👥 Purple (Guest Ratio Mix)</option>
              <option value="EQUAL_50_50">🤝 Amber (50:50 Shared Equal)</option>
            </select>

          </div>

        </div>

        {/* Quick Filter Pill Summary & Status Pills */}
        <div className="px-5 sm:px-6 py-2.5 bg-gradient-to-r from-pink-50/50 via-white to-blue-50/50 dark:from-slate-900/60 dark:via-slate-900/80 dark:to-slate-900/60 border-b border-pink-100 dark:border-white/10 flex flex-wrap items-center justify-between text-xs text-slate-700 dark:text-slate-300 gap-3">
          <div className="flex flex-wrap items-center gap-3">
            <span>Filtered: <strong className="text-slate-900 dark:text-white">{processedExpenses.length}</strong></span>
            <span>Total: <strong className="text-purple-700 dark:text-purple-300 font-bold">{formatINR(filteredTotalCost)}</strong></span>
            <span>Paid: <strong className="text-emerald-700 dark:text-emerald-300 font-bold">{formatINR(filteredTotalPaid)}</strong></span>
            <span>Pending: <strong className="text-rose-700 dark:text-rose-300 font-bold">{formatINR(filteredTotalCost - filteredTotalPaid)}</strong></span>
          </div>

          {/* Status Filter buttons */}
          <div className="flex items-center gap-1.5">
            <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-bold mr-1">Status:</span>
            {['ALL', 'Estimated', 'Partially Paid', 'Settled'].map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                  statusFilter === st 
                    ? 'bg-gradient-to-r from-pink-500 to-purple-500 text-white shadow-xs font-black' 
                    : 'bg-white dark:bg-slate-800 border border-pink-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-pink-50 dark:hover:bg-slate-700'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Sortable Table: Guaranteed Wide Visibility (min-w-[1100px]) */}
        <div className="overflow-x-auto w-full">
          <table className="w-full text-left text-xs border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-900/70 text-slate-600 dark:text-slate-400 uppercase tracking-wider text-[11px] font-black border-b border-pink-100 dark:border-white/10">
                
                {/* 1. Item Name (320px) */}
                <th 
                  onClick={() => handleSort('name')}
                  className="py-3.5 px-5 cursor-pointer hover:text-pink-600 dark:hover:text-pink-400 transition-colors group select-none w-[320px]"
                >
                  <div className="flex items-center">
                    <span>Expense Item & Vendor</span>
                    {renderSortIndicator('name')}
                  </div>
                </th>

                {/* 2. Occasion & Guests (170px) */}
                <th 
                  onClick={() => handleSort('event')}
                  className="py-3.5 px-4 cursor-pointer hover:text-pink-600 dark:hover:text-pink-400 transition-colors group select-none w-[170px]"
                >
                  <div className="flex items-center">
                    <span>Occasion / Guests</span>
                    {renderSortIndicator('event')}
                  </div>
                </th>

                {/* 3. Actual Cost (130px) */}
                <th 
                  onClick={() => handleSort('actualCost')}
                  className="py-3.5 px-4 text-right cursor-pointer hover:text-purple-600 dark:hover:text-purple-400 transition-colors group select-none w-[130px]"
                >
                  <div className="flex items-center justify-end">
                    <span>Total Cost</span>
                    {renderSortIndicator('actualCost')}
                  </div>
                </th>

                {/* 4. Split Rule (170px) */}
                <th className="py-3.5 px-4 text-center w-[170px]">
                  <span>Side / Split Rule</span>
                </th>

                {/* 5. Groom Liability (120px) */}
                <th 
                  onClick={() => handleSort('groomDue')}
                  className="py-3.5 px-4 text-right cursor-pointer hover:text-blue-700 dark:hover:text-blue-400 transition-colors group select-none text-blue-700 dark:text-blue-400 w-[120px]"
                >
                  <div className="flex items-center justify-end">
                    <span>🤵 Bhuvesh (Blue)</span>
                    {renderSortIndicator('groomDue')}
                  </div>
                </th>

                {/* 6. Bride Liability (120px) */}
                <th 
                  onClick={() => handleSort('brideDue')}
                  className="py-3.5 px-4 text-right cursor-pointer hover:text-rose-700 dark:hover:text-rose-400 transition-colors group select-none text-rose-700 dark:text-rose-400 w-[120px]"
                >
                  <div className="flex items-center justify-end">
                    <span>👰 Harsha (Pink)</span>
                    {renderSortIndicator('brideDue')}
                  </div>
                </th>

                {/* 7. Paid & Progress (160px) */}
                <th 
                  onClick={() => handleSort('paidAmount')}
                  className="py-3.5 px-4 cursor-pointer hover:text-pink-600 dark:hover:text-pink-400 transition-colors group select-none w-[160px]"
                >
                  <div className="flex items-center">
                    <span>Payment Progress</span>
                    {renderSortIndicator('paidAmount')}
                  </div>
                </th>

                {/* 8. Actions (90px) */}
                <th className="py-3.5 px-4 text-center w-[90px]">Actions</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-pink-100/60 dark:divide-white/5">
              {processedExpenses.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-16 text-center text-slate-400">
                    <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1">No matching expenses found</p>
                    <p className="text-xs text-slate-400 mb-3">Try clearing search terms or changing your filters.</p>
                    <button
                      onClick={handleOpenAddModal}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-pink-500 text-white font-bold text-xs cursor-pointer shadow-md"
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
                  const rowClass = getRowClassName(item.splitType);

                  return (
                    <tr 
                      key={item.id} 
                      className={`transition-all cursor-pointer ${rowClass} group`}
                      onClick={() => {
                        setEditingItem(item);
                        setShowAddModal(false);
                      }}
                    >
                      {/* 1. Item Name + Photographic Image + Crisp Typography + Hover Dossier Card */}
                      <td className="py-3 px-5">
                        <div 
                          className="flex items-center gap-3.5 relative"
                          onMouseEnter={(e) => {
                            const rect = e.currentTarget.getBoundingClientRect();
                            setHoveredItem({ item, x: rect.left, y: rect.bottom + 8 });
                          }}
                          onMouseLeave={() => setHoveredItem(null)}
                        >
                          {/* Photographic Thumbnail or Icon */}
                          <div className="relative w-12 h-12 rounded-2xl overflow-hidden flex-shrink-0 border-2 border-white dark:border-slate-700 shadow-md bg-pink-100/60 dark:bg-slate-800 flex items-center justify-center">
                            {item.imageUrl ? (
                              <img 
                                src={item.imageUrl} 
                                alt={item.name} 
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                onError={(e) => {
                                  // Fallback to CategoryIcon if image fails
                                  (e.currentTarget as HTMLElement).style.display = 'none';
                                }}
                              />
                            ) : (
                              <CategoryIcon category={item.category} size={22} />
                            )}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            {/* Larger Crisp Title */}
                            <div className="font-extrabold text-slate-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-300 transition-colors text-[15px] leading-snug tracking-tight">
                              {item.name}
                            </div>

                            {/* Clean Subline with Badges */}
                            <div className="mt-1 flex flex-wrap items-center gap-2 text-xs">
                              <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
                                {item.category}
                              </span>

                              {item.vendorName ? (
                                <>
                                  <span className="text-slate-300 dark:text-slate-600">•</span>
                                  <span className="inline-flex items-center gap-1 text-[11px] font-black text-slate-800 dark:text-slate-200 bg-white/90 dark:bg-slate-800 px-2 py-0.5 rounded-lg border border-slate-200/80 dark:border-white/10 shadow-2xs">
                                    <Building2 size={11} className="text-pink-500 flex-shrink-0" />
                                    <span className="truncate max-w-[150px]">{item.vendorName}</span>
                                  </span>
                                </>
                              ) : (
                                <>
                                  <span className="text-slate-300 dark:text-slate-600">•</span>
                                  <span className="text-[10px] text-slate-400 italic">No vendor assigned</span>
                                </>
                              )}

                              {item.dueDate && (
                                <>
                                  <span className="text-slate-300 dark:text-slate-600">•</span>
                                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 dark:text-rose-400">
                                    <Clock size={10} />
                                    <span>{item.dueDate}</span>
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 2. Occasion & Guest Pill */}
                      <td className="py-4 px-4 whitespace-nowrap">
                        <div className="space-y-1">
                          <span className="inline-block px-2.5 py-1 rounded-xl bg-white/90 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold border border-slate-200 dark:border-white/10 shadow-2xs">
                            {item.event}
                          </span>
                          
                          {/* SMART GUEST BADGE */}
                          {shares.isCustomOccasionGuests ? (
                            <div className="flex items-center gap-1 text-[10px] text-purple-700 dark:text-purple-300 font-bold bg-purple-100/80 dark:bg-purple-950/60 px-2 py-0.5 rounded-md border border-purple-200 dark:border-purple-800">
                              <Users size={11} className="text-purple-600 dark:text-purple-400" />
                              <span>{shares.effectiveGroomGuests + shares.effectiveBrideGuests} Guests ({shares.effectiveGroomGuests}B : {shares.effectiveBrideGuests}H)</span>
                            </div>
                          ) : (
                            <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                              Global: {groomGuestCount + brideGuestCount} Guests
                            </div>
                          )}
                        </div>
                      </td>

                      {/* 3. Actual Cost */}
                      <td className="py-4 px-4 text-right whitespace-nowrap">
                        <div className="font-black text-slate-900 dark:text-white text-base">
                          {formatINR(item.actualCost || item.estimatedCost)}
                        </div>
                        {item.ratePerGuestOrPlate && item.ratePerGuestOrPlate > 0 && (
                          <div className="text-[10px] text-pink-600 dark:text-pink-400 font-bold">
                            ₹{item.ratePerGuestOrPlate}/plate
                          </div>
                        )}
                      </td>

                      {/* 4. Split Type Selector */}
                      <td 
                        className="py-4 px-4 text-center whitespace-nowrap"
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
                          className={`text-xs font-black px-2.5 py-1.5 rounded-xl border shadow-xs focus:outline-none transition-all cursor-pointer ${
                            item.splitType === 'BRIDE_ONLY'
                              ? 'bg-rose-100 dark:bg-rose-950/70 text-rose-800 dark:text-rose-200 border-rose-300 dark:border-rose-700'
                              : item.splitType === 'GROOM_ONLY'
                              ? 'bg-blue-100 dark:bg-blue-950/70 text-blue-800 dark:text-blue-200 border-blue-300 dark:border-blue-700'
                              : item.splitType === 'GUEST_RATIO'
                              ? 'bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-200 border-purple-300 dark:border-purple-700'
                              : 'bg-amber-100 dark:bg-amber-950/70 text-amber-900 dark:text-amber-200 border-amber-300 dark:border-amber-700'
                          }`}
                        >
                          <option value="BRIDE_ONLY" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">🌸 100% Harsha (Bride Pink)</option>
                          <option value="GROOM_ONLY" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">🤵 100% Bhuvesh (Groom Blue)</option>
                          <option value="GUEST_RATIO" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">👥 Guest Ratio Mix ({shares.groomPercent}% : {shares.bridePercent}%)</option>
                          <option value="EQUAL_50_50" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">🤝 50 : 50 Shared Equal</option>
                        </select>
                      </td>

                      {/* 5. Groom Share */}
                      <td className="py-4 px-4 text-right whitespace-nowrap font-sans">
                        <div className="font-black text-blue-700 dark:text-blue-400 text-sm">
                          {formatINR(shares.groomDue)}
                        </div>
                        <div className="text-[10px] text-blue-600 dark:text-blue-400 font-bold">
                          {shares.groomPercent}% Bhuvesh
                        </div>
                      </td>

                      {/* 6. Bride Share */}
                      <td className="py-4 px-4 text-right whitespace-nowrap font-sans">
                        <div className="font-black text-rose-600 dark:text-rose-400 text-sm">
                          {formatINR(shares.brideDue)}
                        </div>
                        <div className="text-[10px] text-rose-600 dark:text-rose-400 font-bold">
                          {shares.bridePercent}% Harsha
                        </div>
                      </td>

                      {/* 7. Payment Progress & Status */}
                      <td 
                        className="py-4 px-4 whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex flex-col gap-1.5 w-36">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="font-bold text-slate-700 dark:text-slate-300">
                              {formatINR(item.paidAmount)}
                            </span>
                            <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400">
                              {percentPaid}%
                            </span>
                          </div>
                          <div className="w-full bg-slate-200 dark:bg-white/10 h-1.5 rounded-full overflow-hidden">
                            <div 
                              className={`h-full transition-all duration-300 ${
                                isFullyPaid ? 'bg-emerald-500' : 'bg-gradient-to-r from-blue-400 to-pink-500'
                              }`} 
                              style={{ width: `${percentPaid}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                            <span>By: <strong className="text-slate-800 dark:text-slate-200">{item.paidBy === 'SHARED' ? 'Both' : item.paidBy === 'GROOM' ? 'Bhuvesh' : item.paidBy === 'BRIDE' ? 'Harsha' : 'Unpaid'}</strong></span>
                            <span className={`font-bold ${
                              item.status === 'Settled' 
                                ? 'text-emerald-700 dark:text-emerald-400' 
                                : item.status === 'Partially Paid' 
                                ? 'text-amber-700 dark:text-amber-400' 
                                : 'text-slate-500 dark:text-slate-400'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* 8. Actions */}
                      <td 
                        className="py-4 px-4 text-center whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <div className="flex items-center justify-center gap-1">
                          <button
                            onClick={() => {
                              setEditingItem(item);
                              setShowAddModal(false);
                            }}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-pink-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
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
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
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

      {/* Floating Hover Dossier Card */}
      {hoveredItem && (
        <div 
          className="fixed z-50 pointer-events-none animate-in fade-in zoom-in-95 duration-150"
          style={{
            left: Math.min(hoveredItem.x, typeof window !== 'undefined' ? window.innerWidth - 380 : 500),
            top: Math.min(hoveredItem.y, typeof window !== 'undefined' ? window.innerHeight - 300 : 500),
            width: '360px'
          }}
        >
          <div className="bg-white/95 dark:bg-[#151A2E]/95 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border-2 border-pink-300 dark:border-white/20 text-xs space-y-2.5">
            {/* Header with Image Thumbnail & Status */}
            <div className="flex items-start justify-between gap-3 border-b border-pink-100 dark:border-white/10 pb-2.5">
              <div className="flex items-center gap-2.5">
                {hoveredItem.item.imageUrl && (
                  <img 
                    src={hoveredItem.item.imageUrl} 
                    alt={hoveredItem.item.name} 
                    className="w-10 h-10 rounded-xl object-cover border border-pink-200 dark:border-white/10 shadow-xs flex-shrink-0" 
                  />
                )}
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-pink-600 dark:text-pink-400">
                    {hoveredItem.item.category}
                  </span>
                  <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                    {hoveredItem.item.name}
                  </h4>
                </div>
              </div>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md flex-shrink-0 ${
                hoveredItem.item.status === 'Settled' 
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' 
                  : hoveredItem.item.status === 'Partially Paid'
                  ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                  : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
              }`}>
                {hoveredItem.item.status}
              </span>
            </div>

            {/* Quick Vendor & Event Meta */}
            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <div>
                <span className="text-slate-400 text-[10px] block font-semibold">Vendor:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {hoveredItem.item.vendorName || 'Not Booked Yet'}
                </span>
              </div>
              <div>
                <span className="text-slate-400 text-[10px] block font-semibold">Ceremony:</span>
                <span className="font-bold text-slate-800 dark:text-slate-200">
                  {hoveredItem.item.event}
                </span>
              </div>
            </div>

            {/* Split Breakdown */}
            <div className="bg-slate-50 dark:bg-slate-900/80 p-2.5 rounded-xl border border-slate-200/80 dark:border-white/5 space-y-1">
              <div className="flex justify-between font-bold text-slate-900 dark:text-white text-xs">
                <span>Total Amount:</span>
                <span>{formatINR(hoveredItem.item.actualCost || hoveredItem.item.estimatedCost)}</span>
              </div>
              <div className="flex justify-between text-[11px] text-blue-600 dark:text-blue-400">
                <span>Bhuvesh Share:</span>
                <span className="font-semibold">
                  {formatINR(computeExpenseShares(hoveredItem.item, groomGuestCount, brideGuestCount).groomDue)}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-rose-600 dark:text-rose-400">
                <span>Harsha Share:</span>
                <span className="font-semibold">
                  {formatINR(computeExpenseShares(hoveredItem.item, groomGuestCount, brideGuestCount).brideDue)}
                </span>
              </div>
              <div className="flex justify-between text-[11px] text-emerald-600 dark:text-emerald-400 pt-1 border-t border-slate-200/60 dark:border-white/5">
                <span>Advance Cleared:</span>
                <span className="font-bold">{formatINR(hoveredItem.item.paidAmount)}</span>
              </div>
            </div>

            {/* Notes / Special Terms */}
            {hoveredItem.item.notes && (
              <div className="text-[11px] text-slate-600 dark:text-slate-400 bg-pink-50/50 dark:bg-pink-950/20 p-2 rounded-lg border border-pink-100 dark:border-pink-900/30">
                <span className="font-bold text-pink-700 dark:text-pink-300 block text-[10px]">Notes & Inclusions:</span>
                <p className="line-clamp-2 mt-0.5">{hoveredItem.item.notes}</p>
              </div>
            )}
          </div>
        </div>
      )}

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
