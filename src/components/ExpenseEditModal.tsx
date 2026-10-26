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
  Utensils
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
      setFormData({ ...item });
    }
  }, [item]);

  if (!isOpen || !formData) return null;

  // Calculate live preview of shares
  const shares = computeExpenseShares(formData, groomGuestCount, brideGuestCount);

  // Auto calculate cost if rate per guest/plate is provided
  const handleRateOrGuestChange = (rate?: number, gGuests?: number, bGuests?: number) => {
    const curRate = rate !== undefined ? rate : (formData.ratePerGuestOrPlate || 0);
    const curG = gGuests !== undefined ? gGuests : (formData.eventGroomGuests ?? groomGuestCount);
    const curB = bGuests !== undefined ? bGuests : (formData.eventBrideGuests ?? brideGuestCount);
    
    if (curRate > 0) {
      const calculatedTotal = (curG + curB) * curRate;
      setFormData({
        ...formData,
        ratePerGuestOrPlate: curRate,
        eventGroomGuests: curG,
        eventBrideGuests: curB,
        actualCost: calculatedTotal,
        estimatedCost: formData.estimatedCost || calculatedTotal,
      });
    } else {
      setFormData({
        ...formData,
        eventGroomGuests: curG,
        eventBrideGuests: curB,
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/65 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border-2 border-amber-300 my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black mb-1 border border-amber-300">
              <Sparkles size={12} className="text-amber-600" />
              <span>Smart Occasion Budget & Split Calculator</span>
            </div>
            <h3 className="text-lg font-black text-stone-900 truncate max-w-md">
              {formData.name || 'New Wedding Expense'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          
          {/* Item Name */}
          <div>
            <label className="block font-bold text-stone-800 mb-1.5">
              Expense Item Title *
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Grand Sangeet Buffet, Vintage Car Baraat"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-bold focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm"
            />
          </div>

          {/* Category & Event */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-bold text-stone-700 mb-1.5">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as ExpenseCategory })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 font-semibold focus:bg-white focus:outline-none"
              >
                {ALL_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1.5">
                Ceremony / Occasion
              </label>
              <select
                value={formData.event}
                onChange={(e) => setFormData({ ...formData, event: e.target.value as WeddingEvent })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 font-semibold focus:bg-white focus:outline-none"
              >
                {ALL_EVENTS.map(ev => (
                  <option key={ev} value={ev}>{ev}</option>
                ))}
              </select>
            </div>
          </div>

          {/* SMART FIELD: Event-Specific Guest Count Override */}
          <div className="bg-gradient-to-r from-amber-50 via-orange-50/50 to-amber-50 p-4 rounded-2xl border-2 border-amber-300/80 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Users size={16} className="text-amber-700" />
                <span className="font-extrabold text-stone-900 text-xs">
                  Event-Specific Guest Count (Occasion Split)
                </span>
              </div>
              <label className="flex items-center gap-1.5 cursor-pointer text-[11px] font-bold text-amber-900">
                <input
                  type="checkbox"
                  checked={Boolean(formData.overrideGuestCount)}
                  onChange={(e) => {
                    const checked = e.target.checked;
                    setFormData({
                      ...formData,
                      overrideGuestCount: checked,
                      eventGroomGuests: checked ? (formData.eventGroomGuests ?? groomGuestCount) : undefined,
                      eventBrideGuests: checked ? (formData.eventBrideGuests ?? brideGuestCount) : undefined,
                    });
                  }}
                  className="rounded border-amber-400 text-amber-600 focus:ring-amber-500 w-4 h-4 cursor-pointer"
                />
                <span>Custom guests for this ceremony</span>
              </label>
            </div>

            {formData.overrideGuestCount ? (
              <div className="space-y-3 pt-1">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  <div>
                    <label className="block text-[11px] font-bold text-blue-900 mb-1">
                      Bhuvesh (Groom) Guests
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.eventGroomGuests ?? groomGuestCount}
                      onChange={(e) => handleRateOrGuestChange(undefined, Number(e.target.value), undefined)}
                      className="w-full px-2.5 py-1.5 bg-white border border-blue-300 rounded-xl font-bold text-blue-700 text-xs focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-rose-900 mb-1">
                      Harsha (Bride) Guests
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.eventBrideGuests ?? brideGuestCount}
                      onChange={(e) => handleRateOrGuestChange(undefined, undefined, Number(e.target.value))}
                      className="w-full px-2.5 py-1.5 bg-white border border-rose-300 rounded-xl font-bold text-rose-700 text-xs focus:outline-none"
                    />
                  </div>

                  <div className="col-span-2 sm:col-span-1">
                    <label className="block text-[11px] font-bold text-amber-900 mb-1 flex items-center gap-1">
                      <Utensils size={11} /> Rate / Plate (₹)
                    </label>
                    <input
                      type="number"
                      min="0"
                      placeholder="e.g. 1500"
                      value={formData.ratePerGuestOrPlate || ''}
                      onChange={(e) => handleRateOrGuestChange(Number(e.target.value) || 0, undefined, undefined)}
                      className="w-full px-2.5 py-1.5 bg-white border border-amber-300 rounded-xl font-bold text-amber-800 text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between text-[11px] bg-white/90 px-3 py-1.5 rounded-xl border border-amber-200">
                  <span className="text-stone-600">
                    Occasion Ratio: <strong className="text-blue-700">{shares.groomPercent}% Bhuvesh</strong> ({shares.effectiveGroomGuests} guests) : <strong className="text-rose-700">{shares.bridePercent}% Harsha</strong> ({shares.effectiveBrideGuests} guests)
                  </span>
                  <span className="font-extrabold text-stone-900">
                    {shares.effectiveGroomGuests + shares.effectiveBrideGuests} Total Guests
                  </span>
                </div>
              </div>
            ) : (
              <p className="text-[11px] text-amber-900/80 leading-normal">
                Using global wedding guest ratio: <strong>{groomGuestCount} Bhuvesh ({shares.groomPercent}%)</strong> : <strong>{brideGuestCount} Harsha ({shares.bridePercent}%)</strong>. Check above to customize specifically for this event (e.g. Haldi intimate guests vs Reception grand banquet).
              </p>
            )}
          </div>

          {/* Costs: Actual Cost & Advance Paid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-stone-50/90 p-4 rounded-2xl border border-stone-200">
            <div>
              <label className="block font-bold text-stone-800 mb-1">
                Final / Total Cost (₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-bold">₹</span>
                <input
                  type="number"
                  required
                  min="0"
                  value={formData.actualCost}
                  onChange={(e) => {
                    const val = Number(e.target.value);
                    setFormData({
                      ...formData,
                      actualCost: val,
                      estimatedCost: formData.estimatedCost || val
                    });
                  }}
                  className="w-full pl-7 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-stone-900 font-black text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-stone-800 mb-1">
                Advance Paid So Far (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-bold">₹</span>
                <input
                  type="number"
                  min="0"
                  max={formData.actualCost}
                  value={formData.paidAmount}
                  onChange={(e) => setFormData({ ...formData, paidAmount: Number(e.target.value) })}
                  className="w-full pl-7 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-emerald-700 font-black text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <div className="text-[10px] text-stone-500 mt-1">
                Pending Balance: <span className="font-bold text-stone-800">{formatINR(Math.max(0, formData.actualCost - formData.paidAmount))}</span>
              </div>
            </div>
          </div>

          {/* Split Method Selector */}
          <div className="bg-amber-50/60 p-3.5 rounded-2xl border border-amber-200 space-y-2.5">
            <span className="font-bold text-stone-900 block text-xs">
              Cost Sharing Method
            </span>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, splitType: 'EQUAL_50_50' })}
                className={`py-2 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                  formData.splitType === 'EQUAL_50_50'
                    ? 'bg-amber-600 text-white font-bold border-amber-600 shadow-xs'
                    : 'bg-white text-stone-700 hover:bg-stone-50 border-stone-200'
                }`}
              >
                <div className="font-bold text-xs">50 : 50</div>
                <div className="text-[9px] opacity-80">Equal Split</div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, splitType: 'GUEST_RATIO' })}
                className={`py-2 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                  formData.splitType === 'GUEST_RATIO'
                    ? 'bg-purple-600 text-white font-bold border-purple-600 shadow-xs'
                    : 'bg-white text-stone-700 hover:bg-stone-50 border-stone-200'
                }`}
              >
                <div className="font-bold text-xs">Guest Ratio</div>
                <div className="text-[9px] opacity-80">{shares.groomPercent}% : {shares.bridePercent}%</div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, splitType: 'GROOM_ONLY' })}
                className={`py-2 px-2 rounded-xl border text-center transition-all cursor-pointer ${
                  formData.splitType === 'GROOM_ONLY'
                    ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-xs'
                    : 'bg-white text-stone-700 hover:bg-stone-50 border-stone-200'
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
                    : 'bg-white text-stone-700 hover:bg-stone-50 border-stone-200'
                }`}
              >
                <div className="font-bold text-xs">👰 Harsha 100%</div>
                <div className="text-[9px] opacity-80">Bride Side</div>
              </button>
            </div>

            {/* Live Calculated Split Preview */}
            <div className="pt-2 border-t border-amber-200 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-stone-500 uppercase font-bold block">Bhuvesh Due</span>
                <span className="font-black text-blue-700 text-sm">{formatINR(shares.groomDue)}</span>
              </div>
              <div className="text-stone-300 font-light text-lg">+</div>
              <div>
                <span className="text-[10px] text-stone-500 uppercase font-bold block">Harsha Due</span>
                <span className="font-black text-rose-700 text-sm">{formatINR(shares.brideDue)}</span>
              </div>
              <div className="text-stone-300 font-light text-lg">=</div>
              <div>
                <span className="text-[10px] text-stone-500 uppercase font-bold block">Total</span>
                <span className="font-black text-stone-900 text-sm">{formatINR(formData.actualCost)}</span>
              </div>
            </div>
          </div>

          {/* Vendor, Payer & Booking Status */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div>
              <label className="block font-bold text-stone-700 mb-1">Vendor Name</label>
              <input
                type="text"
                placeholder="e.g. Royal Caterers"
                value={formData.vendorName || ''}
                onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900"
              />
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Paid Advance By</label>
              <select
                value={formData.paidBy}
                onChange={(e) => setFormData({ ...formData, paidBy: e.target.value as any })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 font-medium"
              >
                <option value="UNPAID">Not Paid Yet</option>
                <option value="GROOM">Bhuvesh (Groom)</option>
                <option value="BRIDE">Harsha (Bride)</option>
                <option value="SHARED">Joint / Shared (Both)</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-stone-700 mb-1">Booking Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 font-medium"
              >
                <option value="Estimated">Estimated</option>
                <option value="Booked">Booked</option>
                <option value="Partially Paid">Partially Paid</option>
                <option value="Settled">Fully Settled</option>
              </select>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block font-bold text-stone-700 mb-1">Notes / Terms</label>
            <textarea
              rows={2}
              placeholder="e.g. Advance paid on agreement signing, balance 10 days before ceremony."
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 text-xs"
            />
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-stone-100 flex items-center justify-between">
            {onDelete ? (
              <button
                type="button"
                onClick={() => {
                  if (confirm(`Are you sure you want to delete "${formData.name}"?`)) {
                    onDelete(formData.id);
                    onClose();
                  }
                }}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-bold transition-colors cursor-pointer"
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black shadow-md shadow-amber-600/20 hover:shadow-lg transition-all cursor-pointer"
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
