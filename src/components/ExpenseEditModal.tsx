'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Trash2, 
  Check, 
  Utensils, 
  Users, 
  Sparkles, 
  Calculator,
  Plus
} from 'lucide-react';
import { ExpenseItem, ExpenseCategory, WeddingEvent, SplitType, ExpensePayerCategory } from '@/types/wedding';
import { computeExpenseShares } from '@/lib/calculator';
import { formatINR } from '@/lib/constants';

interface ExpenseEditModalProps {
  item: ExpenseItem | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: ExpenseItem) => void;
  onDelete?: (id: string) => void;
  groomGuestCount: number;
  brideGuestCount: number;
  eventGuestCounts?: Record<string, { groom: number; bride: number; perPlateRate?: number }>;
}

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

export const ExpenseEditModal: React.FC<ExpenseEditModalProps> = ({
  item,
  isOpen,
  onClose,
  onSave,
  onDelete,
  groomGuestCount,
  brideGuestCount,
  eventGuestCounts,
}) => {
  const [formData, setFormData] = useState<ExpenseItem | null>(null);

  useEffect(() => {
    if (item) {
      const isCatering = item.category === 'Catering, Food & Sweets';
      const eventConfig = eventGuestCounts && item.event ? eventGuestCounts[item.event] : undefined;

      const gGuests = item.overrideGuestCount && item.eventGroomGuests !== undefined
        ? item.eventGroomGuests
        : (eventConfig ? eventConfig.groom : groomGuestCount);

      const bGuests = item.overrideGuestCount && item.eventBrideGuests !== undefined
        ? item.eventBrideGuests
        : (eventConfig ? eventConfig.bride : brideGuestCount);

      const defaultRate = item.ratePerGuestOrPlate || (eventConfig?.perPlateRate ? eventConfig.perPlateRate : (isCatering ? 2000 : 0));
      // By default keep auto-calculate by guests OFF unless explicitly saved as true
      const isPerPlate = item.isPerPlateCalculation ?? false;

      let actual = item.actualCost;
      if (isPerPlate && defaultRate > 0) {
        actual = (gGuests + bGuests) * defaultRate;
      }

      setFormData({ 
        ...item,
        isPerPlateCalculation: isPerPlate,
        ratePerGuestOrPlate: defaultRate,
        eventGroomGuests: gGuests,
        eventBrideGuests: bGuests,
        actualCost: actual || item.actualCost,
      });
    }
  }, [item, groomGuestCount, brideGuestCount, eventGuestCounts]);

  if (!isOpen || !formData) return null;

  // Calculate live preview of shares
  const shares = computeExpenseShares(formData, groomGuestCount, brideGuestCount, eventGuestCounts);

  const updateCalculation = (
    isPerPlate: boolean,
    rate: number,
    gGuests: number,
    bGuests: number
  ) => {
    if (isPerPlate && rate > 0) {
      const totalCost = (gGuests + bGuests) * rate;
      setFormData(prev => prev ? ({
        ...prev,
        isPerPlateCalculation: isPerPlate,
        ratePerGuestOrPlate: rate,
        eventGroomGuests: gGuests,
        eventBrideGuests: bGuests,
        overrideGuestCount: true,
        actualCost: totalCost,
        estimatedCost: prev.estimatedCost || totalCost,
      }) : null);
    } else {
      setFormData(prev => prev ? ({
        ...prev,
        isPerPlateCalculation: isPerPlate,
        ratePerGuestOrPlate: rate,
        eventGroomGuests: gGuests,
        eventBrideGuests: bGuests,
      }) : null);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const currentGroomGuests = formData.eventGroomGuests ?? groomGuestCount;
  const currentBrideGuests = formData.eventBrideGuests ?? brideGuestCount;
  const currentTotalGuests = currentGroomGuests + currentBrideGuests;
  const currentRate = formData.ratePerGuestOrPlate || 0;

  const isMithai = formData.name.toLowerCase().includes('mitha') || formData.name.toLowerCase().includes('sweets') || formData.name.toLowerCase().includes('bhaji');
  const isRoka = formData.event === 'Roka / Engagement';

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm p-3 sm:p-6 flex justify-center items-start sm:items-center">
      <div className="bg-white dark:bg-[#11141D] rounded-2xl max-w-5xl w-full p-5 sm:p-7 shadow-2xl border border-slate-200 dark:border-white/10 my-4 sm:my-8 animate-in fade-in zoom-in-95 duration-200 text-slate-800 dark:text-slate-100 max-h-[92vh] flex flex-col">
        
        {/* Sticky Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100 dark:border-white/10 flex-shrink-0">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-white/10 text-slate-700 dark:text-slate-200 text-[11px] font-bold mb-1">
              <Utensils size={12} className="text-pink-500" />
              <span>Wedding Expense & Budget Config</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white truncate max-w-lg">
              {formData.name || 'Expense Details'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Scrollable Form Body: 2-COLUMN BALANCED WIDESCREEN LAYOUT */}
        <form onSubmit={handleSubmit} className="mt-4 overflow-y-auto pr-1 flex-1 space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            
            {/* LEFT COLUMN (7 COLS): Text, Categorization & Details */}
            <div className="lg:col-span-7 space-y-4">
              
              {/* Item Name & Subtitle */}
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1 text-xs">
                    Primary Item Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Wedding Hall & Dinner Banquet"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-white dark:bg-[#1A1F2E] border-2 border-slate-300 dark:border-white/20 rounded-xl text-slate-900 dark:text-white font-bold focus:outline-none focus:border-slate-600 dark:focus:border-white text-sm shadow-xs"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 text-[11px]">
                    Sub-Detail / Sub-Heading Description
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 500 guests buffet • Boy side stay & high tea"
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-[#1A1F2E] border-2 border-slate-300 dark:border-white/20 rounded-xl text-slate-900 dark:text-white font-medium text-xs focus:outline-none focus:border-slate-600 dark:focus:border-white shadow-xs"
                  />
                </div>
              </div>

              {/* Category & Event */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-xs">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      const newCat = e.target.value as ExpenseCategory;
                      const isCatCatering = newCat === 'Catering, Food & Sweets';
                      setFormData({ 
                        ...formData, 
                        category: newCat,
                        ratePerGuestOrPlate: formData.ratePerGuestOrPlate || (isCatCatering ? 2000 : 0)
                      });
                    }}
                    className="w-full px-3 py-2 bg-white dark:bg-[#1A1F2E] border-2 border-slate-300 dark:border-white/20 rounded-xl text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-slate-600 dark:focus:border-white text-xs shadow-xs cursor-pointer"
                  >
                    {ALL_CATEGORIES.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-xs">
                    Ceremony / Occasion
                  </label>
                  <select
                    value={formData.event}
                    onChange={(e) => setFormData({ ...formData, event: e.target.value as WeddingEvent })}
                    className="w-full px-3 py-2 bg-white dark:bg-[#1A1F2E] border-2 border-slate-300 dark:border-white/20 rounded-xl text-slate-900 dark:text-white font-semibold focus:outline-none focus:border-slate-600 dark:focus:border-white text-xs shadow-xs cursor-pointer"
                  >
                    {ALL_EVENTS.map(ev => (
                      <option key={ev} value={ev}>{ev}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Responsibility: Couple vs Parents vs Joint Family */}
              <div className="bg-slate-50 dark:bg-white/[0.02] p-3.5 rounded-2xl border border-slate-200 dark:border-white/10 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 dark:text-slate-200 text-xs flex items-center gap-1.5">
                    <Users size={13} className="text-slate-500" />
                    <span>Family Responsibility Tier</span>
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, payerCategory: 'COUPLE' })}
                    className={`py-2 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                      (formData.payerCategory || 'COUPLE') === 'COUPLE'
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold border-transparent shadow-xs'
                        : 'bg-white dark:bg-[#1A1F2E] text-slate-700 dark:text-slate-300 hover:bg-slate-50 border-2 border-slate-300 dark:border-white/20'
                    }`}
                  >
                    <div className="font-bold text-xs">👫 Self (Couple)</div>
                    <div className="text-[9px] opacity-75">Harsha & Bhuvi</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, payerCategory: 'PARENTS' })}
                    className={`py-2 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                      formData.payerCategory === 'PARENTS'
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold border-transparent shadow-xs'
                        : 'bg-white dark:bg-[#1A1F2E] text-slate-700 dark:text-slate-300 hover:bg-slate-50 border-2 border-slate-300 dark:border-white/20'
                    }`}
                  >
                    <div className="font-bold text-xs">👨‍👩‍👧 Parents</div>
                    <div className="text-[9px] opacity-75">Family / Elders</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, payerCategory: 'SHARED_FAMILY' })}
                    className={`py-2 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                      formData.payerCategory === 'SHARED_FAMILY'
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold border-transparent shadow-xs'
                        : 'bg-white dark:bg-[#1A1F2E] text-slate-700 dark:text-slate-300 hover:bg-slate-50 border-2 border-slate-300 dark:border-white/20'
                    }`}
                  >
                    <div className="font-bold text-xs">🤝 Joint Family</div>
                    <div className="text-[9px] opacity-75">Mutual Relatives</div>
                  </button>
                </div>
              </div>

              {/* Vendor & Status */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-xs">Vendor Name</label>
                  <input
                    type="text"
                    placeholder="e.g. Royal Palace Resort, Bikaner Sweets"
                    value={formData.vendorName || ''}
                    onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                    className="w-full px-3 py-2 bg-white dark:bg-[#1A1F2E] border-2 border-slate-300 dark:border-white/20 rounded-xl text-slate-900 dark:text-white text-xs focus:outline-none focus:border-slate-600 dark:focus:border-white shadow-xs"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1 text-xs">Booking Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full px-3 py-2 bg-white dark:bg-[#1A1F2E] border-2 border-slate-300 dark:border-white/20 rounded-xl text-slate-900 dark:text-white font-medium text-xs focus:outline-none focus:border-slate-600 dark:focus:border-white shadow-xs cursor-pointer"
                  >
                    <option value="Estimated">Estimated</option>
                    <option value="Booked">Booked</option>
                    <option value="Partially Paid">Partially Paid</option>
                    <option value="Settled">Fully Settled</option>
                  </select>
                </div>
              </div>

              {/* Subtasks Item Breakdown */}
              <div className="bg-slate-50 dark:bg-white/[0.02] p-3.5 rounded-2xl border border-slate-200 dark:border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white text-xs flex items-center gap-1.5">
                    <Sparkles size={13} className="text-slate-500" />
                    <span>Itemized Breakdown ({formData.subtasks?.length || 0})</span>
                  </span>

                  <button
                    type="button"
                    onClick={() => {
                      const newSubtask = {
                        id: `sub-${Date.now()}`,
                        name: '',
                        cost: 0,
                        status: 'Pending' as const,
                      };
                      setFormData({
                        ...formData,
                        subtasks: [...(formData.subtasks || []), newSubtask],
                      });
                    }}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 text-[11px] font-bold hover:bg-slate-100 cursor-pointer shadow-2xs"
                  >
                    <Plus size={12} />
                    <span>Add Item</span>
                  </button>
                </div>

                {formData.subtasks && formData.subtasks.length > 0 && (
                  <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                    {formData.subtasks.map((st, idx) => (
                      <div key={st.id} className="flex items-center gap-2 bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-white/5">
                        <input
                          type="text"
                          placeholder="Sub-item (e.g. Kada, Chain, Watch)"
                          value={st.name || st.label || ''}
                          onChange={(e) => {
                            const newSub = [...(formData.subtasks || [])];
                            newSub[idx] = { ...st, name: e.target.value, label: e.target.value };
                            setFormData({ ...formData, subtasks: newSub });
                          }}
                          className="flex-1 px-2 py-1 text-xs bg-transparent border-0 focus:outline-none font-medium text-slate-900 dark:text-white"
                        />
                        <div className="relative w-28 flex-shrink-0">
                          <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs">₹</span>
                          <input
                            type="number"
                            placeholder="Cost"
                            value={st.cost || ''}
                            onChange={(e) => {
                              const newSub = [...(formData.subtasks || [])];
                              newSub[idx] = { ...st, cost: Number(e.target.value) };
                              setFormData({ ...formData, subtasks: newSub });
                            }}
                            className="w-full pl-5 pr-2 py-1 text-xs bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-white/10 font-mono font-bold text-slate-900 dark:text-white focus:outline-none"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => {
                            setFormData({
                              ...formData,
                              subtasks: formData.subtasks?.filter((_, i) => i !== idx)
                            });
                          }}
                          className="p-1 text-slate-400 hover:text-rose-500 cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* RIGHT COLUMN (5 COLS): Calculations, Costs & Splits */}
            <div className="lg:col-span-5 space-y-4">
              
              {/* Total & Paid Amounts in ONE ROW */}
              <div className="bg-slate-50 dark:bg-white/[0.03] p-4 rounded-2xl border border-slate-200 dark:border-white/10 space-y-3">
                <div className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
                  Cost Summary
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1 text-xs">
                      Total Cost (₹) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                      <input
                        type="number"
                        required
                        min="0"
                        value={formData.actualCost}
                        onChange={(e) => {
                          const val = Number(e.target.value);
                          setFormData({
                            ...formData,
                            isPerPlateCalculation: false,
                            actualCost: val,
                            estimatedCost: formData.estimatedCost || val
                          });
                        }}
                        className="w-full pl-7 pr-3 py-2 bg-white dark:bg-[#1A1F2E] border-2 border-slate-300 dark:border-white/20 rounded-xl text-slate-900 dark:text-white font-mono font-bold text-base focus:outline-none focus:border-slate-600 dark:focus:border-white shadow-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1 text-xs">
                      Advance Paid (₹)
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                      <input
                        type="number"
                        min="0"
                        max={formData.actualCost}
                        value={formData.paidAmount}
                        onChange={(e) => setFormData({ ...formData, paidAmount: Number(e.target.value) })}
                        className="w-full pl-7 pr-3 py-2 bg-white dark:bg-[#1A1F2E] border-2 border-slate-300 dark:border-white/20 rounded-xl text-slate-900 dark:text-white font-mono font-bold text-base focus:outline-none focus:border-slate-600 dark:focus:border-white shadow-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/60 dark:border-white/5 flex justify-between">
                  <span>Remaining Balance:</span>
                  <span className="font-bold text-slate-800 dark:text-slate-200 font-mono">
                    {formatINR(Math.max(0, formData.actualCost - formData.paidAmount))}
                  </span>
                </div>
              </div>

              {/* Multiplier / Calculator Card */}
              <div className="bg-slate-50 dark:bg-white/[0.03] p-4 rounded-2xl border border-slate-200 dark:border-white/10 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-bold text-slate-900 dark:text-white text-xs block">
                      {isMithai
                        ? 'Mithai Box Multiplier'
                        : isRoka
                        ? 'Roka Food Calculator'
                        : 'Wedding Plate Calculator'}
                    </span>
                    <span className="text-[11px] text-slate-500 dark:text-slate-400">
                      Multiply units by guest or box count
                    </span>
                  </div>

                  <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-slate-800 dark:text-slate-200 bg-white dark:bg-[#1A1F2E] px-3 py-1.5 rounded-xl border-2 border-slate-300 dark:border-white/20 shadow-xs hover:border-slate-500">
                    <span>Calculate</span>
                    <input
                      type="checkbox"
                      checked={Boolean(formData.isPerPlateCalculation)}
                      onChange={(e) => {
                        const checked = e.target.checked;
                        const defaultRate = formData.ratePerGuestOrPlate || (isMithai ? 800 : isRoka ? 1200 : 2000);
                        updateCalculation(checked, defaultRate, currentGroomGuests, currentBrideGuests);
                      }}
                      className="rounded border-slate-400 text-slate-900 focus:ring-slate-500 w-4 h-4 cursor-pointer"
                    />
                  </label>
                </div>

                {formData.isPerPlateCalculation ? (
                  <div className="space-y-2.5 pt-1">
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">
                          {isMithai ? 'Rate/Box' : 'Rate/Plate'}
                        </label>
                        <input
                          type="number"
                          placeholder="Rate"
                          value={formData.ratePerGuestOrPlate || ''}
                          onChange={(e) => {
                            const r = Number(e.target.value) || 0;
                            updateCalculation(true, r, currentGroomGuests, currentBrideGuests);
                          }}
                          className="w-full px-2 py-1 bg-white dark:bg-[#1A1F2E] border-2 border-slate-300 dark:border-white/20 rounded-lg font-mono font-bold text-slate-900 dark:text-white text-xs shadow-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">Bhuvi Side</label>
                        <input
                          type="number"
                          value={currentGroomGuests}
                          onChange={(e) => {
                            const g = Number(e.target.value);
                            updateCalculation(true, currentRate, g, currentBrideGuests);
                          }}
                          className="w-full px-2 py-1 bg-white dark:bg-[#1A1F2E] border-2 border-slate-300 dark:border-white/20 rounded-lg font-mono font-bold text-slate-900 dark:text-white text-xs shadow-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-slate-600 dark:text-slate-400 mb-0.5">Harsha Side</label>
                        <input
                          type="number"
                          value={currentBrideGuests}
                          onChange={(e) => {
                            const b = Number(e.target.value);
                            updateCalculation(true, currentRate, currentGroomGuests, b);
                          }}
                          className="w-full px-2 py-1 bg-white dark:bg-[#1A1F2E] border-2 border-slate-300 dark:border-white/20 rounded-lg font-mono font-bold text-slate-900 dark:text-white text-xs shadow-xs"
                        />
                      </div>
                    </div>
                    <div className="text-[11px] font-mono text-slate-600 dark:text-slate-300 bg-white dark:bg-[#1A1F2E] p-2 rounded-lg border-2 border-slate-200 dark:border-white/10 flex justify-between">
                      <span>{currentTotalGuests} {isMithai ? 'boxes' : 'guests'} × ₹{currentRate}</span>
                      <strong className="text-slate-900 dark:text-white font-mono">{formatINR(currentTotalGuests * currentRate)}</strong>
                    </div>
                  </div>
                ) : (
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">
                    Auto-calculation is off. Manual total is used.
                  </p>
                )}
              </div>

              {/* Split Sharing Rule */}
              <div className="bg-slate-50 dark:bg-white/[0.03] p-4 rounded-2xl border border-slate-200 dark:border-white/10 space-y-2.5">
                <span className="font-bold text-slate-900 dark:text-white block text-xs">
                  Split Rule
                </span>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, splitType: 'GUEST_RATIO' })}
                    className={`py-2 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                      formData.splitType === 'GUEST_RATIO'
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold border-transparent shadow-xs'
                        : 'bg-white dark:bg-[#1A1F2E] text-slate-700 dark:text-slate-300 hover:bg-slate-50 border-2 border-slate-300 dark:border-white/20'
                    }`}
                  >
                    <div className="font-bold text-xs">👥 Guest Ratio</div>
                    <div className="text-[9px] opacity-75">{shares.groomPercent}% : {shares.bridePercent}%</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, splitType: 'EQUAL_50_50' })}
                    className={`py-2 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                      formData.splitType === 'EQUAL_50_50'
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold border-transparent shadow-xs'
                        : 'bg-white dark:bg-[#1A1F2E] text-slate-700 dark:text-slate-300 hover:bg-slate-50 border-2 border-slate-300 dark:border-white/20'
                    }`}
                  >
                    <div className="font-bold text-xs">🤝 50 : 50</div>
                    <div className="text-[9px] opacity-75">Equal Split</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, splitType: 'BRIDE_ONLY' })}
                    className={`py-2 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                      formData.splitType === 'BRIDE_ONLY'
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold border-transparent shadow-xs'
                        : 'bg-white dark:bg-[#1A1F2E] text-slate-700 dark:text-slate-300 hover:bg-slate-50 border-2 border-slate-300 dark:border-white/20'
                    }`}
                  >
                    <div className="font-bold text-xs">👰 Harsha 100%</div>
                    <div className="text-[9px] opacity-75">Girl Side Only</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, splitType: 'GROOM_ONLY' })}
                    className={`py-2 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                      formData.splitType === 'GROOM_ONLY'
                        ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold border-transparent shadow-xs'
                        : 'bg-white dark:bg-[#1A1F2E] text-slate-700 dark:text-slate-300 hover:bg-slate-50 border-2 border-slate-300 dark:border-white/20'
                    }`}
                  >
                    <div className="font-bold text-xs">🤵 Bhuvesh 100%</div>
                    <div className="text-[9px] opacity-75">Boy Side Only</div>
                  </button>
                </div>

                {/* Live Split Result */}
                <div className="pt-2 border-t border-slate-200/80 dark:border-white/10 flex items-center justify-between text-xs font-mono">
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-sans">
                      {formData.payerCategory === 'PARENTS' ? 'Parents (Harsha)' : 'Harsha Share'}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">{formatINR(shares.brideDue)}</span>
                  </div>
                  <div className="text-slate-300 font-light">+</div>
                  <div className="text-right">
                    <span className="text-[10px] text-slate-500 uppercase block font-sans">
                      {formData.payerCategory === 'PARENTS' ? 'Parents (Bhuvi)' : 'Bhuvi Share'}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">{formatINR(shares.groomDue)}</span>
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-sans">
                      {formData.payerCategory === 'PARENTS' ? 'Parents (Harsha)' : 'Harsha Share'}
                    </span>
                    <span className="font-bold text-slate-900 dark:text-white">{formatINR(shares.brideDue)}</span>
                  </div>
                  <div className="text-slate-300 font-light">=</div>
                  <div>
                    <span className="text-[10px] text-slate-500 uppercase block font-sans">Total</span>
                    <span className="font-bold text-slate-900 dark:text-white">{formatINR(formData.actualCost)}</span>
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between flex-shrink-0">
            {onDelete ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Are you sure you want to delete "${formData.name}"?`)) {
                    onDelete(formData.id);
                    onClose();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-bold transition-colors cursor-pointer"
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-colors cursor-pointer text-xs"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold shadow-sm hover:opacity-90 active:scale-95 transition-all cursor-pointer text-xs"
              >
                <Check size={14} />
                <span>Save Expense</span>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
