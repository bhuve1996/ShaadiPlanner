'use client';

import React, { useState } from 'react';
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
  icon: string;
  description: string;
}

const SCHEDULE: EventSchedule[] = [
  {
    title: 'Mehendi',
    day: 'Day 1 - Morning',
    time: '11:00 AM - 3:00 PM',
    venue: 'Heritage Poolside Courtyard',
    icon: '🌸',
    description: 'Henna application for bride & guests, live dholak, and colorful summer setup.',
  },
  {
    title: 'Sangeet & Cocktail',
    day: 'Day 1 - Evening',
    time: '7:30 PM - Late Night',
    venue: 'Grand Crystal Ballroom',
    icon: '🪩',
    description: 'Choreographed family dance performances, DJ beats, cocktails & live food counters.',
  },
  {
    title: 'Haldi',
    day: 'Day 2 - Morning',
    time: '10:00 AM - 1:00 PM',
    venue: 'Yellow Blooms Garden Lawn',
    icon: '🌼',
    description: 'Ubtan ceremony with turmeric, phoolon ki holi (flower shower), and music.',
  },
  {
    title: 'Baraat & Wedding Pheras',
    day: 'Day 2 - Evening',
    time: '6:00 PM - Midnight',
    venue: 'Royal Palace Mandap Lawn',
    icon: '💍',
    description: 'Vintage car baraat, varmala stage fireworks, sacred pheras by holy fire.',
  },
  {
    title: 'Reception',
    day: 'Day 3 - Dinner',
    time: '8:00 PM onwards',
    venue: 'Royal Starlight Terrace',
    icon: '🥂',
    description: 'Formal blessings, family toasts, musical ensemble, and sit-down royal feast.',
  },
];

export const ItineraryView: React.FC<ItineraryViewProps> = ({ expenses }) => {
  return (
    <div className="space-y-4">
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center justify-between">
        <div>
          <h3 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <CalendarIcon className="text-amber-600 w-5 h-5" />
            Wedding Festivities Timeline & Event Budgets
          </h3>
          <p className="text-xs text-stone-500">
            Each ceremony mapped with venues, timings, and dedicated expense allocations.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {SCHEDULE.map((ev, index) => {
          // Calculate items and total budget for this specific event
          const eventExpenses = expenses.filter(x => x.event === ev.title || x.event === 'All Events');
          const eventTotal = eventExpenses.reduce((sum, item) => sum + (item.actualCost || item.estimatedCost || 0), 0);

          return (
            <div 
              key={ev.title} 
              className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs hover:border-amber-300 transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{ev.icon}</span>
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                    {ev.day}
                  </span>
                </div>

                <h4 className="font-bold text-base text-stone-900 mt-2">
                  {ev.title}
                </h4>

                <div className="mt-2 space-y-1 text-xs text-stone-600">
                  <div className="flex items-center gap-1.5">
                    <Clock size={13} className="text-stone-400" />
                    <span>{ev.time}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <MapPin size={13} className="text-stone-400" />
                    <span className="truncate">{ev.venue}</span>
                  </div>
                </div>

                <p className="text-xs text-stone-500 mt-3 leading-relaxed">
                  {ev.description}
                </p>
              </div>

              {/* Event Budget Footer */}
              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <div>
                  <span className="text-stone-400 text-[10px] uppercase font-bold block">Allocated Cost</span>
                  <span className="font-bold text-stone-900 text-sm">{formatINR(eventTotal)}</span>
                </div>
                <span className="text-[11px] text-amber-700 font-semibold bg-amber-50 px-2 py-1 rounded-md">
                  {eventExpenses.length} items linked
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

