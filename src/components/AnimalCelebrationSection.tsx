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
  { emoji: '🐎', name: 'Baraat Ghodi (White Horse)', subtitle: 'Baraat Swag for Bhuvesh', soundText: 'NEIGH! 🪘' },
  { emoji: '🦚', name: 'Mor (Dancing Peacock)', subtitle: 'Harsha Sangeet Welcome', soundText: 'PIHU-PIHU! 🌸' },
  { emoji: '🐪', name: 'Royal Unt (Desert Camel)', subtitle: 'Rajasthani Royal Caravan', soundText: 'PADHARO MARE DESH! 🏜️' },
  { emoji: '🐅', name: 'Shahi Sher (Royal Tiger)', subtitle: 'Courage & Grandeur', soundText: 'ROAR! 👑' },
];

export const AnimalCelebrationSection: React.FC = () => {
  const [activeWalkers, setActiveWalkers] = useState<WalkingAnimal[]>([]);

  const launchWalkingAnimal = (animal: typeof CELEBRATION_TROUPE[0]) => {
    const id = `walker-${Date.now()}-${Math.random()}`;
    const topPercent = 20 + Math.floor(Math.random() * 55);
    const speedSeconds = 7 + Math.random() * 4;

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

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#D4AF37', '#F59E0B', '#EF4444', '#3B82F6', '#10B981']
    });

    setTimeout(() => {
      setActiveWalkers((prev) => prev.filter((w) => w.id !== id));
    }, speedSeconds * 1000);
  };

  const launchGrandProcession = () => {
    CELEBRATION_TROUPE.forEach((animal, index) => {
      setTimeout(() => {
        launchWalkingAnimal(animal);
      }, index * 800);
    });
  };

  return (
    <>
      {/* 1. Interactive Troupe Selection Card */}
      <div className="bg-[#121624]/90 backdrop-blur-xl rounded-3xl p-5 sm:p-6 border border-white/10 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 text-amber-300 border border-amber-500/30 text-xs font-bold mb-2">
              <Sparkles size={13} className="text-amber-400" />
              <span>Royal Baraat Celebration Troupe</span>
            </div>
            <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <span>Shahi Barat Procession</span>
              <span className="text-base">🎉</span>
            </h3>
            <p className="text-xs text-slate-400 font-medium mt-1 max-w-xl">
              Click any ceremonial mascot below to have them <strong>walk across your screen</strong> with celebratory wedding flower showers!
            </p>
          </div>

          <button
            onClick={launchGrandProcession}
            className="flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-xs font-black shadow-lg shadow-amber-500/20 hover:brightness-110 active:scale-95 transition-all cursor-pointer"
          >
            <PartyPopper size={16} />
            <span>Launch Grand Caravan</span>
          </button>
        </div>

        {/* Troupe Mascot Buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 mt-4">
          {CELEBRATION_TROUPE.map((animal) => (
            <button
              key={animal.name}
              onClick={() => launchWalkingAnimal(animal)}
              className="bg-[#161B2E] hover:bg-[#1E243C] rounded-2xl p-3 border border-white/10 hover:border-amber-400/50 shadow-md transition-all active:scale-95 text-center flex flex-col items-center justify-center gap-1.5 group cursor-pointer"
            >
              <span className="text-4xl group-hover:scale-125 transition-transform duration-300 block drop-shadow-md">
                {animal.emoji}
              </span>
              <div className="font-bold text-xs text-slate-200 group-hover:text-amber-300 transition-colors">
                {animal.name.split(' ')[0]} {animal.name.split(' ')[1]}
              </div>
              <span className="text-[10px] text-amber-300/80 font-bold bg-amber-500/10 border border-amber-500/20 px-2 py-0.5 rounded-full">
                Walk Screen ➡️
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Full-Screen Floating Walkers Layer */}
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
            {/* Animal Mascot */}
            <div className="text-6xl sm:text-7xl drop-shadow-2xl animate-bounce-subtle transform scale-x-[-1]">
              {walker.emoji}
            </div>

            {/* Speech Bubble */}
            <div className="bg-[#121624]/95 border-2 border-amber-400 text-white px-3.5 py-1.5 rounded-2xl shadow-2xl backdrop-blur-md whitespace-nowrap">
              <div className="text-xs font-black text-amber-300 flex items-center gap-1">
                <span>🎊</span>
                <span>{walker.name}</span>
              </div>
              <div className="text-[11px] font-bold text-slate-200">
                {walker.soundText} • Badhaai Ho!
              </div>
            </div>

            {/* Trailing Flower Petals */}
            <div className="text-2xl animate-spin-slow opacity-80">
              🌸 ✨ 🌺
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
