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
  Percent
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

  const totalGuests = (groomGuestCount + brideGuestCount) || 1;
  const groomRatio = Math.round((groomGuestCount / totalGuests) * 100);
  const brideRatio = 100 - groomRatio;

  // Calculate live preview of shares
  const shares = computeExpenseShares(formData, groomGuestCount, brideGuestCount);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 backdrop-blur-sm p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-7 shadow-2xl border border-stone-200 my-8 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-stone-100">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-800 text-[11px] font-semibold mb-1">
              <Sparkles size={12} className="text-amber-600" />
              <span>Editing Expense & Split Rules</span>
            </div>
            <h3 className="text-lg font-bold text-stone-900 truncate max-w-md">
              {formData.name || 'Expense Details'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          
          {/* Item Name */}
          <div>
            <label className="block font-semibold text-stone-700 mb-1.5">
              Expense Item Title *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full px-3.5 py-2.5 bg-stone-50/80 border border-stone-200 rounded-xl text-stone-900 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all text-sm"
            />
          </div>

          {/* Category & Event */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-semibold text-stone-700 mb-1.5">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value as ExpenseCategory })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              >
                {ALL_CATEGORIES.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1.5">
                Ceremony / Event
              </label>
              <select
                value={formData.event}
                onChange={(e) => setFormData({ ...formData, event: e.target.value as WeddingEvent })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              >
                {ALL_EVENTS.map(ev => (
                  <option key={ev} value={ev}>{ev}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Vendor & Due Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-semibold text-stone-700 mb-1.5">
                Vendor / Contact Name
              </label>
              <input
                type="text"
                placeholder="e.g. Royal Decorators, ShutterPro"
                value={formData.vendorName || ''}
                onChange={(e) => setFormData({ ...formData, vendorName: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1.5">
                Payment Deadline / Due Date
              </label>
              <input
                type="date"
                value={formData.dueDate || ''}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20"
              />
            </div>
          </div>

          {/* Costs: Actual Cost & Advance Paid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-stone-50/70 p-3.5 rounded-2xl border border-stone-200/70">
            <div>
              <label className="block font-semibold text-stone-800 mb-1">
                Final / Actual Cost (₹) *
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-medium">₹</span>
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
                  className="w-full pl-7 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-stone-900 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-800 mb-1">
                Advance Paid So Far (₹)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400 font-medium">₹</span>
                <input
                  type="number"
                  min="0"
                  max={formData.actualCost}
                  value={formData.paidAmount}
                  onChange={(e) => setFormData({ ...formData, paidAmount: Number(e.target.value) })}
                  className="w-full pl-7 pr-3 py-2 bg-white border border-stone-200 rounded-xl text-emerald-700 font-bold text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
                />
              </div>
              <div className="text-[10px] text-stone-500 mt-1">
                Pending: <span className="font-semibold text-stone-700">{formatINR(Math.max(0, formData.actualCost - formData.paidAmount))}</span>
              </div>
            </div>
          </div>

          {/* Split Ratio Setting Section */}
          <div className="bg-gradient-to-br from-amber-50/60 to-orange-50/40 p-4 rounded-2xl border border-amber-200/70 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-stone-900 flex items-center gap-1.5 text-xs">
                <Percent size={14} className="text-amber-600" />
                Cost Sharing Formula
              </span>
              <span className="text-[11px] font-semibold text-amber-800 bg-amber-100/80 px-2 py-0.5 rounded-full">
                {shares.groomPercent}% Groom : {shares.bridePercent}% Bride
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                type="button"
                onClick={() => setFormData({ ...formData, splitType: 'EQUAL_50_50' })}
                className={`py-2 px-2.5 rounded-xl border text-center transition-all ${
                  formData.splitType === 'EQUAL_50_50'
                    ? 'bg-amber-600 text-white font-bold border-amber-600 shadow-xs'
                    : 'bg-white text-stone-700 hover:bg-stone-50 border-stone-200'
                }`}
              >
                <div className="font-semibold text-xs">50 : 50</div>
                <div className="text-[9px] opacity-80">Equal Share</div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, splitType: 'GUEST_RATIO' })}
                className={`py-2 px-2.5 rounded-xl border text-center transition-all ${
                  formData.splitType === 'GUEST_RATIO'
                    ? 'bg-purple-600 text-white font-bold border-purple-600 shadow-xs'
                    : 'bg-white text-stone-700 hover:bg-stone-50 border-stone-200'
                }`}
              >
                <div className="font-semibold text-xs">Guest Ratio</div>
                <div className="text-[9px] opacity-80">{groomRatio}% : {brideRatio}%</div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, splitType: 'GROOM_ONLY' })}
                className={`py-2 px-2.5 rounded-xl border text-center transition-all ${
                  formData.splitType === 'GROOM_ONLY'
                    ? 'bg-blue-600 text-white font-bold border-blue-600 shadow-xs'
                    : 'bg-white text-stone-700 hover:bg-stone-50 border-stone-200'
                }`}
              >
                <div className="font-semibold text-xs">🤵 Groom 100%</div>
                <div className="text-[9px] opacity-80">Boy Side Only</div>
              </button>

              <button
                type="button"
                onClick={() => setFormData({ ...formData, splitType: 'BRIDE_ONLY' })}
                className={`py-2 px-2.5 rounded-xl border text-center transition-all ${
                  formData.splitType === 'BRIDE_ONLY'
                    ? 'bg-rose-600 text-white font-bold border-rose-600 shadow-xs'
                    : 'bg-white text-stone-700 hover:bg-stone-50 border-stone-200'
                }`}
              >
                <div className="font-semibold text-xs">👰 Bride 100%</div>
                <div className="text-[9px] opacity-80">Girl Side Only</div>
              </button>
            </div>

            {/* Live Calculated Split Preview */}
            <div className="pt-2 border-t border-amber-200/60 flex items-center justify-between text-xs">
              <div>
                <span className="text-[10px] text-stone-500 uppercase font-semibold block">Groom Due</span>
                <span className="font-bold text-blue-700 text-sm">{formatINR(shares.groomDue)}</span>
              </div>
              <div className="text-stone-300 font-light text-lg">+</div>
              <div>
                <span className="text-[10px] text-stone-500 uppercase font-semibold block">Bride Due</span>
                <span className="font-bold text-rose-700 text-sm">{formatINR(shares.brideDue)}</span>
              </div>
              <div className="text-stone-300 font-light text-lg">=</div>
              <div>
                <span className="text-[10px] text-stone-500 uppercase font-semibold block">Total</span>
                <span className="font-bold text-stone-900 text-sm">{formatINR(formData.actualCost)}</span>
              </div>
            </div>
          </div>

          {/* Paid By & Status */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block font-semibold text-stone-700 mb-1.5">
                Who Physically Paid Advance?
              </label>
              <select
                value={formData.paidBy}
                onChange={(e) => setFormData({ ...formData, paidBy: e.target.value as any })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 font-medium focus:bg-white focus:outline-none"
              >
                <option value="SHARED">Joint / Split (Shared)</option>
                <option value="GROOM">Groom Side Paid</option>
                <option value="BRIDE">Bride Side Paid</option>
                <option value="UNPAID">Not Paid Yet</option>
              </select>
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1.5">
                Current Booking Status
              </label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-800 font-medium focus:bg-white focus:outline-none"
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
            <label className="block font-semibold text-stone-700 mb-1.5">
              Notes / Terms / Inclusions
            </label>
            <textarea
              rows={2}
              placeholder="e.g. 50% on booking, remaining before event day. Includes travel & stay for crew."
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500/20 text-xs"
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
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-red-600 hover:bg-red-50 text-xs font-semibold transition-colors"
              >
                <Trash2 size={14} />
                <span>Delete</span>
              </button>
            ) : <div />}

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-md shadow-amber-600/20 hover:shadow-lg transition-all"
              >
                <Check size={14} />
                <span>Save Changes</span>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
