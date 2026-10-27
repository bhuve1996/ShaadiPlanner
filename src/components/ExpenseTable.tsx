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
  Building2,
  Pin,
  PinOff,
  Info,
  X,
  Eye,
  EyeOff,
  Lock,
  ChevronDown,
  ChevronRight,
  FolderOpen,
  Folder
} from 'lucide-react';
import { ExpenseItem, ExpenseCategory, WeddingEvent, SplitType } from '@/types/wedding';
import { CategoryIcon } from './CategoryIcon';
import { EVENT_IMAGES } from '@/lib/event-images';
import { computeExpenseShares } from '@/lib/calculator';
import { formatINR } from '@/lib/constants';
import { ExpenseEditModal } from './ExpenseEditModal';

interface ExpenseTableProps {
  expenses: ExpenseItem[];
  groomGuestCount: number;
  brideGuestCount: number;
  eventGuestCounts?: Record<string, { groom: number; bride: number; perPlateRate?: number }>;
  onUpdateExpense: (item: ExpenseItem) => void;
  onDeleteExpense: (id: string) => void;
  onAddNewExpense: (item: ExpenseItem) => void;
  sideFilter: 'ALL' | 'GROOM' | 'BRIDE';
  isSimplifiedView?: boolean;
  showGold?: boolean;
  showShagun?: boolean;
  onRequestUnlock?: (target: 'GOLD' | 'SHAGUN') => void;
  onLock?: (target: 'GOLD' | 'SHAGUN') => void;
}

type SortField = 'name' | 'actualCost' | 'paidAmount' | 'pending' | 'event' | 'category' | 'groomDue' | 'brideDue';
type SortOrder = 'asc' | 'desc';

const ALL_CATEGORIES: ExpenseCategory[] = [
  'Gold & Fine Jewelry',
  'Catering, Food & Sweets',
  'Venue & Accommodation',
  'Attire & Wardrobe',
  'Makeup & Bridal Care',
  'Gifts, Shagun & Favors',
  'Decor & Production',
  'Photography & Cinema',
  'Music & Entertainment',
  'Logistics & Shuttles',
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
  'Vida (Bidai / Doli)',
  'Reception',
];

