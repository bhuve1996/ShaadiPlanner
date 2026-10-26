'use client';

import React, { useState } from 'react';
import { Settings, Users, Calendar, IndianRupee, HeartHandshake, Sparkles, X, Check } from 'lucide-react';
import { WeddingSettings } from '@/types/wedding';

interface SettingsModalProps {
  settings: WeddingSettings;
  isOpen: boolean;
  onClose: () => void;
  onSave: (newSettings: WeddingSettings) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  settings,
  isOpen,
  onClose,
  onSave,
}) => {
  const [formData, setFormData] = useState<WeddingSettings>({ ...settings });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const totalGuests = (Number(formData.groomGuestCount) || 0) + (Number(formData.brideGuestCount) || 0) || 1;
  const groomRatio = Math.round(((Number(formData.groomGuestCount) || 0) / totalGuests) * 100);
  const brideRatio = 100 - groomRatio;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2 text-stone-900 font-bold text-base">
            <HeartHandshake className="text-amber-600 w-5 h-5" />
            <span>Wedding & Guest Split Configuration</span>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-4 space-y-4 text-xs">
          <div>
            <label className="block font-semibold text-stone-700 mb-1">Wedding Header / Title</label>
            <input
              type="text"
              value={formData.coupleTitle}
              onChange={(e) => setFormData({ ...formData, coupleTitle: e.target.value })}
              className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500/20"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Groom's Side Label</label>
              <input
                type="text"
                value={formData.groomName}
                onChange={(e) => setFormData({ ...formData, groomName: e.target.value })}
                className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none"
              />
            </div>
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Bride's Side Label</label>
              <input
                type="text"
                value={formData.brideName}
                onChange={(e) => setFormData({ ...formData, brideName: e.target.value })}
                className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          {/* Dynamic Guest Split setup */}
          <div className="bg-amber-50/60 p-3.5 rounded-xl border border-amber-200/60 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-900 flex items-center gap-1.5">
                <Users size={14} />
                Dynamic Guest Ratio Calculator
              </span>
              <span className="text-[11px] font-semibold text-amber-800">
                {groomRatio}% Groom : {brideRatio}% Bride
              </span>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-0.5">Groom Guests</label>
                <input
                  type="number"
                  min="0"
                  value={formData.groomGuestCount}
                  onChange={(e) => setFormData({ ...formData, groomGuestCount: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 bg-white border border-amber-200 rounded-lg text-blue-700 font-bold focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-0.5">Bride Guests</label>
                <input
                  type="number"
                  min="0"
                  value={formData.brideGuestCount}
                  onChange={(e) => setFormData({ ...formData, brideGuestCount: Number(e.target.value) })}
                  className="w-full px-2.5 py-1.5 bg-white border border-amber-200 rounded-lg text-rose-700 font-bold focus:outline-none"
                />
              </div>
            </div>

            <p className="text-[10px] text-amber-800/80 leading-normal">
              Any expense marked as <em>"By Guest Ratio"</em> (like catering, welcome hampers, or hotel rooms) will auto-split using this ratio.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block font-semibold text-stone-700 mb-1">Target Total Budget (₹)</label>
              <input
                type="number"
                value={formData.totalTargetBudget}
                onChange={(e) => setFormData({ ...formData, totalTargetBudget: Number(e.target.value) })}
                className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none font-semibold"
              />
            </div>

            <div>
              <label className="block font-semibold text-stone-700 mb-1">Wedding Date</label>
              <input
                type="date"
                value={formData.weddingDate}
                onChange={(e) => setFormData({ ...formData, weddingDate: e.target.value })}
                className="w-full px-3 py-2 border border-stone-200 rounded-xl focus:outline-none"
              />
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-3 border-t border-stone-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold flex items-center gap-1.5 shadow-xs"
            >
              <Check size={14} />
              Save Configuration
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

