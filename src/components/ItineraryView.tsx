'use client';

import React from 'react';
import { 
  Calendar as CalendarIcon, 
  MapPin, 
  Clock, 
  Sparkles, 
  Flame, 
  Heart, 
  Music, 
  PartyPopper 
} from 'lucide-react';
import { ExpenseItem, WeddingEvent } from '@/types/wedding';
import { formatINR } from '@/lib/constants';

interface ItineraryViewProps {
  expenses: ExpenseItem[];
}

interface EventSchedule {
  title: WeddingEvent;
  day: string;
  time: string;
  venue: string;
  emoji: string;
  image: string;
  description: string;
  tagColor: string;
}

const SCHEDULE: EventSchedule[] = [
  {
    title: 'Mehendi',
    day: 'Day 1 - Morning',
    time: '11:00 AM - 3:30 PM',
    venue: 'Heritage Poolside Courtyard',
    emoji: '🌿',
    image: 'https://images.unsplash.com/photo-1598887142487-3c854d51d2c7?auto=format&fit=crop&w=800&q=80',
    description: 'Intricate henna application for Harshu, family & friends, live dholak singers, and refreshing sugarcane juice bar.',
    tagColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  },
  {
    title: 'Sangeet & Cocktail',
    day: 'Day 1 - Evening',
    time: '7:30 PM - Late Night',
    venue: 'Grand Crystal Ballroom',
    emoji: '🪩',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    description: 'Choreographed dances by Harshu vs Bhuvesh families, awards ceremony, celebrity DJ beats, and signature craft cocktails.',
    tagColor: 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  },
  {
    title: 'Haldi',
    day: 'Day 2 - Morning',
    time: '10:00 AM - 1:00 PM',
    venue: 'Yellow Blooms Garden Lawn',
    emoji: '🌼',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    description: 'Traditional turmeric ubtan paste ceremony, Phoolon Ki Holi (flower petals shower), and Punjabi dhol beats.',
    tagColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  },
  {
    title: 'Baraat & Wedding Pheras',
    day: 'Day 2 - Evening',
    time: '6:00 PM - Midnight',
    venue: 'Royal Palace Mandap Lawn',
    emoji: '🔥',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    description: 'Grand vintage car baraat for Bhuvesh, majestic varmala stage fireworks, and 7 sacred pheras around holy fire.',
    tagColor: 'bg-rose-500/20 text-rose-300 border-rose-500/30',
  },
  {
    title: 'Reception',
    day: 'Day 3 - Dinner',
    time: '8:00 PM onwards',
    venue: 'Royal Starlight Terrace',
    emoji: '🥂',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
    description: 'Formal blessings from elders, couple toast, acoustic musical ensemble, and multi-cuisine royal banquet dinner.',
    tagColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
  },
];

export const ItineraryView: React.FC<ItineraryViewProps> = ({ expenses }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#121624]/90 backdrop-blur-xl p-5 rounded-3xl border border-white/10 shadow-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-white flex items-center gap-2">
            <CalendarIcon className="text-amber-400 w-5 h-5" />
            <span>Ceremony Festivities & Visual Timeline</span>
          </h3>
          <p className="text-xs text-slate-400 font-medium mt-0.5">
            Detailed itinerary with venues, times, and linked budget liabilities.
          </p>
        </div>
        <div className="text-xs font-bold text-amber-300 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-xl self-start sm:self-auto">
          5 Grand Ceremonies Scheduled
        </div>
      </div>

      {/* Visual Itinerary Cards with Rich Cover Photos */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {SCHEDULE.map((ev) => {
          const eventExpenses = expenses.filter(x => x.event === ev.title || x.event === 'All Events');
          const eventTotal = eventExpenses.reduce((sum, item) => sum + (item.actualCost || item.estimatedCost || 0), 0);

          return (
            <div 
              key={ev.title} 
              className="bg-[#121624]/90 backdrop-blur-xl rounded-3xl border border-white/10 shadow-xl hover:border-amber-400/40 transition-all overflow-hidden flex flex-col justify-between group"
            >
              {/* Event Image Banner with Overlay */}
              <div className="relative h-44 w-full overflow-hidden">
                <img 
                  src={ev.image} 
                  alt={ev.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121624] via-black/30 to-transparent" />
                
                {/* Day Tag on Top */}
                <div className="absolute top-3 left-3">
                  <span className={`text-[11px] font-black px-3 py-1 rounded-full border shadow-sm backdrop-blur-md ${ev.tagColor}`}>
                    {ev.day}
                  </span>
                </div>

                <div className="absolute top-3 right-3 text-2xl drop-shadow-md">
                  {ev.emoji}
                </div>

                {/* Event Name & Venue inside image footer */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h4 className="font-black text-lg drop-shadow-md text-amber-100">
                    {ev.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-slate-300 drop-shadow-sm mt-0.5 font-medium">
                    <MapPin size={12} className="text-amber-400 flex-shrink-0" />
                    <span className="truncate">{ev.venue}</span>
                  </div>
                </div>
              </div>

              {/* Card Body Details */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-slate-300 font-semibold mb-2 bg-white/5 px-3 py-1.5 rounded-xl border border-white/10">
                    <Clock size={13} className="text-amber-400" />
                    <span>{ev.time}</span>
                  </div>

                  <p className="text-xs text-slate-400 leading-relaxed">
                    {ev.description}
                  </p>
                </div>

                {/* Event Financial Snapshot Footer */}
                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-slate-500 text-[10px] uppercase font-bold block">Event Expenditure</span>
                    <span className="font-extrabold text-white text-sm">{formatINR(eventTotal)}</span>
                  </div>
                  <span className="text-[11px] text-amber-300 font-bold bg-amber-500/10 px-2.5 py-1 rounded-xl border border-amber-500/30">
                    {eventExpenses.length} items linked
                  </span>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