export const ExpenseTable: React.FC<ExpenseTableProps> = ({
  expenses,
  groomGuestCount,
  brideGuestCount,
  eventGuestCounts,
  onUpdateExpense,
  onDeleteExpense,
  onAddNewExpense,
  sideFilter,
  isSimplifiedView = false,
  showGold = false,
  showShagun = false,
  onRequestUnlock,
  onLock,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedEvent, setSelectedEvent] = useState<string>('ALL');
  const [selectedSplitType, setSelectedSplitType] = useState<string>('ALL');
  const [selectedPayer, setSelectedPayer] = useState<string>('ALL');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [isHeaderSticky, setIsHeaderSticky] = useState<boolean>(false);
  const [groupBySection, setGroupBySection] = useState<boolean>(true);
  // Default all groups to collapsed as requested
  const [collapsedGroups, setCollapsedGroups] = useState<Record<string, boolean>>({
    'Shadi (Wedding Day)': true,
    'Ring Ceremony (Engagement)': true,
    'Haldi & Mehendi': true,
    "Harshu's Outfits & Trousseau": true,
    "Bhuvesh's Outfits & Sherwani": true,
    'Photography & Cinema': true,
    'General & Ceremony Essentials': true,
    'Gold & Jewelry': true,
    'Family Shagun (Rishtedaar Envelopes)': true,
  });

  const toggleGroupCollapse = (groupName: string) => {
    setCollapsedGroups(prev => ({
      ...prev,
      [groupName]: !prev[groupName]
    }));
  };

  const collapseAllGroups = () => {
    const allCollapsed: Record<string, boolean> = {};
    groupedExpenses.forEach(g => {
      allCollapsed[g.groupName] = true;
    });
    setCollapsedGroups(allCollapsed);
  };

  const expandAllGroups = () => {
    setCollapsedGroups({});
  };
  
  // Sorting State
  const [sortField, setSortField] = useState<SortField>('actualCost');
  const [sortOrder, setSortOrder] = useState<SortOrder>('desc');

  // Modal states
  const [editingItem, setEditingItem] = useState<ExpenseItem | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);

  // Info Dossier Popover Card State (Click triggered via ℹ️ icon)
  const [infoItem, setInfoItem] = useState<{ item: ExpenseItem; x: number; y: number } | null>(null);

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
      const matchesPayer = selectedPayer === 'ALL' || (item.payerCategory || 'COUPLE') === selectedPayer;
      const matchesStatus = statusFilter === 'ALL' || item.status === statusFilter;

      let matchesSide = true;
      if (sideFilter === 'GROOM') {
        matchesSide = item.splitType !== 'BRIDE_ONLY';
      } else if (sideFilter === 'BRIDE') {
        matchesSide = item.splitType !== 'GROOM_ONLY';
      }

      // Check Confidential Visibility
      const isGoldItem = item.category === 'Gold & Fine Jewelry' || item.name.toLowerCase().includes('gold');
      if (isGoldItem && !showGold) return false;

      const isShagunItem = item.category === 'Gifts, Shagun & Favors' || item.name.toLowerCase().includes('shagun');
      if (isShagunItem && !showShagun) return false;

      return matchesSearch && matchesCategory && matchesEvent && matchesSplit && matchesPayer && matchesStatus && matchesSide;
    });

    return result.sort((a, b) => {
      let aVal: any = 0;
      let bVal: any = 0;

      const aShares = computeExpenseShares(a, groomGuestCount, brideGuestCount, eventGuestCounts);
      const bShares = computeExpenseShares(b, groomGuestCount, brideGuestCount, eventGuestCounts);

      switch (sortField) {
        case 'name':
          aVal = a.name.toLowerCase();
          bVal = b.name.toLowerCase();
          break;
        case 'actualCost':
          aVal = aShares.effectiveTotalCost;
          bVal = bShares.effectiveTotalCost;
          break;
        case 'paidAmount':
          aVal = a.paidAmount || 0;
          bVal = b.paidAmount || 0;
          break;
        case 'pending':
          aVal = Math.max(0, aShares.effectiveTotalCost - (a.paidAmount || 0));
          bVal = Math.max(0, bShares.effectiveTotalCost - (b.paidAmount || 0));
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
    brideGuestCount,
    eventGuestCounts,
    showGold,
    showShagun
  ]);

  // Grouped tasks structure for collapsible accordion sections
  const groupedExpenses = useMemo(() => {
    const map = new Map<string, ExpenseItem[]>();
    
    // Maintain natural group order from sheet
    const groupOrder = [
      'Shadi (Wedding Day)',
      'Ring Ceremony (Engagement)',
      'Haldi & Mehendi',
      "Harshu's Outfits & Trousseau",
      "Bhuvesh's Outfits & Sherwani",
      'Photography & Cinema',
      'General & Ceremony Essentials',
      'Gold & Jewelry',
      'Family Shagun (Rishtedaar Envelopes)'
    ];

    processedExpenses.forEach(item => {
      const g = item.groupName || 'General & Ceremony Essentials';
      if (!map.has(g)) map.set(g, []);
      map.get(g)!.push(item);
    });

    const groups: {
      groupName: string;
      items: ExpenseItem[];
      totalCost: number;
      brideTotal: number;
      groomTotal: number;
      totalPaid: number;
    }[] = [];

    // First push in defined order
    groupOrder.forEach(gName => {
      if (map.has(gName)) {
        const items = map.get(gName)!;
        let totalCost = 0;
        let brideTotal = 0;
        let groomTotal = 0;
        let totalPaid = 0;
        items.forEach(it => {
          const s = computeExpenseShares(it, groomGuestCount, brideGuestCount, eventGuestCounts);
          totalCost += s.effectiveTotalCost;
          brideTotal += s.brideDue;
          groomTotal += s.groomDue;
          totalPaid += (it.paidAmount || 0);
        });
        groups.push({ groupName: gName, items, totalCost, brideTotal, groomTotal, totalPaid });
        map.delete(gName);
      }
    });

    // Push any remaining groups
    map.forEach((items, gName) => {
      let totalCost = 0;
      let brideTotal = 0;
      let groomTotal = 0;
      let totalPaid = 0;
      items.forEach(it => {
        const s = computeExpenseShares(it, groomGuestCount, brideGuestCount, eventGuestCounts);
        totalCost += s.effectiveTotalCost;
        brideTotal += s.brideDue;
        groomTotal += s.groomDue;
        totalPaid += (it.paidAmount || 0);
      });
      groups.push({ groupName: gName, items, totalCost, brideTotal, groomTotal, totalPaid });
    });

    return groups;
  }, [processedExpenses, groomGuestCount, brideGuestCount, eventGuestCounts]);

  const filteredTotals = useMemo(() => {
    let totalCost = 0;
    let brideTotal = 0;
    let groomTotal = 0;
    let totalPaid = 0;

    for (const item of processedExpenses) {
      const s = computeExpenseShares(item, groomGuestCount, brideGuestCount, eventGuestCounts);
      totalCost += s.effectiveTotalCost;
      brideTotal += s.brideDue;
      groomTotal += s.groomDue;
      totalPaid += (item.paidAmount || 0);
    }

    // Overall wedding grand total across active items respecting confidential visibility
    let grandTotalCost = 0;
    const baseExpenses = expenses.filter(item => {
      const isGoldItem = item.category === 'Gold & Fine Jewelry' || item.name.toLowerCase().includes('gold');
      if (isGoldItem && !showGold) return false;
      const isShagunItem = item.category === 'Gifts, Shagun & Favors' || item.name.toLowerCase().includes('shagun');
      if (isShagunItem && !showShagun) return false;
      return true;
    });

    for (const item of baseExpenses) {
      const s = computeExpenseShares(item, groomGuestCount, brideGuestCount, eventGuestCounts);
      grandTotalCost += s.effectiveTotalCost;
    }

    return { totalCost, brideTotal, groomTotal, totalPaid, grandTotalCost };
  }, [processedExpenses, expenses, groomGuestCount, brideGuestCount, eventGuestCounts, showGold, showShagun]);

  const filteredTotalCost = filteredTotals.totalCost;
  const filteredTotalPaid = filteredTotals.totalPaid;

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
      <div className="theme-card bg-white dark:bg-[#11141D] rounded-3xl border border-slate-200 dark:border-white/10 shadow-lg overflow-hidden transition-all">
        
        {/* Top Control Bar: Crisp neutral obsidian / slate backdrop */}
        <div className="p-5 sm:p-6 border-b border-slate-200 dark:border-white/10 flex flex-col gap-4 bg-slate-50/80 dark:bg-slate-900/70">
          
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-2">
                <Flower2 className="text-pink-500 w-5 h-5 animate-spin-slow flex-shrink-0" />
                <h2 className="text-lg font-black tracking-tight text-slate-900 dark:text-white whitespace-nowrap">
                  Wedding Registry & Color-Coded Splits
                </h2>
              </div>
              
              <div className="flex items-center gap-2">
                {sideFilter === 'GROOM' && (
                  <span className="text-xs bg-sky-100 dark:bg-blue-950/70 text-blue-700 dark:text-blue-300 border border-blue-300 dark:border-blue-600 font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
                    🤵 Bhuvesh (Blue) + Shared
                  </span>
                )}
                {sideFilter === 'BRIDE' && (
                  <span className="text-xs bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-600 font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
                    👰 Harshu (Pink) + Shared
                  </span>
                )}
                {sideFilter === 'ALL' && (
                  <span className="text-xs bg-purple-100 dark:bg-purple-950/70 text-purple-800 dark:text-purple-300 border border-purple-300 dark:border-purple-600 font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
                    🌸 Mixed Mutual (All)
                  </span>
                )}
                <span className="text-xs bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 font-black px-2.5 py-1 rounded-full border border-slate-300 dark:border-slate-700 whitespace-nowrap">
                  {processedExpenses.length} items
                </span>
              </div>
            </div>

            {/* Top Action Buttons: cleanly aligned in a single row */}
            <div className="flex items-center gap-2 self-start lg:self-auto flex-wrap">
              {/* Group Accordion Toggle */}
              <button
                type="button"
                onClick={() => setGroupBySection(prev => !prev)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer border shadow-xs whitespace-nowrap ${
                  groupBySection
                    ? 'bg-purple-100 text-purple-900 dark:bg-purple-950/80 dark:text-purple-200 border-purple-300 dark:border-purple-700'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300'
                }`}
                title="Toggle group accordions"
              >
                <FolderOpen size={13} className="text-purple-600 dark:text-purple-400" />
                <span>Groups: <strong>{groupBySection ? 'ON' : 'OFF'}</strong></span>
              </button>

              {groupBySection && (
                <div className="flex items-center gap-1 text-[11px] font-bold">
                  <button
                    type="button"
                    onClick={expandAllGroups}
                    className="px-2.5 py-2 rounded-xl bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-white/10 cursor-pointer whitespace-nowrap transition-colors"
                  >
                    Expand
                  </button>
                  <button
                    type="button"
                    onClick={collapseAllGroups}
                    className="px-2.5 py-2 rounded-xl bg-slate-200/80 hover:bg-slate-300 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-300 dark:border-white/10 cursor-pointer whitespace-nowrap transition-colors"
                  >
                    Collapse
                  </button>
                </div>
              )}

              {/* Add Expense Button */}
              <button
                onClick={handleOpenAddModal}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-pink-500 via-rose-500 to-blue-500 text-white text-xs font-black shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer whitespace-nowrap"
              >
                <Plus size={15} />
                <span>Add Expense</span>
              </button>
            </div>
          </div>

          {/* Filter Inputs Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5 pt-2">
            
            {/* 1. Search Box */}
            <div className="relative">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search vendor, item, notes..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-[#1A1F2E] border-2 border-slate-300 dark:border-white/20 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:border-slate-600 dark:focus:border-white font-medium shadow-xs"
              />
            </div>

            {/* 2. Occasion Filter */}
            <select
              value={selectedEvent}
              onChange={(e) => setSelectedEvent(e.target.value)}
              className="text-xs bg-white dark:bg-[#1A1F2E] border-2 border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-bold focus:outline-none focus:border-slate-600 dark:focus:border-white shadow-xs cursor-pointer"
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
              className="text-xs bg-white dark:bg-[#1A1F2E] border-2 border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-bold focus:outline-none focus:border-slate-600 dark:focus:border-white shadow-xs cursor-pointer"
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
              className="text-xs bg-white dark:bg-[#1A1F2E] border-2 border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-bold focus:outline-none focus:border-slate-600 dark:focus:border-white shadow-xs cursor-pointer"
            >
              <option value="ALL">✨ All Split Rules</option>
              <option value="BRIDE_ONLY">Harshu (100% Bride)</option>
              <option value="GROOM_ONLY">Bhuvi (100% Groom)</option>
              <option value="GUEST_RATIO">Guest Ratio Split</option>
              <option value="EQUAL_50_50">50:50 Shared Equal</option>
            </select>

            {/* 5. Sub-Category: Couple vs Parents vs Joint */}
            <select
              value={selectedPayer}
              onChange={(e) => setSelectedPayer(e.target.value)}
              className="text-xs bg-white dark:bg-[#1A1F2E] border-2 border-slate-300 dark:border-white/20 rounded-xl px-3 py-2 text-slate-900 dark:text-white font-bold focus:outline-none focus:border-slate-600 dark:focus:border-white shadow-xs cursor-pointer"
            >
              <option value="ALL">All (Self & Parents)</option>
              <option value="COUPLE">Self (Harshu & Bhuvi)</option>
              <option value="PARENTS">Parents / Elders</option>
              <option value="SHARED_FAMILY">Joint Family</option>
            </select>

          </div>

        </div>

        {/* Quick Filter Pill Summary & Status Pills (Hidden in Simple View) */}
        {!isSimplifiedView && (
          <div className="px-5 sm:px-6 py-2.5 bg-slate-100/70 dark:bg-slate-900/90 border-b border-slate-200 dark:border-white/10 flex flex-wrap items-center justify-between text-xs text-slate-700 dark:text-slate-300 gap-3">
            <div className="flex flex-wrap items-center gap-3">
              <span>Filtered: <strong className="text-slate-900 dark:text-white">{processedExpenses.length}</strong></span>
              <span>Total: <strong className="text-purple-700 dark:text-purple-300 font-bold">{formatINR(filteredTotalCost)}</strong></span>
              <span>Paid: <strong className="text-emerald-700 dark:text-emerald-300 font-bold">{formatINR(filteredTotalPaid)}</strong></span>
              <span>Pending: <strong className="text-rose-700 dark:text-rose-300 font-bold">{formatINR(filteredTotalCost - filteredTotalPaid)}</strong></span>
            </div>

            {/* Action buttons (Sticky Header & Non-simple filters) */}
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5">
                <span className="text-[11px] text-slate-500 dark:text-slate-400 uppercase font-bold mr-1">Status:</span>
                {['ALL', 'Estimated', 'Partially Paid', 'Settled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer ${
                      statusFilter === st 
                        ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs' 
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-700 hidden sm:block" />

              {/* Freeze / Sticky Headers Toggle Option */}
              <button
                onClick={() => setIsHeaderSticky(prev => !prev)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-xl text-[11px] font-bold transition-all cursor-pointer border shadow-xs ${
                  isHeaderSticky
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-500 hover:bg-slate-50 dark:hover:bg-slate-700'
                }`}
                title={isHeaderSticky ? 'Header rows frozen at top (Sticky ON)' : 'Click to freeze header rows at top'}
              >
                {isHeaderSticky ? (
                  <>
                    <Pin size={12} className="rotate-45" />
                    <span>Freeze Header: <strong>ON</strong></span>
                  </>
                ) : (
                  <>
                    <PinOff size={12} className="text-slate-400" />
                    <span>Freeze Header: <strong>OFF</strong></span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Interactive Sortable Table */}
        <div className={`overflow-x-auto w-full ${isHeaderSticky ? 'max-h-[70vh] overflow-y-auto' : ''}`}>
          <table className={`w-full text-left text-xs border-collapse ${isSimplifiedView ? 'table-auto' : 'min-w-[1100px]'}`}>
            <thead className={isHeaderSticky ? 'sticky top-0 z-20 shadow-xs' : ''}>
              <tr className="bg-slate-200 dark:bg-slate-900 text-slate-900 dark:text-slate-200 uppercase tracking-wider text-[11px] font-black border-b border-slate-300 dark:border-white/15 divide-x divide-slate-300 dark:divide-white/10">
                
                {/* 1. Item Name */}
                <th 
                  onClick={() => handleSort('name')}
                  className={`py-3.5 px-4 cursor-pointer hover:text-slate-950 dark:hover:text-white transition-colors group select-none ${isSimplifiedView ? 'w-auto' : 'w-[320px]'}`}
                >
                  <div className="flex items-center">
                    <span>Expense Item</span>
                    {renderSortIndicator('name')}
                  </div>
                </th>

                {/* 2. Occasion & Guests (Hidden in Simple View) */}
                {!isSimplifiedView && (
                  <th 
                    onClick={() => handleSort('event')}
                    className="py-3 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors group select-none w-[170px]"
                  >
                    <div className="flex items-center">
                      <span>Occasion</span>
                      {renderSortIndicator('event')}
                    </div>
                  </th>
                )}

                {/* 3. Responsibility & Split (Combined editable column for Side + Tier) - Hidden in Simple View */}
                {!isSimplifiedView && (
                  <th className="py-3 px-3 text-center w-[165px]">
                    <span>Payer & Share</span>
                  </th>
                )}

                {/* 4. Cost / Share Column */}
                <th 
                  onClick={() => handleSort(isSimplifiedView && sideFilter === 'BRIDE' ? 'brideDue' : isSimplifiedView && sideFilter === 'GROOM' ? 'groomDue' : 'actualCost')}
                  className={`py-2 px-3 ${isSimplifiedView && sideFilter === 'ALL' ? 'text-center' : 'text-right'} cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors group select-none ${isSimplifiedView ? (sideFilter === 'ALL' ? 'w-[260px]' : 'w-[140px]') : 'w-[130px]'}`}
                >
                  <div className={`flex items-center ${isSimplifiedView && sideFilter === 'ALL' ? 'justify-center' : 'justify-end'}`}>
                    <span>
                      {isSimplifiedView && sideFilter === 'BRIDE' 
                        ? 'Harshu Share' 
                        : isSimplifiedView && sideFilter === 'GROOM' 
                        ? 'Bhuvi Share' 
                        : 'Total Cost'}
                    </span>
                    {renderSortIndicator(isSimplifiedView && sideFilter === 'BRIDE' ? 'brideDue' : isSimplifiedView && sideFilter === 'GROOM' ? 'groomDue' : 'actualCost')}
                  </div>
                </th>

                {!isSimplifiedView && (
                  <>
                    {/* 5. Bride Spend (130px) */}
                    <th 
                      onClick={() => handleSort('brideDue')}
                      className="py-3.5 px-4 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors group select-none w-[130px]"
                    >
                      <div className="flex items-center justify-end">
                        <span>Harshu Spend</span>
                        {renderSortIndicator('brideDue')}
                      </div>
                    </th>

                    {/* 6. Groom Spend (130px) */}
                    <th 
                      onClick={() => handleSort('groomDue')}
                      className="py-3.5 px-4 text-right cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors group select-none w-[130px]"
                    >
                      <div className="flex items-center justify-end">
                        <span>Bhuvesh Spend</span>
                        {renderSortIndicator('groomDue')}
                      </div>
                    </th>

                    {/* 7. Paid & Progress (160px) */}
                    <th 
                      onClick={() => handleSort('paidAmount')}
                      className="py-3.5 px-4 cursor-pointer hover:text-slate-900 dark:hover:text-white transition-colors group select-none w-[160px]"
                    >
                      <div className="flex items-center">
                        <span>Payment Progress</span>
                        {renderSortIndicator('paidAmount')}
                      </div>
                    </th>

                    {/* 8. Actions (90px) - Hidden in Simple View */}
                    <th className="py-3.5 px-4 text-center w-[90px]">Actions</th>
                  </>
                )}
              </tr>
            </thead>

            <tbody className="divide-y divide-pink-100/60 dark:divide-white/5">
              {processedExpenses.length === 0 ? (
                <tr>
                  <td colSpan={isSimplifiedView ? 2 : 8} className="py-16 text-center text-slate-400">
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
                (() => {
                  const renderRow = (item: ExpenseItem) => {
                    const shares = computeExpenseShares(
                      item,
                      groomGuestCount,
                      brideGuestCount,
                      eventGuestCounts
                    );

                    const isFullyPaid = item.paidAmount >= item.actualCost && item.actualCost > 0;
                    const percentPaid = Math.min(100, Math.round((item.paidAmount / (item.actualCost || 1)) * 100));
                    const rowClass = getRowClassName(item.splitType);

                    return (
                      <tr 
                        key={item.id} 
                        className={`cursor-pointer ${rowClass} group transition-all duration-200 select-none divide-x divide-slate-200/70 dark:divide-white/5`}
                        onClick={() => {
                          setEditingItem(item);
                          setShowAddModal(false);
                        }}
                      >
                        {/* 1. Item Name Cell */}
                        <td className={isSimplifiedView ? 'py-1.5 px-3' : 'py-3 px-4'}>
                          {isSimplifiedView ? (
                            /* Simple Minimal View: Single line item name with subtle left split accent */
                            <div className="relative flex items-center pl-3 py-1 text-[13px] font-bold text-slate-900 dark:text-white group-hover:text-pink-600 dark:group-hover:text-pink-400 transition-colors">
                              <div 
                                className={`absolute left-0 top-1 bottom-1 w-1 rounded-r-full ${
                                  item.splitType === 'BRIDE_ONLY'
                                    ? 'bg-rose-500'
                                    : item.splitType === 'GROOM_ONLY'
                                    ? 'bg-sky-500'
                                    : 'bg-emerald-500'
                                }`}
                              />
                              <span className="truncate">{item.name}</span>
                            </div>
                          ) : (
                            /* Detailed Rich View */
                            <div className="relative flex items-center gap-3 bg-slate-50/80 dark:bg-white/[0.03] pl-3.5 pr-3 py-2.5 rounded-2xl border border-slate-200/80 dark:border-white/10 group-hover:border-slate-300 dark:group-hover:border-white/20 group-hover:bg-white dark:group-hover:bg-white/[0.05] group-hover:shadow-xs transition-all overflow-hidden">
                              <div 
                                className={`absolute left-0 top-2 bottom-2 w-1.5 rounded-r-full ${
                                  item.splitType === 'BRIDE_ONLY'
                                    ? 'bg-gradient-to-b from-rose-400 to-pink-500 shadow-sm'
                                    : item.splitType === 'GROOM_ONLY'
                                    ? 'bg-gradient-to-b from-blue-400 to-indigo-500 shadow-sm'
                                    : 'bg-gradient-to-b from-emerald-400 to-teal-500 shadow-sm'
                                }`}
                                title={
                                  item.splitType === 'BRIDE_ONLY'
                                    ? 'Harshu 100%'
                                    : item.splitType === 'GROOM_ONLY'
                                    ? 'Bhuvi 100%'
                                    : 'Shared / Mutual'
                                }
                              />

                              {/* Photographic Thumbnail or Icon */}
                              <div className="relative w-11 h-11 rounded-xl overflow-hidden flex-shrink-0 border border-slate-200/80 dark:border-white/10 shadow-xs bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                                {item.imageUrl ? (
                                  <img 
                                    src={item.imageUrl} 
                                    alt={item.name} 
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                    onError={(e) => {
                                      (e.currentTarget as HTMLElement).style.display = 'none';
                                    }}
                                  />
                                ) : (
                                  <CategoryIcon category={item.category} size={20} />
                                )}
                              </div>
                              
                              <div className="flex-1 min-w-0">
                                {/* Crisp Title */}
                                <div className="flex items-center gap-1.5">
                                  <span className="font-bold text-slate-900 dark:text-white group-hover:text-slate-700 dark:group-hover:text-slate-200 transition-colors text-[13px] leading-tight tracking-tight">
                                    {item.name}
                                  </span>
                                  
                                  {/* Info ℹ️ Button to show breakdown card on click */}
                                  <button
                                    type="button"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      const rect = e.currentTarget.getBoundingClientRect();
                                      if (infoItem?.item.id === item.id) {
                                        setInfoItem(null);
                                      } else {
                                        setInfoItem({ 
                                          item, 
                                          x: Math.min(rect.left, typeof window !== 'undefined' ? window.innerWidth - 380 : 500), 
                                          y: rect.bottom + 8 
                                        });
                                      }
                                    }}
                                    className={`p-1 rounded-md transition-colors cursor-pointer ${
                                      infoItem?.item.id === item.id
                                        ? 'text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-950/60'
                                        : 'text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-800'
                                    }`}
                                    title="Click to view detailed item breakdown & split notes"
                                  >
                                    <Info size={12} />
                                  </button>
                                </div>

                                {/* Subtitle / Sub-detail Note */}
                                {item.notes && (
                                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium line-clamp-1 mt-0.5">
                                    {item.notes.split('•')[0].trim()}
                                  </div>
                                )}

                                {/* Metadata Mini-Chips Strip */}
                                <div className="mt-1.5 flex flex-wrap items-center gap-1.5 text-xs">
                                  {/* Category Mini-Chip */}
                                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-md bg-white dark:bg-slate-800 text-[10px] font-semibold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 shadow-2xs">
                                    {item.category}
                                  </span>

                                  {/* Vendor Mini-Chip */}
                                  {item.vendorName && (
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white dark:bg-slate-800 text-[10px] font-medium text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-white/10 shadow-2xs">
                                      <Building2 size={10} className="text-slate-400 flex-shrink-0" />
                                      <span className="truncate max-w-[130px]">{item.vendorName}</span>
                                    </span>
                                  )}

                                  {/* Due Date Mini-Chip */}
                                  {item.dueDate && (
                                    <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-white dark:bg-slate-800 text-[10px] font-medium text-slate-500 dark:text-slate-400 border border-slate-200 dark:border-white/10 shadow-2xs">
                                      <Clock size={9} />
                                      <span>{item.dueDate}</span>
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>
                          )}
                        </td>

                        {/* 2. Occasion (Hidden in Simple View) */}
                        {!isSimplifiedView && (
                          <td className="py-3 px-4 whitespace-nowrap">
                            <div className="space-y-1.5">
                              <div className="flex items-center gap-2 p-1 pr-2.5 rounded-xl bg-white/90 dark:bg-slate-800/90 border border-slate-200/90 dark:border-white/10 shadow-2xs w-fit">
                                <div className="relative w-7 h-7 rounded-lg overflow-hidden flex-shrink-0 border border-pink-200 dark:border-white/10">
                                  <img 
                                    src={EVENT_IMAGES[item.event]?.image || EVENT_IMAGES['All Events'].image} 
                                    alt={item.event} 
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                                <span className="text-xs font-black text-slate-800 dark:text-slate-200">
                                  {item.event}
                                </span>
                              </div>
                              
                              {shares.isCustomOccasionGuests ? (
                                <div className="flex items-center gap-1 text-[10px] text-purple-700 dark:text-purple-300 font-bold bg-purple-100/80 dark:bg-purple-950/60 px-2 py-0.5 rounded-md border border-purple-200 dark:border-purple-800">
                                  <Users size={11} className="text-purple-600 dark:text-purple-400" />
                                  <span>{shares.effectiveGroomGuests + shares.effectiveBrideGuests} Guests ({shares.effectiveGroomGuests}B : {shares.effectiveBrideGuests}H)</span>
                                </div>
                              ) : (
                                <div className="text-[10px] text-slate-400 dark:text-slate-500 font-medium pl-1">
                                  Global: {groomGuestCount + brideGuestCount} Guests
                                </div>
                              )}
                            </div>
                          </td>
                        )}

                        {/* 3. Combined Side & Responsibility Column (Hidden in Simple View) */}
                        {!isSimplifiedView && (
                          <td 
                            className="py-3 px-3 text-center whitespace-nowrap"
                            onClick={(e) => e.stopPropagation()}
                          >
                            <div className="inline-flex flex-col items-center gap-1.5 p-1 rounded-xl bg-slate-100/70 dark:bg-slate-800/60 border border-slate-200/80 dark:border-white/10 shadow-2xs">
                              <div className="relative w-full">
                                <select
                                  value={item.splitType}
                                  onChange={(e) => {
                                    onUpdateExpense({
                                      ...item,
                                      splitType: e.target.value as SplitType,
                                    });
                                  }}
                                  className={`text-[11px] font-black px-2 py-1 rounded-lg border text-center cursor-pointer transition-all w-[130px] focus:outline-none focus:ring-1 focus:ring-pink-400 ${
                                    item.splitType === 'BRIDE_ONLY'
                                      ? 'bg-rose-50 border-rose-200 text-rose-700 dark:bg-rose-950/70 dark:border-rose-800 dark:text-rose-300'
                                      : item.splitType === 'GROOM_ONLY'
                                      ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/70 dark:border-blue-800 dark:text-blue-300'
                                      : item.splitType === 'GUEST_RATIO'
                                      ? 'bg-purple-50 border-purple-200 text-purple-700 dark:bg-purple-950/70 dark:border-purple-800 dark:text-purple-300'
                                      : 'bg-emerald-50 border-emerald-200 text-emerald-700 dark:bg-emerald-950/70 dark:border-emerald-800 dark:text-emerald-300'
                                  }`}
                                  style={{ paddingRight: '1.6rem', backgroundPosition: 'right 0.55rem center' }}
                                >
                                  <option value="BRIDE_ONLY" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">👰 Harshu (100%)</option>
                                  <option value="GROOM_ONLY" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">🤵 Bhuvi (100%)</option>
                                  <option value="EQUAL_50_50" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">🤝 Split 50:50</option>
                                  <option value="GUEST_RATIO" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">👥 Guest Ratio</option>
                                </select>
                              </div>

                              <div className="relative w-full">
                                <select
                                  value={item.payerCategory || 'COUPLE'}
                                  onChange={(e) => {
                                    onUpdateExpense({
                                      ...item,
                                      payerCategory: e.target.value as any,
                                    });
                                  }}
                                  className="text-[10px] font-bold px-2 py-0.5 rounded-md border border-slate-300 dark:border-white/15 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:border-slate-400 text-center cursor-pointer transition-all w-[130px] focus:outline-none"
                                  style={{ paddingRight: '1.6rem', backgroundPosition: 'right 0.55rem center' }}
                                >
                                  <option value="PARENTS" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">👨‍👩‍👦 Parents</option>
                                  <option value="COUPLE" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">💍 Self</option>
                                  <option value="SHARED_FAMILY" className="bg-white dark:bg-slate-900 text-slate-900 dark:text-white">🏡 Family</option>
                                </select>
                              </div>
                            </div>
                          </td>
                        )}

                        {/* 4. Cost / Share Display (Compact in Simple View) */}
                        <td className={`${isSimplifiedView ? 'py-1.5 px-3' : 'py-4 px-4'} ${isSimplifiedView && sideFilter === 'ALL' ? 'text-center' : 'text-right'} whitespace-nowrap`}>
                          <div className={`font-bold text-slate-900 dark:text-white font-mono ${isSimplifiedView ? 'text-sm' : 'text-base'}`}>
                            {formatINR(
                              isSimplifiedView && sideFilter === 'BRIDE'
                                ? shares.brideDue
                                : isSimplifiedView && sideFilter === 'GROOM'
                                ? shares.groomDue
                                : shares.effectiveTotalCost
                            )}
                          </div>
                          {isSimplifiedView && sideFilter === 'ALL' ? (
                            <div className="flex flex-col items-center mt-0.5 w-full">
                              <div className="flex items-center justify-center gap-1.5 text-[10px] font-semibold tracking-tight w-full">
                                <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 bg-rose-50/80 dark:bg-rose-950/40 px-1.5 py-0.5 rounded border border-rose-200/60 dark:border-rose-900/40 min-w-[90px] justify-center">
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                                  👰 Harshu: {formatINR(shares.brideDue)}
                                </span>

                                <svg className="w-5 h-3 text-slate-400 shrink-0" viewBox="0 0 24 16" fill="none">
                                  <path d="M12 0v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                  <path d="M12 5C12 11 2 9 2 15" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" />
                                  <path d="M12 5C12 11 22 9 22 15" stroke="#0ea5e9" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>

                                <span className="inline-flex items-center gap-1 text-sky-600 dark:text-sky-400 bg-sky-50/80 dark:bg-sky-950/40 px-1.5 py-0.5 rounded border border-sky-200/60 dark:border-sky-900/40 min-w-[90px] justify-center">
                                  <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                                  🤵 Bhuvi: {formatINR(shares.groomDue)}
                                </span>
                              </div>
                            </div>
                          ) : isSimplifiedView && sideFilter !== 'ALL' ? (
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                              Total: {formatINR(shares.effectiveTotalCost)} ({sideFilter === 'BRIDE' ? shares.bridePercent : shares.groomPercent}%)
                            </div>
                          ) : item.isPerPlateCalculation && shares.effectivePlateRate > 0 ? (
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                              ₹{shares.effectivePlateRate.toLocaleString('en-IN')}/plate
                            </div>
                          ) : (item.name.toLowerCase().includes('mitha') || item.name.toLowerCase().includes('sweets') || item.name.toLowerCase().includes('bhaji')) && (item.ratePerGuestOrPlate || 0) > 0 ? (
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                              ₹{(item.ratePerGuestOrPlate || 800).toLocaleString('en-IN')}/box
                            </div>
                          ) : null}
                        </td>

                        {!isSimplifiedView && (
                          <>
                            {/* 5. Bride Share */}
                            <td className="py-4 px-4 text-right whitespace-nowrap font-sans">
                              <div className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                                {formatINR(shares.brideDue)}
                              </div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                                {shares.bridePercent}% by Harshu
                              </div>
                            </td>

                            {/* 6. Groom Share */}
                            <td className="py-4 px-4 text-right whitespace-nowrap font-sans">
                              <div className="font-bold text-slate-800 dark:text-slate-100 text-sm">
                                {formatINR(shares.groomDue)}
                              </div>
                              <div className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                                {shares.groomPercent}% by Bhuvesh
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
                                      isFullyPaid ? 'bg-emerald-500' : 'bg-slate-700 dark:bg-slate-300'
                                    }`} 
                                    style={{ width: `${percentPaid}%` }}
                                  />
                                </div>
                                <div className="flex items-center justify-between text-[10px] text-slate-500 dark:text-slate-400">
                                  <span>By: <strong className="text-slate-800 dark:text-slate-200">{item.paidBy === 'SHARED' ? 'Both' : item.paidBy === 'GROOM' ? 'Bhuvesh' : item.paidBy === 'BRIDE' ? 'Harshu' : 'Unpaid'}</strong></span>
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

                            {/* 8. Actions (Hidden in Simple View) */}
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
                          </>
                        )}
                      </tr>
                    );
                  };

                  if (groupBySection) {
                    return groupedExpenses.map(group => {
                      const isCollapsed = collapsedGroups[group.groupName] || false;
                      const groupDisplayCost = sideFilter === 'BRIDE' 
                        ? group.brideTotal 
                        : sideFilter === 'GROOM' 
                        ? group.groomTotal 
                        : group.totalCost;

                      return (
                        <React.Fragment key={group.groupName}>
                          {/* Accordion Group Header Row */}
                          <tr 
                            onClick={() => toggleGroupCollapse(group.groupName)}
                            className="bg-slate-100/90 hover:bg-slate-200/90 dark:bg-slate-900/90 dark:hover:bg-slate-800/90 cursor-pointer select-none border-y border-slate-300 dark:border-white/10 transition-colors"
                          >
                            <td 
                              colSpan={isSimplifiedView ? 2 : 8} 
                              className="py-2.5 px-3 sm:px-4"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  {isCollapsed ? (
                                    <ChevronRight size={16} className="text-purple-600 dark:text-purple-400" />
                                  ) : (
                                    <ChevronDown size={16} className="text-purple-600 dark:text-purple-400" />
                                  )}
                                  <span className="font-black text-slate-900 dark:text-white text-xs sm:text-sm">
                                    {group.groupName}
                                  </span>
                                  <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-purple-100 dark:bg-purple-950/80 text-purple-700 dark:text-purple-300 border border-purple-200 dark:border-purple-800">
                                    {group.items.length} {group.items.length === 1 ? 'task' : 'tasks'}
                                  </span>
                                </div>

                                <div className="flex items-center gap-3 text-xs">
                                  <div className="flex items-center gap-1.5 font-mono font-bold text-slate-900 dark:text-white">
                                    <span>{formatINR(groupDisplayCost)}</span>
                                  </div>
                                  {!isSimplifiedView && (
                                    <div className="hidden sm:flex items-center gap-2 text-[11px]">
                                      <span className="text-rose-600 dark:text-rose-400 font-semibold">
                                        👰 {formatINR(group.brideTotal)}
                                      </span>
                                      <span className="text-sky-600 dark:text-sky-400 font-semibold">
                                        🤵 {formatINR(group.groomTotal)}
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </td>
                          </tr>

                          {/* Accordion Group Items */}
                          {!isCollapsed && group.items.map(renderRow)}
                        </React.Fragment>
                      );
                    });
                  }

                  return processedExpenses.map(renderRow);
                })()
              )}
            </tbody>

            {/* Summing Up Totals Footer Row */}
            {processedExpenses.length > 0 && (
              <tfoot className="border-t-2 border-slate-300 dark:border-white/20 bg-slate-100/90 dark:bg-[#121624] font-black text-xs text-slate-900 dark:text-white sticky bottom-0 z-10 shadow-xs divide-x divide-slate-300 dark:divide-white/10">
                <tr>
                  {/* 1. Item Name Total Label */}
                  <td className="py-3.5 px-4 font-bold text-slate-800 dark:text-slate-200">
                    <div className="flex items-center gap-2">
                      <span className="text-sm">Σ</span>
                      <span>
                        Total ({processedExpenses.length} {processedExpenses.length === 1 ? 'item' : 'items'})
                      </span>
                    </div>
                  </td>

                  {/* 2. Occasion (Hidden in simple view) */}
                  {!isSimplifiedView && (
                    <td className="py-3.5 px-4 text-slate-500 dark:text-slate-400 font-medium text-[11px]">
                      Filtered Total
                    </td>
                  )}

                  {/* 3. Responsibility & Split (Hidden in Simple View) */}
                  {!isSimplifiedView && (
                    <td className="py-3.5 px-3 text-center text-slate-500 dark:text-slate-400 font-medium text-[11px]">
                      {sideFilter === 'BRIDE' ? '👰 Harshu View' : sideFilter === 'GROOM' ? '🤵 Bhuvi View' : 'Combined Split'}
                    </td>
                  )}

                  {/* 4. Actual Cost / Share Total */}
                  <td className={`py-2 px-3 ${isSimplifiedView && sideFilter === 'ALL' ? 'text-center' : 'text-right'} whitespace-nowrap font-mono text-sm sm:text-base font-black text-slate-900 dark:text-white`}>
                    <div>
                      {formatINR(
                        isSimplifiedView && sideFilter === 'BRIDE'
                          ? filteredTotals.brideTotal
                          : isSimplifiedView && sideFilter === 'GROOM'
                          ? filteredTotals.groomTotal
                          : filteredTotals.totalCost
                      )}
                    </div>
                    {isSimplifiedView && sideFilter === 'ALL' ? (
                      <div className="flex flex-col items-center mt-1 w-full">
                        <div className="flex items-center justify-center gap-2 text-[10.5px] font-sans font-bold w-full">
                          <span className="inline-flex items-center gap-1 text-rose-600 dark:text-rose-400 bg-rose-50/80 dark:bg-rose-950/40 px-1.5 py-0.5 rounded border border-rose-200/60 dark:border-rose-900/40 min-w-[95px] justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse" />
                            👰 Harshu: {formatINR(filteredTotals.brideTotal)}
                          </span>

                          {/* Symmetrical tree split icon / branching bridge */}
                          <svg className="w-6 h-4 text-slate-400 dark:text-slate-500 shrink-0" viewBox="0 0 24 16" fill="none">
                            <path d="M12 0v5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M12 5C12 11 2 9 2 15" stroke="#f43f5e" strokeWidth="1.5" strokeLinecap="round" />
                            <path d="M12 5C12 11 22 9 22 15" stroke="#0ea5e9" strokeWidth="1.5" strokeLinecap="round" />
                          </svg>

                          <span className="inline-flex items-center gap-1 text-sky-600 dark:text-sky-400 bg-sky-50/80 dark:bg-sky-950/40 px-1.5 py-0.5 rounded border border-sky-200/60 dark:border-sky-900/40 min-w-[95px] justify-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-sky-500" />
                            🤵 Bhuvi: {formatINR(filteredTotals.groomTotal)}
                          </span>
                        </div>
                      </div>
                    ) : isSimplifiedView && sideFilter !== 'ALL' ? (
                      <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                        Wedding Total: {formatINR(filteredTotals.grandTotalCost)}
                      </div>
                    ) : null}
                  </td>

                  {/* Columns in Detailed View */}
                  {!isSimplifiedView && (
                    <>
                      {/* 5. Harshu Total */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono text-sm font-bold text-rose-600 dark:text-rose-400">
                        {formatINR(filteredTotals.brideTotal)}
                      </td>

                      {/* 6. Bhuvi Total */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap font-mono text-sm font-bold text-blue-600 dark:text-blue-400">
                        {formatINR(filteredTotals.groomTotal)}
                      </td>

                      {/* 7. Paid Amount Total */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex flex-col gap-1 w-36">
                          <div className="flex justify-between text-[11px] font-bold text-slate-700 dark:text-slate-300">
                            <span>Paid: {formatINR(filteredTotals.totalPaid)}</span>
                            <span>{Math.min(100, Math.round((filteredTotals.totalPaid / (filteredTotals.totalCost || 1)) * 100))}%</span>
                          </div>
                          <div className="text-[10px] text-slate-500 dark:text-slate-400 font-normal">
                            Pending: {formatINR(Math.max(0, filteredTotals.totalCost - filteredTotals.totalPaid))}
                          </div>
                        </div>
                      </td>

                      {/* 8. Actions column spacer */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="text-[10px] text-slate-400">✓</span>
                      </td>
                    </>
                  )}
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </div>

      {/* Click-Triggered Info Dossier Card */}
      {infoItem && (
        <>
          {/* Backdrop click interceptor to dismiss popover cleanly */}
          <div 
            className="fixed inset-0 z-40" 
            onClick={() => setInfoItem(null)} 
          />

          {/* Responsive positioning: Centered bottom drawer on mobile, floating anchor on desktop */}
          <div 
            className="fixed z-50 animate-in fade-in zoom-in-95 duration-150 sm:max-w-[360px] w-[calc(100vw-24px)] max-w-sm"
            style={{
              left: typeof window !== 'undefined' && window.innerWidth >= 640 
                ? Math.min(infoItem.x, window.innerWidth - 380) 
                : '50%',
              top: typeof window !== 'undefined' && window.innerWidth >= 640 
                ? Math.min(infoItem.y, window.innerHeight - 340) 
                : 'auto',
              bottom: typeof window !== 'undefined' && window.innerWidth < 640 ? '16px' : 'auto',
              transform: typeof window !== 'undefined' && window.innerWidth < 640 ? 'translateX(-50%)' : 'none'
            }}
          >
            <div className="bg-white/95 dark:bg-[#151A2E]/95 backdrop-blur-xl p-4 rounded-2xl shadow-2xl border-2 border-slate-300 dark:border-white/20 text-xs space-y-2.5">
              {/* Header with Image Thumbnail, Status & Close Button */}
              <div className="flex items-start justify-between gap-3 border-b border-slate-200 dark:border-white/10 pb-2.5">
                <div className="flex items-center gap-2.5">
                  {infoItem.item.imageUrl && (
                    <img 
                      src={infoItem.item.imageUrl} 
                      alt={infoItem.item.name} 
                      className="w-10 h-10 rounded-xl object-cover border border-slate-200 dark:border-white/10 shadow-xs flex-shrink-0" 
                    />
                  )}
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      {infoItem.item.category}
                    </span>
                    <h4 className="font-extrabold text-sm text-slate-900 dark:text-white leading-tight">
                      {infoItem.item.name}
                    </h4>
                  </div>
                </div>
                
                <div className="flex items-center gap-1.5 flex-shrink-0">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                    infoItem.item.status === 'Settled' 
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300' 
                      : infoItem.item.status === 'Partially Paid'
                      ? 'bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                  }`}>
                    {infoItem.item.status}
                  </span>
                  
                  <button
                    onClick={() => setInfoItem(null)}
                    className="p-1 text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
                    title="Close info"
                  >
                    <X size={14} />
                  </button>
                </div>
              </div>

              {/* Quick Vendor & Event Meta */}
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-slate-400 text-[10px] block font-semibold">Vendor:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {infoItem.item.vendorName || 'Not Booked Yet'}
                  </span>
                </div>
                <div>
                  <span className="text-slate-400 text-[10px] block font-semibold">Ceremony:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200">
                    {infoItem.item.event}
                  </span>
                </div>
                <div className="col-span-2 pt-1 border-t border-slate-200/50 dark:border-white/5 flex items-center justify-between">
                  <span className="text-slate-400 text-[10px] font-semibold">Responsibility:</span>
                  <span className="font-bold text-slate-700 dark:text-slate-200">
                    {infoItem.item.payerCategory === 'PARENTS' ? '👨‍👩‍👧 Parents / Elders Expense' : infoItem.item.payerCategory === 'SHARED_FAMILY' ? '🤝 Joint Family Expense' : '👫 Couple Personal Expense'}
                  </span>
                </div>
              </div>

              {/* Split Breakdown */}
              <div className="bg-slate-50 dark:bg-white/[0.04] p-2.5 rounded-xl border border-slate-200/80 dark:border-white/10 space-y-1.5 font-mono">
                <div className="flex justify-between font-bold text-slate-900 dark:text-white text-xs">
                  <span>Total Amount:</span>
                  <span>{formatINR(computeExpenseShares(infoItem.item, groomGuestCount, brideGuestCount, eventGuestCounts).effectiveTotalCost)}</span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-700 dark:text-slate-300">
                  <span>
                    {infoItem.item.payerCategory === 'PARENTS' ? 'Parents (Harshu)' : 'Harshu Share'} ({computeExpenseShares(infoItem.item, groomGuestCount, brideGuestCount, eventGuestCounts).bridePercent}%):
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {formatINR(computeExpenseShares(infoItem.item, groomGuestCount, brideGuestCount, eventGuestCounts).brideDue)}
                  </span>
                </div>
                <div className="flex justify-between text-[11px] text-slate-700 dark:text-slate-300">
                  <span>
                    {infoItem.item.payerCategory === 'PARENTS' ? 'Parents (Bhuvi)' : 'Bhuvi Share'} ({computeExpenseShares(infoItem.item, groomGuestCount, brideGuestCount, eventGuestCounts).groomPercent}%):
                  </span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {formatINR(computeExpenseShares(infoItem.item, groomGuestCount, brideGuestCount, eventGuestCounts).groomDue)}
                  </span>
                </div>
                {!isSimplifiedView && (
                  <div className="flex justify-between text-[11px] text-emerald-600 dark:text-emerald-400 pt-1 border-t border-slate-200/60 dark:border-white/10">
                    <span>Advance Cleared:</span>
                    <span className="font-bold">{formatINR(infoItem.item.paidAmount)}</span>
                  </div>
                )}
              </div>

              {/* Subtasks breakdown in Dossier if present */}
              {infoItem.item.subtasks && infoItem.item.subtasks.length > 0 && (
                <div className="bg-slate-100/70 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 space-y-1.5">
                  <span className="font-bold text-slate-700 dark:text-slate-300 block text-[10px] uppercase tracking-wider">
                    Sub-costs & Item Breakdown ({infoItem.item.subtasks.length}):
                  </span>
                  <div className="space-y-1 max-h-44 overflow-y-auto pr-1">
                    {infoItem.item.subtasks.map((st) => (
                      <div key={st.id} className="text-[11px] text-slate-700 dark:text-slate-300 bg-white dark:bg-slate-900 p-2 rounded-lg border border-slate-200 dark:border-white/5 space-y-0.5">
                        <div className="flex items-center justify-between gap-1.5">
                          <div className="flex items-center gap-1.5 min-w-0">
                            {st.label && (
                              <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded-md bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 flex-shrink-0">
                                {st.label}
                              </span>
                            )}
                            <span className="truncate font-bold text-slate-900 dark:text-white">{st.name}</span>
                          </div>
                          <span className="font-bold font-mono text-slate-800 dark:text-slate-200 flex-shrink-0">{formatINR(st.cost)}</span>
                        </div>
                        {st.notes && (
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 italic line-clamp-1 pl-1">
                            ↳ {st.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes / Special Terms */}
              {infoItem.item.notes && (
                <div className="text-[11px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-900/50 p-2 rounded-lg border border-slate-200 dark:border-slate-800">
                  <span className="font-bold text-slate-800 dark:text-slate-200 block text-[10px]">Notes & Inclusions:</span>
                  <p className="line-clamp-2 mt-0.5">{infoItem.item.notes}</p>
                </div>
              )}
            </div>
          </div>
        </>
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
        eventGuestCounts={eventGuestCounts}
      />
    </div>
  );
};
