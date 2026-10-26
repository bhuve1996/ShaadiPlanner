'use client';

import React, { useState } from 'react';
import { Sparkles, PartyPopper } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WalkingAnimal {
  id: string;
  emoji: string;
  name: string;
  subtitle: string;
  soundText: string;
  topPercent: number; // Vertical position across screen
  speedSeconds: number; // Walking duration
}

const CELEBRATION_TROUPE = [
  { emoji: '🐘', name: 'Royal Hathi (Elephant)', subtitle: 'Royal Maharaja Procession', soundText: 'TRUMPET! 🎺' },
  { emoji: '🐎', name: 'Groom Baraat Ghodi (White Horse)', subtitle: 'Baraat Swag for Bhuvesh', soundText: 'NEIGH! 🪘' },
  { emoji: '🦚', name: 'Mor (Peacock Dance)', subtitle: 'Harsha Sangeet Welcome', soundText: 'PIHU-PIHU! 🌸' },
  { emoji: '🐪', name: 'Royal Unt (Desert Camel)', subtitle: 'Rajasthani Royal Caravan', soundText: 'PADHARO MARE DESH! 🏜️' },
  { emoji: '🐅', name: 'Shahi Sher (Royal Tiger)', subtitle: 'Courage & Grandeur', soundText: 'ROAR! 👑' },
];

export const AnimalCelebrationSection: React.FC = () => {
  const [activeWalkers, setActiveWalkers] = useState<WalkingAnimal[]>([]);

  const launchWalkingAnimal = (animal: typeof CELEBRATION_TROUPE[0]) => {
    const id = `walker-${Date.now()}-${Math.random()}`;
    // Randomize vertical band so they don't overlap completely
    const topPercent = 20 + Math.floor(Math.random() * 55);
    const speedSeconds = 7 + Math.random() * 4; // Between 7s and 11s

    const newWalker: WalkingAnimal = {
      id,
      emoji: animal.emoji,
      name: animal.name,
      subtitle: animal.subtitle,
      soundText: animal.soundText,
      topPercent,
      speedSeconds,
    };

    setActiveWalkers((prev) => [...prev, newWalker]);

    // Flower confetti shower
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#DC2626', '#D97706', '#F59E0B', '#E11D48', '#047857']
    });

    // Remove walker after animation finishes
    setTimeout(() => {
      setActiveWalkers((prev) => prev.filter((w) => w.id !== id));
    }, speedSeconds * 1000);
  };

  const launchGrandProcession = () => {
    // Launch all 5 in sequence
    CELEBRATION_TROUPE.forEach((animal, index) => {
      setTimeout(() => {
        launchWalkingAnimal(animal);
      }, index * 800);
    });
  };

  return (
    <>
      {/* 1. Interactive Troupe Selection Card */}
      <div className="bg-gradient-to-r from-amber-500/15 via-rose-500/15 to-amber-500/15 rounded-3xl p-5 sm:p-6 border-2 border-amber-300 shadow-md relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300 text-xs font-black mb-2 shadow-2xs">
              <Sparkles size={13} className="text-amber-600 animate-spin-slow" />
              <span>Royal Baraat Celebration Troupe</span>
            </div>
            <h3 className="text-xl font-black text-stone-900 tracking-tight flex items-center gap-2">
              <span>Shahi Barat Animal Procession</span>
              <span className="text-base">🎉</span>
            </h3>
            <p className="text-xs text-stone-600 font-medium mt-1 max-w-xl">
              Click any of the royal ceremonial animals below to make them <strong>walk joyfully across your entire screen</strong> with flowers, music, and celebratory sounds!
            </p>
          </div>

          <button
            onClick={launchGrandProcession}
            className="flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 via-rose-500 to-amber-600 text-white text-xs font-black shadow-lg hover:brightness-110 active:scale-95 transition-all cursor-pointer border border-amber-300"
          >
            <PartyPopper size={16} />
            <span>Grand Royal Caravan (Launch All)</span>
          </button>
        </div>

        {/* Troupe Buttons Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-4">
          {CELEBRATION_TROUPE.map((animal) => (
            <button
              key={animal.name}
              onClick={() => launchWalkingAnimal(animal)}
              className="bg-white/95 hover:bg-amber-50/90 rounded-2xl p-3 border-2 border-amber-200/90 hover:border-amber-400 shadow-xs hover:shadow-md transition-all active:scale-95 text-center flex flex-col items-center justify-center gap-1.5 group cursor-pointer"
            >
              <span className="text-4xl group-hover:scale-125 transition-transform duration-300 block drop-shadow-sm">
                {animal.emoji}
              </span>
              <div className="font-black text-xs text-stone-900 group-hover:text-amber-800 transition-colors">
                {animal.name.split(' ')[0]} {animal.name.split(' ')[1]}
              </div>
              <span className="text-[10px] text-amber-800 font-bold bg-amber-100/80 px-2 py-0.5 rounded-full">
                Click to Walk ➡️
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Full-Screen Floating Walkers Layer (Fixed Z-Index overlay) */}
      <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
        {activeWalkers.map((walker) => (
          <div
            key={walker.id}
            className="absolute flex items-center gap-3 animate-walk-across"
            style={{
              top: `${walker.topPercent}%`,
              animationDuration: `${walker.speedSeconds}s`,
            }}
          >
            {/* The Animal with celebratory bounce */}
            <div className="text-6xl sm:text-7xl drop-shadow-2xl animate-bounce-subtle transform scale-x-[-1]">
              {walker.emoji}
            </div>

            {/* Celebratory Speech Bubble */}
            <div className="bg-white/95 border-2 border-amber-400 text-stone-900 px-3.5 py-1.5 rounded-2xl shadow-xl backdrop-blur-xs whitespace-nowrap animate-pulse">
              <div className="text-xs font-black text-amber-900 flex items-center gap-1">
                <span>🎊</span>
                <span>{walker.name}</span>
              </div>
              <div className="text-[11px] font-bold text-rose-600">
                {walker.soundText} • Badhaai Ho!
              </div>
            </div>

            {/* Trailing Flower Petals */}
            <div className="text-2xl animate-spin-slow opacity-80">
              🌸 🌺 ✨
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
