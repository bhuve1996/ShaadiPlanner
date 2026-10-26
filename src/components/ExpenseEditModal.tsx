'use client';

import React, { useState, useEffect } from 'react';
import { 
  X, 
  Check, 
  Trash2, 
  IndianRupee, 
  Users, 
  Sparkles, 
  Calendar, 
  Building2, 
  CreditCard,
  Percent,
  Calculator,
  Utensils,
  Plus
} from 'lucide-react';
import { ExpenseItem, ExpenseCategory, WeddingEvent, SplitType } from '@/types/wedding';
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
}) => {
  const [formData, setFormData] = useState<ExpenseItem | null>(null);

  useEffect(() => {
    if (item) {
      // By default, check per-plate calculation enabled for items or default to true
      const isCatering = item.category === 'Catering & Dining';
      const isPerPlate = item.isPerPlateCalculation ?? (item.ratePerGuestOrPlate ? true : (isCatering ? true : true));
      const defaultRate = item.ratePerGuestOrPlate || (isCatering ? 2000 : 0);

      const gGuests = item.eventGroomGuests ?? groomGuestCount;
      const bGuests = item.eventBrideGuests ?? brideGuestCount;

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
  }, [item, groomGuestCount, brideGuestCount]);

  if (!isOpen || !formData) return null;

  // Calculate live preview of shares
  const shares = computeExpenseShares(formData, groomGuestCount, brideGuestCount);

  // Recalculate cost automatically whenever guest count, plate rate, or per-plate toggle changes
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

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/65 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#121628] rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border-2 border-pink-300 dark:border-white/20 my-8 animate-in fade-in zoom-in-95 duration-200 text-slate-800 dark:text-slate-100">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-pink-100 dark:border-white/10">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-950/70 text-pink-700 dark:text-pink-300 text-xs font-black mb-1 border border-pink-300 dark:border-pink-800">
              <Utensils size={12} className="text-pink-600 dark:text-pink-400" />
              <span>Smart Per-Plate & Occasion Calculator</span>
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white truncate max-w-md">
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          
          {/* Item Name */}
          <div>
            <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1.5">
              Expense Item Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Wedding Grand Dinner Buffet, Reception Banquet"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white font-bold focus:outline-none focus:ring-2 focus:ring-pink-500 text-sm"
            />
          </div>

          {/* Category & Event */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => {
                  const newCat = e.target.value as ExpenseCategory;
                  const isCatCatering = newCat === 'Catering & Dining';
                  setFormData({ 
                    ...formData, 
                    category: newCat,
                    ratePerGuestOrPlate: formData.ratePerGuestOrPlate || (isCatCatering ? 2000 : 0)
                  });
                }}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 font-semibold focus:outline-none"
              >
                {ALL_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Ceremony / Occasion
              </label>
              <select
                value={formData.event}
                onChange={(e) => setFormData({ ...formData, event: e.target.value as WeddingEvent })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-100 font-semibold focus:outline-none"
              >
                {ALL_EVENTS.map(ev => (
                  <option key={ev} value={ev}>{ev}</option>
                ))}
              </select>
            </div>
          </div>

          {/* SMART PER-PLATE AUTO CALCULATOR (CHECKED BY DEFAULT) */}
          <div className="bg-gradient-to-r from-pink-50/70 via-purple-50/50 to-blue-50/70 dark:from-pink-950/20 dark:via-purple-950/20 dark:to-blue-950/20 p-4 rounded-2xl border-2 border-pink-300 dark:border-white/20 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Utensils size={16} className="text-pink-600 dark:text-pink-400" />
                <span className="font-extrabold text-slate-900 dark:text-white text-xs">
                  Per-Plate / Per-Guest Auto Calculator
                </span>
              </div>

              {/* By Default Checked Toggle */}
              <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-bold text-pink-700 dark:text-pink-300 bg-white/80 dark:bg-slate-900/80 px-2.5 py-1 rounded-full border border-pink-200 dark:border-white/10 shadow-2xs">
                <input
                  type="checkbox"
                  checked={Boolean(formData.isPerPlateCalculation)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    updateCalculation(
                      checked, 
                      formData.ratePerGuestOrPlate || 2000, 
                      currentGroomGuests, 
                      currentBrideGuests
                    );
                  }}
                  className="rounded border-pink-400 text-pink-600 focus:ring-pink-500 w-4 h-4 cursor-pointer"
                />
                <span>Auto-Calculate by Guests</span>
              </label>
            </div>

            {/* Inputs: Rate per plate & Guests */}
            {formData.isPerPlateCalculation ? (
              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {/* Plate Rate */}
                  <div>
                    <label className="block text-[11px] font-extrabold text-pink-700 dark:text-pink-300 mb-1 flex items-center gap-1">
                      <span>Rate / Plate (₹) *</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 font-bold text-pink-500">₹</span>
                      <input
                        type="number"
                        min="0"
                        step="50"
                        placeholder="2000"
                        value={formData.ratePerGuestOrPlate || ''}
                        onChange={(e) => {
                          const rate = Number(e.target.value) || 0;
                          updateCalculation(true, rate, currentGroomGuests, currentBrideGuests);
                        }}
                        className="w-full pl-7 pr-3 py-1.5 bg-white dark:bg-slate-900 border-2 border-pink-300 dark:border-pink-600 rounded-xl font-black text-pink-700 dark:text-pink-300 text-xs focus:outline-none"
                      />
                    </div>
                  </div>

                  {/* Bhuvesh Guests */}
                  <div>
                    <label className="block text-[11px] font-extrabold text-blue-700 dark:text-blue-300 mb-1">
                      Bhuvesh (Groom) Guests
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={currentGroomGuests}
                      onChange={(e) => {
                        const gG = Number(e.target.value);
                        updateCalculation(true, currentRate, gG, currentBrideGuests);
                      }}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border-2 border-blue-300 dark:border-blue-600 rounded-xl font-black text-blue-700 dark:text-blue-300 text-xs focus:outline-none"
                    />
                  </div>

                  {/* Harsha Guests */}
                  <div>
                    <label className="block text-[11px] font-extrabold text-rose-700 dark:text-rose-300 mb-1">
                      Harsha (Bride) Guests
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={currentBrideGuests}
                      onChange={(e) => {
                        const bG = Number(e.target.value);
                        updateCalculation(true, currentRate, currentGroomGuests, bG);
                      }}
                      className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-900 border-2 border-rose-300 dark:border-rose-600 rounded-xl font-black text-rose-700 dark:text-rose-300 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                {/* Auto Calculated Formula Pill */}
                <div className="bg-white/95 dark:bg-slate-900/90 p-2.5 rounded-xl border border-pink-200 dark:border-white/10 flex flex-wrap items-center justify-between text-xs gap-2">
                  <div className="flex items-center gap-2 font-medium text-slate-700 dark:text-slate-300">
                    <Calculator size={14} className="text-pink-500" />
                    <span>
                      Formula: <strong>{currentTotalGuests} total guests</strong> × <strong>₹{currentRate}/plate</strong> =
                    </span>
                  </div>
                  <span className="text-sm font-black text-slate-900 dark:text-white bg-pink-100 dark:bg-pink-950/70 px-2.5 py-0.5 rounded-lg border border-pink-300 dark:border-pink-800">
                    {formatINR(currentTotalGuests * currentRate)}
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-slate-600 dark:text-slate-400">
                Auto-calculation is unchecked. You can type in the total lump sum below manually.
              </p>
            )}
          </div>

          {/* Costs: Actual Cost & Advance Paid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-slate-50 dark:bg-slate-900/70 p-4 rounded-2xl border border-slate-200 dark:border-white/10">
            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                Final / Total Cost (₹) *
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
                      isPerPlateCalculation: false, // User chose to manually override
                      actualCost: val,
                      estimatedCost: formData.estimatedCost || val
                    });
                  }}
                  className="w-full pl-7 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white font-black text-sm focus:outline-none focus:ring-2 focus:ring-pink-500"
                />
              </div>
              {formData.isPerPlateCalculation && (
                <span className="text-[10px] text-pink-600 dark:text-pink-400 font-bold mt-1 block">
                  ⚡ Auto-synced from plate rate × guest count
                </span>
              )}
            </div>

            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                Advance Paid So Far (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                <input
                  type="number"
                  min="0"
                  max={formData.actualCost}
                  value={formData.paidAmount}
                  onChange={(e) => setFormData({ ...formData, paidAmount: Number(e.target.value) })}
                  className="w-full pl-7 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl text-emerald-600 dark:text-emerald-400 font-black text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1">
                Pending Balance: <span className="font-bold text-slate-800 dark:text-slate-200">{formatINR(Math.max(0, formData.actualCost - formData.paidAmount))}</span>
              </div>
            </div>
          </div>

          {/* Split Method Selector */}
          <div className="bg-pink-50/50 dark:bg-slate-900/60 p-3.5 rounded-2xl border border-pink-200 dark:border-white/10 space-y-2.5">
            <span className="font-bold text-slate-900 dark:text-white block text-xs">
              Cost Sharing Method
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, splitType: 'GUEST_RATIO' })}
                className={`py-2 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                  formData.splitType === 'GUEST_RATIO'
                    ? 'bg-purple-600 text-white font-bold border-purple-600 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 border-slate-200 dark:border-white/10'
                }`}
              >
                <div className="font-bold text-xs">👥 Guest Ratio</div>
                <div className="text-[9px] opacity-80">{shares.groomPercent}% : {shares.bridePercent}%</div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, splitType: 'EQUAL_50_50' })}
                className={`py-2 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                  formData.splitType === 'EQUAL_50_50'
                    ? 'bg-amber-600 text-white font-bold border-amber-600 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 border-slate-200 dark:border-white/10'
                }`}
              >
                <div className="font-bold text-xs">🤝 50 : 50</div>
                <div className="text-[9px] opacity-80">Equal Split</div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, splitType: 'GROOM_ONLY' })}
                className={`py-2 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                  formData.splitType === 'GROOM_ONLY'
                    ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 border-slate-200 dark:border-white/10'
                }`}
              >
                <div className="font-bold text-xs">🤵 Bhuvesh 100%</div>
                <div className="text-[9px] opacity-80">Groom Side</div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, splitType: 'BRIDE_ONLY' })}
                className={`py-2 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                  formData.splitType === 'BRIDE_ONLY'
                    ? 'bg-rose-600 text-white font-bold border-rose-600 shadow-xs'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 border-slate-200 dark:border-white/10'
                }`}
              >
                <div className="font-bold text-xs">👰 Harsha 100%</div>
                <div className="text-[9px] opacity-80">Bride Side</div>
              </button>
            </div>

            {/* Live Calculated Split Preview */}
            <div className="pt-2 border-t border-pink-200 dark:border-white/10 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Bhuvesh Due</span>
                <span className="font-black text-blue-700 dark:text-blue-400 text-sm">{formatINR(shares.groomDue)}</span>
              </div>
              <div className="text-slate-300 font-light text-lg">+</div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Harsha Due</span>
                <span className="font-black text-rose-600 dark:text-rose-400 text-sm">{formatINR(shares.brideDue)}</span>
              </div>
              <div className="text-slate-300 font-light text-lg">=</div>
              <div>
                <span className="text-[10px] text-slate-500 uppercase font-bold block">Total</span>
                <span className="font-black text-slate-900 dark:text-white text-sm">{formatINR(formData.actualCost)}</span>
              </div>
            </div>
          </div>

          {/* Vendor, Payer & Booking Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Vendor Name</label>
              <input
                type="text"
                placeholder="e.g. Royal Caterers"
                value={formData.vendorName || ''}
                onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Paid Advance By</label>
              <select
                value={formData.paidBy}
                onChange={(e) => setFormData({ ...formData, paidBy: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-200 font-medium"
              >
                <option value="UNPAID">Not Paid Yet</option>
                <option value="GROOM">Bhuvesh (Groom)</option>
                <option value="BRIDE">Harsha (Bride)</option>
                <option value="SHARED">Joint / Shared (Both)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Booking Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl text-slate-800 dark:text-slate-200 font-medium"
              >
                <option value="Estimated">Estimated</option>
                <option value="Booked">Booked</option>
                <option value="Partially Paid">Partially Paid</option>
                <option value="Settled">Fully Settled</option>
              </select>
            </div>
          </div>

          {/* Subtasks & Sub-costs Editor */}
          <div className="bg-purple-50/50 dark:bg-slate-900/60 p-4 rounded-2xl border border-purple-200 dark:border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-extrabold text-slate-900 dark:text-white block text-xs flex items-center gap-1.5">
                  <Sparkles size={14} className="text-purple-600" />
                  <span>Subtasks & Sub-Costs Breakdown</span>
                </span>
                <p className="text-[10px] text-slate-500 dark:text-slate-400">
                  Split this item into individual items (e.g. Gold into Mangalsutra, Bangles; Vanity into Makeup, Sandals, 7/11/21 Suits).
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  const newSubtask = {
                    id: `sub-${Date.now()}`,
                    name: '',
                    cost: 0,
                    status: 'Pending' as const,
                    notes: '',
                  };
                  const currentSubtasks = formData.subtasks || [];
                  setFormData({ ...formData, subtasks: [...currentSubtasks, newSubtask] });
                }}
                className="flex items-center gap-1 px-2.5 py-1 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-[11px] font-bold shadow-xs cursor-pointer transition-all"
              >
                <Plus size={12} />
                <span>Add Subtask</span>
              </button>
            </div>

            {formData.subtasks && formData.subtasks.length > 0 ? (
              <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
                {formData.subtasks.map((st, idx) => (
                  <div key={st.id || idx} className="bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-purple-100 dark:border-white/5 shadow-2xs space-y-1.5">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Label (e.g. Jewelry, Ring, Shagun)"
                        value={st.label || ''}
                        onChange={(e) => {
                          const updated = [...formData.subtasks!];
                          updated[idx].label = e.target.value;
                          setFormData({ ...formData, subtasks: updated });
                        }}
                        className="w-24 px-2 py-1.5 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/40 rounded-lg text-[10px] font-black uppercase text-purple-800 dark:text-purple-300 placeholder:text-purple-300"
                      />

                      <input
                        type="text"
                        placeholder="Subtask name (e.g. Sister Bharti Gold Set, Jiju Ring)"
                        value={st.name}
                        onChange={(e) => {
                          const updated = [...formData.subtasks!];
                          updated[idx].name = e.target.value;
                          setFormData({ ...formData, subtasks: updated });
                        }}
                        className="flex-1 px-2.5 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg text-xs text-slate-900 dark:text-white font-bold"
                      />

                      <div className="relative w-28">
                        <span className="absolute left-2 top-1/2 -translate-y-1/2 text-slate-400 text-xs font-bold">₹</span>
                        <input
                          type="number"
                          placeholder="Cost"
                          value={st.cost || ''}
                          onChange={(e) => {
                            const updated = [...formData.subtasks!];
                            updated[idx].cost = Number(e.target.value);
                            setFormData({ ...formData, subtasks: updated });
                          }}
                          className="w-full pl-5 pr-2 py-1.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-lg text-xs font-bold text-slate-900 dark:text-white text-right"
                        />
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const updated = formData.subtasks!.filter((_, i) => i !== idx);
                          setFormData({ ...formData, subtasks: updated });
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                        title="Remove subtask"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>

                    {/* Individual Subtask Notes */}
                    <input
                      type="text"
                      placeholder="Notes for this subtask (e.g. 22k pure gold, includes gold ring from sister side...)"
                      value={st.notes || ''}
                      onChange={(e) => {
                        const updated = [...formData.subtasks!];
                        updated[idx].notes = e.target.value;
                        setFormData({ ...formData, subtasks: updated });
                      }}
                      className="w-full px-2.5 py-1 bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200/60 dark:border-white/5 rounded-lg text-[11px] text-slate-600 dark:text-slate-400 italic"
                    />
                  </div>
                ))}

                <div className="flex items-center justify-between pt-1 text-[11px] text-purple-700 dark:text-purple-300 font-bold px-1">
                  <span>Subtasks Total:</span>
                  <span className="font-mono text-xs">
                    {formatINR(formData.subtasks.reduce((sum, s) => sum + (s.cost || 0), 0))}
                  </span>
                </div>
              </div>
            ) : (
              <div className="text-center py-2 text-[11px] text-slate-400 italic">
                No subtasks added yet. Click &quot;Add Subtask&quot; to break down this expense.
              </div>
            )}
          </div>

          {/* Notes */}
          <div>
            <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">Notes / Special Terms</label>
            <textarea
              rows={2}
              placeholder="e.g. 2000 per plate includes welcome mocktails, live chaat stalls, 4 main courses and 3 desserts."
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl text-slate-900 dark:text-white text-xs"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex items-center justify-between">
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
                className="px-4 py-2 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-gradient-to-r from-pink-500 to-rose-600 text-white font-black shadow-md hover:brightness-105 active:scale-95 transition-all cursor-pointer"
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
