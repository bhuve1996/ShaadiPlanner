'use client';

import React, { useState, useMemo } from 'react';
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
  FileSpreadsheet,
  Coins,
  ChevronDown,
  Filter,
  Layers,
  HeartHandshake,
  Music,
  Wine,
  Flame,
  Info
} from 'lucide-react';
import { CeremonyScheduleItem, ExpenseItem, WeddingEvent } from '@/types/wedding';
import { formatINR } from '@/lib/constants';
import { EVENT_IMAGES } from '@/lib/event-images';

interface WeddingCalendarProps {
  schedule: CeremonyScheduleItem[];
  expenses: ExpenseItem[];
  onUpdateScheduleItem?: (item: CeremonyScheduleItem) => void;
  onAddScheduleItem?: (item: CeremonyScheduleItem) => void;
  onDeleteScheduleItem?: (id: string) => void;
}

// Ceremony guide dossiers: What happens, key highlights, rituals & etiquette
const CEREMONY_GUIDE: Record<string, {
  tagline: string;
  ritualOverview: string;
  keyHighlights: string[];
  dressCodeSuggestion: string;
  hostSide: 'Groom' | 'Bride' | 'Mutual';
  colorTheme: string;
}> = {
  'Roka / Engagement': {
    tagline: 'Ring Exchange, Sweets & Official Family Union',
    ritualOverview: 'The official announcement and commitment ceremony. Bhuvesh & Harshu exchange engagement rings (Gold with Diamond accent for Harshu, Gold Band for Bhuvi), followed by family tilak, feeding of sweets (shagun mithai), and formal blessings from elders.',
    keyHighlights: ['Engagement Ring Exchange', 'Ardas / Tilak Blessing', 'Gift & Shagun Envelopes Exchange', 'Harshu 200 Guests High-Tea & Lunch'],
    dressCodeSuggestion: 'Pastel Cocktail Gown / Kurta Pajama with Nehru Jacket',
    hostSide: 'Mutual',
    colorTheme: 'from-pink-500/10 to-indigo-500/10 border-pink-300 dark:border-pink-800'
  },
  'Mehendi': {
    tagline: 'Fragrant Henna, Folk Geets & Vibrant Sundowner',
    ritualOverview: 'A lively afternoon ceremony where intricate bridal henna is applied to Harshu’s hands and feet by specialist artists, with Bhuvesh’s initials hidden in the artwork. Female relatives enjoy mehendi, folk dholak geets, and afternoon high-tea in the resort hall.',
    keyHighlights: ['Bridal Mehndi Artwork (Hidden Initial)', 'Family & Bridesmaids Henna', 'Folk Dholak & Antakshari', 'No-rent in-house banquet arrangement'],
    dressCodeSuggestion: 'Bright Greens, Yellows, Floral Prints & Light Lehengas',
    hostSide: 'Mutual',
    colorTheme: 'from-emerald-500/10 to-teal-500/10 border-emerald-300 dark:border-emerald-800'
  },
  'Sangeet & Cocktail': {
    tagline: 'High-Energy Family Dance Faceoff & DJ Beats',
    ritualOverview: 'A glamorous musical night featuring choreographed family dance performances where Harshu’s side and Bhuvi’s side showcase dance medleys, followed by couple performance, signature mocktails/cocktails, and high-energy Bollywood DJ party until late night.',
    keyHighlights: ['Bhuvi vs Harshu Family Dance Faceoff', 'Couple Dance Performance', 'Live DJ & Dancefloor Euphoria', 'Gourmet Cocktail Dinner Buffet'],
    dressCodeSuggestion: 'Sparkling Lehengas, Tuxedos, Indo-Western Bandhgalas',
    hostSide: 'Mutual',
    colorTheme: 'from-blue-500/10 to-violet-500/10 border-blue-300 dark:border-blue-800'
  },
  'Haldi': {
    tagline: 'Auspicious Turmeric Ubtan, Phoolon Ki Holi & Punjabi Dhol',
    ritualOverview: 'A joyful morning ritual where sanctified turmeric paste (ubtan), rosewater, and sandalwood are lovingly applied onto the bride and groom to bring auspicious glow and ward off the evil eye. Culminates in a vibrant Phoolon Ki Holi (flower petal shower) and dhol beats.',
    keyHighlights: ['Sacred Turmeric Ubtan Application', 'Phoolon Ki Holi (Flower Petal Shower)', 'Traditional Punjabi Dhol', 'Casual Summer Indian Lunch'],
    dressCodeSuggestion: 'Shades of Yellow, Mustard, Gold, Cotton Kurtas',
    hostSide: 'Mutual',
    colorTheme: 'from-amber-500/10 to-yellow-500/10 border-amber-300 dark:border-amber-800'
  },
  'Baraat & Wedding Pheras': {
    tagline: 'Royal Procession, Milni, Varmala & 7 Sacred Pheras',
    ritualOverview: 'The main Vedic wedding ceremony. Bhuvesh arrives in a royal baraat procession with vintage car and brass band. Harshu’s family welcomes the baraat with Milni warm blankets & garlands. Followed by majestic Varmala on stage, ribbon katai & shoe hiding negotiations, and 7 sacred pheras around the agni havan kund.',
    keyHighlights: ['Royal Vintage Car Baraat & Brass Band', 'Milni Garlands & Warm Blankets Welcome', 'Grand Varmala Stage Reveal', '7 Sacred Vedic Pheras & Sindoor Daan', 'Ribbon Katai & Juta Lukai Negotiations'],
    dressCodeSuggestion: 'Traditional Heavy Red/Maroon Lehenga & Royal Sherwani with Turban',
    hostSide: 'Mutual',
    colorTheme: 'from-rose-500/10 to-pink-500/10 border-rose-300 dark:border-rose-800'
  },
  'Vida (Bidai / Doli)': {
    tagline: 'Emotional Farewell, Rice Tossing & Doli Departure',
    ritualOverview: 'The deeply emotional early morning ceremony where Harshu bids farewell to her maternal home, gently tossing puffed rice over her head to thank her parents for a lifetime of love and prosperity. Harshu’s family presents parting gifts (saris & suit lengths) to traveling relatives.',
    keyHighlights: ['Rice Tossing (Puffed Rice / Laja Homa)', 'Parental Farewell & Tearful Hugs', 'Gifting Farewell Saris & Suits to Relatives', 'Departure to Groom’s Home'],
    dressCodeSuggestion: 'Traditional Indian Ethnic / Morning Shawls',
    hostSide: 'Bride',
    colorTheme: 'from-pink-500/10 to-purple-500/10 border-pink-300 dark:border-pink-800'
  },
  'Reception': {
    tagline: 'Formal Couple Showcase, Toast & Royal Gala Dinner',
    ritualOverview: 'The concluding formal celebration where the newly wedded couple is introduced to society, friends, colleagues, and extended relatives. Guests greet Bhuvesh & Harshu on stage, offer blessings & shagun, and celebrate with a grand banquet feast.',
    keyHighlights: ['Stage Welcome & Couple Introductions', 'Family Toast & Photo Sessions', 'Extensive Multi-Cuisine Banquet Feast', 'Live Melodic Background Ensembles'],
    dressCodeSuggestion: 'Formal Evening Gowns, Designer Sarees & Dark Suits',
    hostSide: 'Mutual',
    colorTheme: 'from-purple-500/10 to-indigo-500/10 border-purple-300 dark:border-purple-800'
  }
};

