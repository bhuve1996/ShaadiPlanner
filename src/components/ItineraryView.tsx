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
    description: 'Intricate henna application for bride, family & friends, live dholak singers, and refreshing sugarcane juice bar.',
    tagColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
  },
  {
    title: 'Sangeet & Cocktail',
    day: 'Day 1 - Evening',
    time: '7:30 PM - Late Night',
    venue: 'Grand Crystal Ballroom',
    emoji: '🪩',
    image: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80',
    description: 'Choreographed dances by Groom vs Bride sides, awards ceremony, celebrity DJ beats, and signature craft cocktails.',
    tagColor: 'bg-blue-100 text-blue-900 border-blue-300',
  },
  {
    title: 'Haldi',
    day: 'Day 2 - Morning',
    time: '10:00 AM - 1:00 PM',
    venue: 'Yellow Blooms Garden Lawn',
    emoji: '🌼',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    description: 'Traditional turmeric ubtan paste ceremony, Phoolon Ki Holi (flower petals shower), and Punjabi dhol beats.',
    tagColor: 'bg-amber-100 text-amber-900 border-amber-300',
  },
  {
    title: 'Baraat & Wedding Pheras',
    day: 'Day 2 - Evening',
    time: '6:00 PM - Midnight',
    venue: 'Royal Palace Mandap Lawn',
    emoji: '🔥',
    image: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?auto=format&fit=crop&w=800&q=80',
    description: 'Grand vintage car baraat procession, majestic varmala stage firecrackers, and 7 sacred pheras around holy fire.',
    tagColor: 'bg-rose-100 text-rose-900 border-rose-300',
  },
  {
    title: 'Reception',
    day: 'Day 3 - Dinner',
    time: '8:00 PM onwards',
    venue: 'Royal Starlight Terrace',
    emoji: '🥂',
    image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=800&q=80',
    description: 'Formal blessings from elders, elegant couple toast, acoustic musical ensemble, and multi-cuisine royal banquet dinner.',
    tagColor: 'bg-purple-100 text-purple-900 border-purple-300',
  },
];

export const ItineraryView: React.FC<ItineraryViewProps> = ({ expenses }) => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-50 to-rose-50 p-5 rounded-3xl border-2 border-amber-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h3 className="text-lg font-black text-stone-900 flex items-center gap-2">
            <CalendarIcon className="text-amber-600 w-5 h-5" />
            <span>Ceremony Festivities & Visual Timeline</span>
          </h3>
          <p className="text-xs text-stone-600 font-medium mt-0.5">
            Detailed itinerary with venues, times, photography cues, and linked budget liabilities.
          </p>
        </div>
        <div className="text-xs font-bold text-amber-900 bg-amber-200/60 px-3 py-1.5 rounded-xl border border-amber-300 self-start sm:self-auto">
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
              className="bg-white rounded-3xl border-2 border-amber-200/80 shadow-md hover:shadow-xl hover:border-amber-400 transition-all overflow-hidden flex flex-col justify-between group"
            >
              {/* Event Image Banner with Overlay */}
              <div className="relative h-44 w-full overflow-hidden">
                <img 
                  src={ev.image} 
                  alt={ev.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                
                {/* Day Tag on Top */}
                <div className="absolute top-3 left-3">
                  <span className={`text-[11px] font-black px-3 py-1 rounded-full border shadow-sm backdrop-blur-xs ${ev.tagColor}`}>
                    {ev.day}
                  </span>
                </div>

                <div className="absolute top-3 right-3 text-2xl drop-shadow-md">
                  {ev.emoji}
                </div>

                {/* Event Name & Venue inside image footer */}
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h4 className="font-black text-lg drop-shadow-md">
                    {ev.title}
                  </h4>
                  <div className="flex items-center gap-1.5 text-xs text-amber-200 drop-shadow-sm mt-0.5">
                    <MapPin size={12} className="text-amber-300 flex-shrink-0" />
                    <span className="truncate">{ev.venue}</span>
                  </div>
                </div>
              </div>

              {/* Card Body Details */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-1.5 text-xs text-stone-700 font-semibold mb-2 bg-stone-50 px-2.5 py-1 rounded-lg border border-stone-200/60">
                    <Clock size={13} className="text-amber-600" />
                    <span>{ev.time}</span>
                  </div>

                  <p className="text-xs text-stone-600 leading-relaxed">
                    {ev.description}
                  </p>
                </div>

                {/* Event Financial Snapshot Footer */}
                <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-stone-400 text-[10px] uppercase font-bold block">Event Expenditure</span>
                    <span className="font-extrabold text-stone-900 text-sm">{formatINR(eventTotal)}</span>
                  </div>
                  <span className="text-[11px] text-amber-900 font-bold bg-amber-100 px-2.5 py-1 rounded-xl border border-amber-200">
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
