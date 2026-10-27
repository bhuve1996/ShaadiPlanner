'use client';

import React, { useState } from 'react';
import { 
  Sparkles, 
  Download, 
  Copy, 
  Check, 
  Palette, 
  Heart, 
  Eye, 
  Printer, 
  Share2,
  Calendar,
  Clock,
  MapPin,
  Flame,
  Music,
  CheckCircle2,
  Layers
} from 'lucide-react';
import { WeddingSettings } from '@/types/wedding';

interface WeddingCardStudioProps {
  settings: WeddingSettings;
  onToast?: (msg: string) => void;
}

type CardTheme = 'royal-obsidian' | 'champagne-gold' | 'rose-blush' | 'traditional-maroon' | 'minimal-modern';

interface WeddingCardTemplate {
  id: CardTheme;
  name: string;
  badge: string;
  previewBg: string;
  textColor: string;
  goldAccent: string;
  fontStyle: string;
  borderStyle: string;
  description: string;
}

const TEMPLATES: WeddingCardTemplate[] = [
  {
    id: 'royal-obsidian',
    name: 'Royal Obsidian & Gold',
    badge: 'Popular',
    previewBg: 'bg-[#0B0F19]',
    textColor: 'text-amber-100',
    goldAccent: 'from-amber-300 via-yellow-400 to-amber-500',
    fontStyle: 'font-serif',
    borderStyle: 'border-amber-400/30 shadow-2xl',
    description: 'Sophisticated midnight canvas crowned by radiant gold foil typography.'
  },
  {
    id: 'champagne-gold',
    name: 'Champagne & Ivory Elegance',
    badge: 'Luxury',
    previewBg: 'bg-[#FAF8F5]',
    textColor: 'text-stone-900',
    goldAccent: 'from-amber-600 via-yellow-600 to-amber-700',
    fontStyle: 'font-serif',
    borderStyle: 'border-amber-300 shadow-xl',
    description: 'Timeless ivory textured paper with rich champagne gold motifs.'
  },
  {
    id: 'rose-blush',
    name: 'Rose Romance & Slate',
    badge: 'Romantic',
    previewBg: 'bg-[#FFF5F6]',
    textColor: 'text-rose-950',
    goldAccent: 'from-rose-500 via-pink-600 to-rose-700',
    fontStyle: 'font-sans',
    borderStyle: 'border-rose-200 shadow-xl',
    description: 'Blush pink hues paired with soft floral accents and rose gold accents.'
  },
  {
    id: 'traditional-maroon',
    name: 'Vedic Maroon & Vermilion',
    badge: 'Traditional',
    previewBg: 'bg-[#4A0E17]',
    textColor: 'text-amber-100',
    goldAccent: 'from-yellow-300 via-amber-400 to-yellow-500',
    fontStyle: 'font-serif',
    borderStyle: 'border-yellow-500/40 shadow-2xl',
    description: 'Deep royal maroon with traditional Shubh Vivah auspicious Vedic motifs.'
  },
  {
    id: 'minimal-modern',
    name: 'Contemporary Editorial',
    badge: 'Modern',
    previewBg: 'bg-white',
    textColor: 'text-slate-900',
    goldAccent: 'from-slate-900 via-slate-700 to-slate-900',
    fontStyle: 'font-sans',
    borderStyle: 'border-slate-300 shadow-xl',
    description: 'Clean typographic layout with high-contrast, magazine-grade aesthetic.'
  }
];

