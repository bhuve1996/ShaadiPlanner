'use client';

import React, { useState } from 'react';
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Clock, 
  Sparkles, 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  Check, 
  ChevronRight, 
  CalendarDays,
  FileSpreadsheet
} from 'lucide-react';
import { CeremonyScheduleItem, ExpenseItem, WeddingEvent } from '@/types/wedding';
import { formatINR } from '@/lib/constants';

interface WeddingCalendarProps {
  schedule: CeremonyScheduleItem[];
  expenses: ExpenseItem[];
  onUpdateScheduleItem?: (item: CeremonyScheduleItem) => void;
  onAddScheduleItem?: (item: CeremonyScheduleItem) => void;
  onDeleteScheduleItem?: (id: string) => void;
}

export const WeddingCalendar: React.FC<WeddingCalendarProps> = ({
  schedule,
  expenses,
  onUpdateScheduleItem,
  onAddScheduleItem,
  onDeleteScheduleItem,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>('2026-11-27');
  const [editingItem, setEditingItem] = useState<CeremonyScheduleItem | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Group events by Date
  const dates = Array.from(new Set(schedule.map(s => s.date))).sort();

  // Active items for selected date
  const eventsForSelectedDate = schedule.filter(s => s.date === selectedDate);

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    if (onUpdateScheduleItem) {
      onUpdateScheduleItem(editingItem);
    }
    setEditingItem(null);
    setShowModal(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Calendar Control Bar */}
      <div className="bg-white/95 dark:bg-[#121626]/95 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border-2 border-pink-200 dark:border-white/10 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 text-xs font-black mb-1 border border-pink-300 dark:border-pink-800">
            <CalendarDays size={14} className="text-pink-600" />
            <span>Interactive Wedding Calendar & Timeline</span>
          </div>
          <h3 className="text-xl font-black text-slate-900 dark:text-white">
            Ceremony Schedule & Time Slots
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">
            Select dates below to inspect ceremony start/end times, venues, and linked expenses.
          </p>
        </div>

        {/* Date Selector Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {dates.map((d) => {
            const dateObj = new Date(d);
            const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
            const dayNum = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
            const isSelected = selectedDate === d;

            return (
              <button
                key={d}
                onClick={() => setSelectedDate(d)}
                className={`px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer border shadow-xs flex flex-col items-center ${
                  isSelected
                    ? 'bg-gradient-to-r from-pink-500 via-rose-500 to-blue-500 text-white border-transparent scale-105 shadow-md'
                    : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-pink-200 dark:border-white/10 hover:bg-pink-50 dark:hover:bg-slate-700'
                }`}
              >
                <span className="text-[10px] uppercase opacity-80">{dayName}</span>
                <span className="text-xs font-black">{dayNum}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Daily Timeline Events for Selected Date */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-2">
          <h4 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
            <span>Ceremonies on {new Date(selectedDate).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
            <span className="text-xs bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 px-2 py-0.5 rounded-full font-bold">
              {eventsForSelectedDate.length} ceremonies
            </span>
          </h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {eventsForSelectedDate.map((item) => {
            const eventExpenses = expenses.filter(x => x.event === item.title || x.event === 'All Events');
            const totalEventCost = eventExpenses.reduce((sum, x) => sum + (x.actualCost || x.estimatedCost || 0), 0);

            return (
              <div
                key={item.id}
                className="bg-white/95 dark:bg-[#121626]/95 backdrop-blur-xl rounded-3xl border-2 border-pink-200 dark:border-white/10 shadow-lg overflow-hidden flex flex-col justify-between hover:shadow-2xl transition-all"
              >
                {/* Cover Photo */}
                <div className="relative h-44 w-full overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                  {/* Header Badges inside Photo */}
                  <div className="absolute top-3 left-3">
                    <span className={`text-[11px] font-black px-3 py-1 rounded-full border shadow-sm backdrop-blur-md ${item.tagColor}`}>
                      {item.startTime} - {item.endTime}
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 text-3xl">
                    {item.emoji}
                  </div>

                  {/* Title & Venue */}
                  <div className="absolute bottom-3 left-3 right-3 text-white">
                    <h4 className="font-black text-lg drop-shadow-md">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-1.5 text-xs text-amber-200 drop-shadow-sm font-medium mt-0.5">
                      <MapPin size={12} className="text-amber-300 flex-shrink-0" />
                      <span className="truncate">{item.venue}</span>
                    </div>
                  </div>
                </div>

                {/* Details Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between text-xs font-bold text-slate-700 dark:text-slate-300 bg-slate-50 dark:bg-slate-900 p-2.5 rounded-xl border border-slate-200 dark:border-white/10">
                      <div className="flex items-center gap-1.5">
                        <Clock size={13} className="text-pink-600" />
                        <span>Slot: {item.startTime} to {item.endTime}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-purple-700 dark:text-purple-300">
                        <Users size={13} />
                        <span>~{item.guestCount || 300} Guests Expected</span>
                      </div>
                    </div>

                    <p className="text-xs text-slate-600 dark:text-slate-400 mt-3 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  {/* Footer Cost Details & Edit button */}
                  <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Linked Cost</span>
                      <span className="font-black text-sm text-slate-900 dark:text-white">
                        {formatINR(totalEventCost)}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-bold text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/60 px-2 py-0.5 rounded-lg border border-purple-200 dark:border-purple-800">
                        {eventExpenses.length} expense items
                      </span>
                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setShowModal(true);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-pink-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Edit Time & Venue"
                      >
                        <Edit3 size={15} />
                      </button>
                    </div>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      </div>

      {/* Edit Time / Venue Modal */}
      {showModal && editingItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-950/60 backdrop-blur-sm p-4">
          <div className="bg-white dark:bg-[#121628] rounded-3xl max-w-md w-full p-6 shadow-2xl border-2 border-pink-300 dark:border-white/20 text-slate-800 dark:text-slate-100 animate-in fade-in zoom-in-95 duration-150">
            <h3 className="text-base font-black mb-1">
              Edit Ceremony Schedule: {editingItem.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
              Update date, timing, and venue location.
            </p>

            <form onSubmit={handleSaveModal} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold mb-1">Ceremony Date</label>
                <input
                  type="date"
                  required
                  value={editingItem.date}
                  onChange={(e) => setEditingItem({ ...editingItem, date: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-bold mb-1">Start Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 11:00 AM"
                    value={editingItem.startTime}
                    onChange={(e) => setEditingItem({ ...editingItem, startTime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold mb-1">End Time</label>
                  <input
                    type="text"
                    placeholder="e.g. 03:30 PM"
                    value={editingItem.endTime}
                    onChange={(e) => setEditingItem({ ...editingItem, endTime: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold mb-1">Venue Location</label>
                <input
                  type="text"
                  value={editingItem.venue}
                  onChange={(e) => setEditingItem({ ...editingItem, venue: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl font-bold"
                />
              </div>

              <div>
                <label className="block font-bold mb-1">Expected Guests</label>
                <input
                  type="number"
                  value={editingItem.guestCount || 300}
                  onChange={(e) => setEditingItem({ ...editingItem, guestCount: Number(e.target.value) })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-xl font-bold"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-white/10 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-pink-500 hover:bg-pink-600 text-white font-black shadow-md cursor-pointer"
                >
                  Save Schedule
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