export const WeddingCalendar: React.FC<WeddingCalendarProps> = ({
  schedule,
  expenses,
  onUpdateScheduleItem,
  onAddScheduleItem,
  onDeleteScheduleItem,
}) => {
  const [selectedDate, setSelectedDate] = useState<string>('ALL');
  const [selectedCeremonyFilter, setSelectedCeremonyFilter] = useState<string>('ALL');
  const [expandedCeremonyId, setExpandedCeremonyId] = useState<string | null>(null);
  const [editingItem, setEditingItem] = useState<CeremonyScheduleItem | null>(null);
  const [showModal, setShowModal] = useState(false);

  // Group unique dates
  const dates = Array.from(new Set(schedule.map(s => s.date))).sort();

  // Filtered ceremonies based on Date and/or Ceremony Filter
  const filteredCeremonies = useMemo(() => {
    return schedule.filter(item => {
      const matchDate = selectedDate === 'ALL' || item.date === selectedDate;
      const matchCeremony = selectedCeremonyFilter === 'ALL' || item.title === selectedCeremonyFilter;
      return matchDate && matchCeremony;
    });
  }, [schedule, selectedDate, selectedCeremonyFilter]);

  // Overall financial summary for ceremonies
  const totalLinkedExpensesSum = useMemo(() => {
    let sum = 0;
    expenses.forEach(e => {
      sum += (e.actualCost || e.estimatedCost || 0);
    });
    return sum;
  }, [expenses]);

  const handleSaveModal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    if (onUpdateScheduleItem) {
      onUpdateScheduleItem(editingItem);
    }
    setEditingItem(null);
    setShowModal(false);
  };

  const toggleExpand = (id: string) => {
    setExpandedCeremonyId(prev => prev === id ? null : id);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Calendar Control Bar */}
      <div className="bg-white/95 dark:bg-[#121626]/95 backdrop-blur-xl p-5 sm:p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 dark:bg-pink-950/60 text-pink-700 dark:text-pink-300 text-xs font-black mb-1 border border-pink-300 dark:border-pink-800">
              <CalendarDays size={14} className="text-pink-600" />
              <span>Wedding Master Itinerary & Ceremonies Guide</span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white">
              Ceremonies, Rituals & Timing Schedule
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-0.5">
              Explore each ceremony in detail: what happens, ritual significance, timings, guest counts, and linked ledger expenses.
            </p>
          </div>

          {/* Quick Stats Pill */}
          <div className="flex items-center gap-3 bg-slate-100/80 dark:bg-slate-900/60 px-4 py-2.5 rounded-2xl border border-slate-200 dark:border-white/10 flex-shrink-0 text-xs">
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Ceremonies</span>
              <strong className="text-sm font-black text-slate-900 dark:text-white">{schedule.length} Events</strong>
            </div>
            <div className="h-6 w-px bg-slate-200 dark:bg-slate-700" />
            <div>
              <span className="text-[10px] uppercase font-bold text-slate-400 block">Duration</span>
              <strong className="text-sm font-black text-pink-600 dark:text-pink-400">3 Auspicious Days</strong>
            </div>
          </div>
        </div>

        {/* Date & Ceremony Quick Selectors */}
        <div className="pt-2 border-t border-slate-100 dark:border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          
          {/* Day Buttons */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pb-1">
            <button
              onClick={() => setSelectedDate('ALL')}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border shadow-2xs whitespace-nowrap ${
                selectedDate === 'ALL'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent font-black'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-white/10 hover:border-slate-300'
              }`}
            >
              🗓️ All 3 Days ({schedule.length})
            </button>

            {dates.map((d, idx) => {
              const dateObj = new Date(d);
              const dayName = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
              const dayNum = dateObj.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });
              const isSelected = selectedDate === d;
              const count = schedule.filter(s => s.date === d).length;

              return (
                <button
                  key={d}
                  onClick={() => setSelectedDate(d)}
                  className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer border shadow-2xs whitespace-nowrap flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-pink-500 to-rose-600 text-white border-transparent font-black shadow-xs'
                      : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-white/10 hover:border-slate-300'
                  }`}
                >
                  <span>Day {idx + 1}: {dayNum} ({dayName})</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Ceremony Specific Pill Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar text-xs">
            <span className="text-[11px] text-slate-400 font-bold whitespace-nowrap hidden lg:inline">Filter by Ritual:</span>
            <select
              value={selectedCeremonyFilter}
              onChange={(e) => setSelectedCeremonyFilter(e.target.value)}
              className="text-xs font-bold px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-white/10 text-slate-700 dark:text-slate-200 cursor-pointer focus:outline-none"
            >
              <option value="ALL">✨ All Ceremonies</option>
              {schedule.map(s => (
                <option key={s.id} value={s.title}>
                  {s.emoji} {s.title}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Ceremony Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCeremonies.map((item) => {
          const guide = CEREMONY_GUIDE[item.title] || {
            tagline: 'Traditional Wedding Ceremony & Blessings',
            ritualOverview: item.description,
            keyHighlights: ['Ceremony Rituals', 'Family Blessings', 'Celebratory Feast'],
            dressCodeSuggestion: 'Traditional Indian Festive Attire',
            hostSide: 'Mutual',
            colorTheme: 'from-pink-500/10 to-rose-500/10 border-pink-300 dark:border-pink-800'
          };

          const eventExpenses = expenses.filter(x => x.event === item.title);
          const totalEventCost = eventExpenses.reduce((sum, x) => sum + (x.actualCost || x.estimatedCost || 0), 0);
          const isExpanded = expandedCeremonyId === item.id;

          const dateObj = new Date(item.date);
          const formattedDate = dateObj.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric', year: 'numeric' });

          return (
            <div
              key={item.id}
              className={`bg-white dark:bg-[#121626] rounded-3xl border-2 transition-all duration-300 shadow-md hover:shadow-xl flex flex-col justify-between overflow-hidden ${
                isExpanded ? 'border-pink-400 dark:border-pink-600 ring-2 ring-pink-400/20' : 'border-slate-200/90 dark:border-white/10'
              }`}
            >
              {/* Photo Banner with Badges */}
              <div className="relative h-48 sm:h-52 w-full overflow-hidden">
                <img
                  src={item.image || EVENT_IMAGES[item.title as WeddingEvent]?.image || EVENT_IMAGES['All Events'].image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-black/20" />

                {/* Top Badges */}
                <div className="absolute top-3.5 left-3.5 right-3.5 flex items-center justify-between">
                  <span className={`text-[11px] font-black px-3 py-1 rounded-full border shadow-sm backdrop-blur-md ${item.tagColor}`}>
                    {item.startTime} – {item.endTime}
                  </span>
                  
                  <div className="flex items-center gap-1.5">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/50 backdrop-blur-md text-white text-[10.5px] font-bold border border-white/20">
                      {item.guestCount || 300} Guests
                    </span>
                    <span className="text-2xl drop-shadow-md">{item.emoji}</span>
                  </div>
                </div>

                {/* Title & Date Overlay */}
                <div className="absolute bottom-3.5 left-3.5 right-3.5 text-white">
                  <div className="text-[10px] font-extrabold uppercase tracking-wider text-pink-300 mb-0.5">
                    {formattedDate}
                  </div>
                  <h4 className="font-black text-xl sm:text-2xl drop-shadow-md leading-tight">
                    {item.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-amber-200 drop-shadow-sm font-medium mt-1">
                    <MapPin size={13} className="text-amber-300 flex-shrink-0" />
                    <span className="truncate">{item.venue}</span>
                  </div>
                </div>
              </div>

              {/* Ceremony Dossier Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                
                {/* Tagline & Meaning */}
                <div className="space-y-3">
                  <div className="p-3 rounded-2xl bg-gradient-to-r from-pink-50 to-amber-50 dark:from-pink-950/20 dark:to-amber-950/20 border border-pink-200/60 dark:border-pink-900/30">
                    <div className="text-xs font-black text-pink-900 dark:text-pink-200">
                      ✨ {guide.tagline}
                    </div>
                    <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                      {guide.ritualOverview}
                    </p>
                  </div>

                  {/* Highlights Bullet Pills */}
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1.5">
                      Key Ceremony Highlights
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {guide.keyHighlights.map((hl, i) => (
                        <span 
                          key={i}
                          className="inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-white/5"
                        >
                          <span className="text-pink-500">✦</span>
                          <span>{hl}</span>
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Dress Code & Host Pill */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-[11px] text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <span>👗 Dress Code:</span>
                      <strong className="text-slate-700 dark:text-slate-200 font-bold">{guide.dressCodeSuggestion}</strong>
                    </div>
                  </div>
                </div>

                {/* Linked Expenses Breakdown Drawer / Toggle */}
                <div className="pt-3 border-t border-slate-100 dark:border-white/10 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Ceremony Budget / Linked Cost</span>
                      <div className="flex items-baseline gap-2">
                        <strong className="font-mono text-base font-black text-slate-900 dark:text-white">
                          {formatINR(totalEventCost)}
                        </strong>
                        <span className="text-[11px] text-slate-500 font-medium">
                          ({eventExpenses.length} specific items)
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      {eventExpenses.length > 0 && (
                        <button
                          type="button"
                          onClick={() => toggleExpand(item.id)}
                          className="px-2.5 py-1 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-bold text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-white/10 cursor-pointer transition-colors flex items-center gap-1"
                        >
                          <span>{isExpanded ? 'Hide Items' : 'View Items'}</span>
                          <ChevronDown size={13} className={`transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                      )}

                      <button
                        onClick={() => {
                          setEditingItem(item);
                          setShowModal(true);
                        }}
                        className="p-1.5 rounded-xl text-slate-400 hover:text-pink-600 dark:hover:text-pink-400 hover:bg-pink-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
                        title="Edit Timing & Venue"
                      >
                        <Edit3 size={15} />
                      </button>
                    </div>
                  </div>

                  {/* Expandable Linked Expenses Item List */}
                  {isExpanded && eventExpenses.length > 0 && (
                    <div className="mt-2.5 p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/70 border border-slate-200 dark:border-white/10 space-y-1.5 animate-in fade-in duration-150">
                      <div className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-1">
                        Linked Expenses for {item.title}:
                      </div>
                      {eventExpenses.map(exp => (
                        <div 
                          key={exp.id}
                          className="flex items-center justify-between text-xs py-1 border-b border-slate-200/60 dark:border-white/5 last:border-none"
                        >
                          <div className="truncate pr-2">
                            <span className="font-bold text-slate-800 dark:text-slate-200">{exp.name}</span>
                            <span className="text-[10.5px] text-slate-400 ml-1.5">({exp.category})</span>
                          </div>
                          <span className="font-mono font-bold text-slate-900 dark:text-white flex-shrink-0">
                            {formatINR(exp.actualCost || exp.estimatedCost || 0)}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}

                </div>

              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Time / Venue Modal */}
      {showModal && editingItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm p-3 sm:p-6 flex justify-center items-start sm:items-center">
          <div className="bg-white dark:bg-[#11141D] rounded-3xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-white/10 my-4 sm:my-8 text-slate-800 dark:text-slate-100 animate-in fade-in zoom-in-95 duration-150 max-h-[92vh] flex flex-col">
            <h3 className="text-base font-black mb-1 flex-shrink-0 text-slate-900 dark:text-white">
              Edit Ceremony Schedule: {editingItem.title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 flex-shrink-0">
              Update date, timing slots, venue details and estimated attendance.
            </p>

            <form onSubmit={handleSaveModal} className="space-y-3.5 text-xs overflow-y-auto pr-1 flex-1">
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

              <div className="grid grid-cols-2 gap-3">
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

              <div className="pt-4 border-t border-slate-100 dark:border-white/10 flex justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-500 font-bold hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
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