export function WeddingCardStudio({ settings, onToast }: WeddingCardStudioProps) {
  const [selectedTheme, setSelectedTheme] = useState<CardTheme>('royal-obsidian');
  const [cardType, setCardType] = useState<'main' | 'itinerary' | 'reception'>('main');
  const [hasCopied, setHasCopied] = useState(false);
  
  // Customizable invitation card wording
  const [brideText, setBrideText] = useState(settings.brideName.replace(/\s*\(.*\)/, '') || 'Harsha');
  const [groomText, setGroomText] = useState(settings.groomName.replace(/\s*\(.*\)/, '') || 'Bhuvesh');
  const [weddingDateText, setWeddingDateText] = useState('Sunday, 14th February 2027 (Tentative)');
  const [venueNameText, setVenueNameText] = useState('The Heritage Grand Palace & Resort');
  const [venueLocationText, setVenueLocationText] = useState('Main Ballroom, Resort Lawns');
  const [familyNote, setFamilyNote] = useState('Together with their families, cordially invite you to celebrate the sacred union.');

  const currentTemplate = TEMPLATES.find(t => t.id === selectedTheme) || TEMPLATES[0];

  const handleCopyInvitationText = () => {
    const text = `🌸 WEDDING INVITATION 🌸\n\n${familyNote}\n\n✨ ${brideText} & ${groomText} ✨\n\n🗓️ Date: ${weddingDateText}\n📍 Venue: ${venueNameText}\n${venueLocationText}\n\nWe look forward to receiving your warmest blessings and presence!`;
    navigator.clipboard.writeText(text);
    setHasCopied(true);
    setTimeout(() => setHasCopied(false), 2000);
    if (onToast) onToast('Invitation text copied to clipboard!');
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="theme-card bg-white dark:bg-[#11141D] rounded-3xl p-6 border border-slate-200 dark:border-white/10 shadow-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-pink-100 dark:bg-pink-950/60 text-pink-600 dark:text-pink-400">
              <Sparkles size={20} />
            </span>
            <h2 className="text-xl font-black text-slate-900 dark:text-white">
              Wedding Card & Invitation Studio
            </h2>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Choose from luxury wedding card layouts (Digital & Print-ready), customize invitations, and export digital invites for WhatsApp & print.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyInvitationText}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold transition-all cursor-pointer border border-slate-300 dark:border-white/10 shadow-2xs"
          >
            {hasCopied ? <Check size={14} className="text-emerald-500" /> : <Copy size={14} />}
            <span>{hasCopied ? 'Copied Wording' : 'Copy Text'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 hover:opacity-90 text-xs font-bold transition-all cursor-pointer shadow-xs"
          >
            <Printer size={14} />
            <span>Print / PDF</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Controls on Left, Live Card Preview on Right */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left Control Column (5 Cols) */}
        <div className="lg:col-span-5 space-y-5">
          
          {/* 1. Theme Palette Selector */}
          <div className="theme-card bg-white dark:bg-[#11141D] rounded-2xl p-4 border border-slate-200 dark:border-white/10 shadow-sm space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <Palette size={14} className="text-pink-500" />
                <span>Card Style & Themes</span>
              </span>
              <span className="text-[10px] text-slate-400 font-medium">5 curated styles</span>
            </div>

            <div className="space-y-2">
              {TEMPLATES.map((tmpl) => {
                const isSelected = selectedTheme === tmpl.id;
                return (
                  <button
                    key={tmpl.id}
                    onClick={() => setSelectedTheme(tmpl.id)}
                    className={`w-full text-left p-3 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                      isSelected 
                        ? 'border-slate-900 dark:border-white bg-slate-50 dark:bg-white/5 ring-2 ring-slate-900/10 dark:ring-white/10 shadow-xs' 
                        : 'border-slate-200 dark:border-white/10 hover:border-slate-400 dark:hover:border-white/20 bg-white dark:bg-[#1A1F2E]'
                    }`}
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div className={`w-8 h-8 rounded-lg ${tmpl.previewBg} border border-slate-300 dark:border-white/20 flex-shrink-0 flex items-center justify-center`}>
                        <span className="text-xs">💍</span>
                      </div>
                      <div className="truncate">
                        <div className="font-bold text-xs text-slate-900 dark:text-white flex items-center gap-1.5">
                          <span>{tmpl.name}</span>
                          <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
                            {tmpl.badge}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-400 truncate">{tmpl.description}</p>
                      </div>
                    </div>
                    {isSelected && <Check size={16} className="text-slate-900 dark:text-white flex-shrink-0 ml-2" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* 2. Card View Mode Selector (Main Invitation, 3-Day Itinerary, Reception) */}
          <div className="theme-card bg-white dark:bg-[#11141D] rounded-2xl p-4 border border-slate-200 dark:border-white/10 shadow-sm space-y-2.5">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Layers size={14} className="text-purple-500" />
              <span>Card Page / Variation</span>
            </span>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={() => setCardType('main')}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all text-center cursor-pointer border ${
                  cardType === 'main'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-xs'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                💌 Main Invite
              </button>
              <button
                onClick={() => setCardType('itinerary')}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all text-center cursor-pointer border ${
                  cardType === 'itinerary'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-xs'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                🗓️ Itinerary
              </button>
              <button
                onClick={() => setCardType('reception')}
                className={`py-2 px-2.5 rounded-xl text-xs font-bold transition-all text-center cursor-pointer border ${
                  cardType === 'reception'
                    ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 border-transparent shadow-xs'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-white/10 text-slate-600 dark:text-slate-300 hover:bg-slate-50'
                }`}
              >
                🥂 Reception
              </button>
            </div>
          </div>

          {/* 3. Text Customizer Fields */}
          <div className="theme-card bg-white dark:bg-[#11141D] rounded-2xl p-4 border border-slate-200 dark:border-white/10 shadow-sm space-y-3">
            <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider block">
              Customize Text & Details
            </span>

            <div className="grid grid-cols-2 gap-2.5">
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Bride Name</label>
                <input
                  type="text"
                  value={brideText}
                  onChange={(e) => setBrideText(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>
              <div>
                <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Groom Name</label>
                <input
                  type="text"
                  value={groomText}
                  onChange={(e) => setGroomText(e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-slate-900 text-xs font-bold text-slate-900 dark:text-white"
                />
              </div>
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Wedding Date Text</label>
              <input
                type="text"
                value={weddingDateText}
                onChange={(e) => setWeddingDateText(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Venue & Resort</label>
              <input
                type="text"
                value={venueNameText}
                onChange={(e) => setVenueNameText(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-slate-900 text-xs font-medium text-slate-900 dark:text-white"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-slate-500 uppercase block mb-1">Invitation Family Note</label>
              <textarea
                rows={2}
                value={familyNote}
                onChange={(e) => setFamilyNote(e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 dark:border-white/15 bg-slate-50 dark:bg-slate-900 text-xs text-slate-900 dark:text-white"
              />
            </div>
          </div>

        </div>

        {/* Right Preview Column (7 Cols): The Live Rendered Wedding Card */}
        <div className="lg:col-span-7 flex flex-col items-center">
          
          <div className="text-[11px] font-bold text-slate-400 mb-2 uppercase tracking-wider flex items-center gap-1.5">
            <Eye size={13} />
            <span>Live Digital Invitation Preview</span>
          </div>

          {/* THE CARD CANVAS */}
          <div 
            className={`w-full max-w-[480px] min-h-[640px] rounded-3xl p-8 sm:p-10 border-4 transition-all duration-300 relative flex flex-col justify-between overflow-hidden ${currentTemplate.previewBg} ${currentTemplate.borderStyle}`}
          >
            {/* Corner Decorative Floral Filigree */}
            <div className="absolute top-3 left-3 opacity-30 select-none text-2xl font-serif">⚜</div>
            <div className="absolute top-3 right-3 opacity-30 select-none text-2xl font-serif">⚜</div>
            <div className="absolute bottom-3 left-3 opacity-30 select-none text-2xl font-serif">⚜</div>
            <div className="absolute bottom-3 right-3 opacity-30 select-none text-2xl font-serif">⚜</div>

            {/* Subtle inner gold foil border */}
            <div className="absolute inset-4 rounded-2xl border border-dashed border-amber-400/30 pointer-events-none" />

            {/* CARD CONTENT SWITCHER */}
            {cardType === 'main' && (
              <div className="text-center space-y-6 my-auto relative z-10">
                {/* Auspicious Header Motif */}
                <div className="space-y-1">
                  <span className="text-sm tracking-[0.25em] font-serif text-amber-500 uppercase">
                    || श्री गणेशाय नमः ||
                  </span>
                  <div className="text-xs opacity-75 font-serif tracking-widest uppercase">
                    Auspicious Wedding Union
                  </div>
                </div>

                {/* Family invitation quote */}
                <p className={`text-xs italic leading-relaxed max-w-xs mx-auto ${currentTemplate.textColor} opacity-90`}>
                  {familyNote}
                </p>

                {/* Couple Names Hero Typography */}
                <div className="py-2 space-y-1">
                  <h1 className={`text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r ${currentTemplate.goldAccent} bg-clip-text text-transparent`}>
                    {brideText}
                  </h1>
                  <div className="text-base font-serif italic text-amber-400/80 my-1">&</div>
                  <h1 className={`text-3xl sm:text-4xl font-black tracking-tight bg-gradient-to-r ${currentTemplate.goldAccent} bg-clip-text text-transparent`}>
                    {groomText}
                  </h1>
                </div>

                {/* Date & Ceremony Tag */}
                <div className="space-y-2 pt-2 border-t border-amber-400/20 max-w-[260px] mx-auto">
                  <div className="flex items-center justify-center gap-1.5 text-xs font-bold uppercase tracking-wider text-amber-500">
                    <Calendar size={13} />
                    <span>{weddingDateText}</span>
                  </div>
                  <div className="flex items-center justify-center gap-1.5 text-xs text-amber-400/90 font-medium">
                    <Clock size={12} />
                    <span>Baraat Chadhai 7:00 PM • Varmala 8:30 PM</span>
                  </div>
                </div>

                {/* Venue Details */}
                <div className="space-y-1 pt-2">
                  <div className="flex items-center justify-center gap-1 text-xs font-bold text-amber-500 uppercase tracking-widest">
                    <MapPin size={13} />
                    <span>Venue</span>
                  </div>
                  <h4 className={`text-sm font-black ${currentTemplate.textColor}`}>
                    {venueNameText}
                  </h4>
                  <p className="text-[11px] opacity-75 max-w-xs mx-auto">
                    {venueLocationText}
                  </p>
                </div>
              </div>
            )}

            {cardType === 'itinerary' && (
              <div className="text-center space-y-5 my-auto relative z-10">
                <div className="space-y-1">
                  <span className="text-xs tracking-[0.25em] font-serif text-amber-500 uppercase">
                    || शुभ विवाह कार्यक्रम ||
                  </span>
                  <h2 className={`text-xl font-black bg-gradient-to-r ${currentTemplate.goldAccent} bg-clip-text text-transparent`}>
                    Ceremony Itinerary
                  </h2>
                  <p className="text-[10px] text-amber-400 font-serif">Harsha & Bhuvi Festivities</p>
                </div>

                {/* 3-Day Schedule Capsules */}
                <div className="space-y-3 text-left max-w-xs mx-auto text-xs">
                  <div className="p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/20 space-y-0.5">
                    <div className="flex items-center justify-between font-bold text-amber-500">
                      <span>Day 1: Ring Ceremony & Shagun</span>
                      <span className="text-[10px]">11:00 AM</span>
                    </div>
                    <p className={`text-[11px] opacity-80 ${currentTemplate.textColor}`}>
                      Auspicious ring exchange & high-tea luncheon
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/20 space-y-0.5">
                    <div className="flex items-center justify-between font-bold text-amber-500">
                      <span>Day 2: Mehendi & Sangeet Beats</span>
                      <span className="text-[10px]">4:00 PM</span>
                    </div>
                    <p className={`text-[11px] opacity-80 ${currentTemplate.textColor}`}>
                      Floral henna art, live dhol beats & choreographed dances
                    </p>
                  </div>

                  <div className="p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/20 space-y-0.5">
                    <div className="flex items-center justify-between font-bold text-amber-500">
                      <span>Day 3: Shahi Baraat & Pheras</span>
                      <span className="text-[10px]">7:00 PM</span>
                    </div>
                    <p className={`text-[11px] opacity-80 ${currentTemplate.textColor}`}>
                      Royal vintage car procession, Varmala fireworks & 7 Vedic Pheras
                    </p>
                  </div>
                </div>

                <div className="text-[11px] opacity-75 pt-2">
                  📍 {venueNameText}
                </div>
              </div>
            )}

            {cardType === 'reception' && (
              <div className="text-center space-y-6 my-auto relative z-10">
                <div className="space-y-1">
                  <span className="text-xs tracking-[0.25em] font-serif text-amber-500 uppercase">
                    || स्वागत समारोह ||
                  </span>
                  <h2 className={`text-2xl font-black bg-gradient-to-r ${currentTemplate.goldAccent} bg-clip-text text-transparent`}>
                    Wedding Banquet & Dinner
                  </h2>
                  <p className="text-xs opacity-80 text-amber-400">In celebration of the newlyweds</p>
                </div>

                <div className="py-2 space-y-1">
                  <h1 className={`text-3xl font-black bg-gradient-to-r ${currentTemplate.goldAccent} bg-clip-text text-transparent`}>
                    {brideText} & {groomText}
                  </h1>
                </div>

                <div className="space-y-3 max-w-xs mx-auto text-xs">
                  <div className="p-3 rounded-xl bg-amber-400/10 border border-amber-400/20">
                    <div className="font-bold text-amber-500 text-sm">Gala Dinner Banquet</div>
                    <div className={`text-xs mt-1 ${currentTemplate.textColor}`}>
                      Multi-cuisine live stations, desserts & live instrumental music
                    </div>
                    <div className="text-[11px] font-mono text-amber-400 mt-2">
                      8:00 PM onwards
                    </div>
                  </div>
                </div>

                <p className={`text-[11px] italic opacity-80 ${currentTemplate.textColor}`}>
                  Kindly RSVP & join us with your warm presence and blessings.
                </p>
              </div>
            )}

            {/* Bottom Auspicious RSVP Bar */}
            <div className="text-center pt-4 border-t border-amber-400/20 relative z-10">
              <span className="text-[10px] tracking-widest font-mono text-amber-400/80 uppercase">
                R.S.V.P • Singla & Family
              </span>
            </div>
          </div>

          {/* Quick Sharing Helper */}
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
            <Share2 size={13} />
            <span>Digital invitation format formatted for WhatsApp, PDF exports & physical print printing.</span>
          </div>
        </div>

      </div>
    </div>
  );
}

