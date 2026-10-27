'use client';

import React, { useState } from 'react';
import { PartyPopper, Music, X } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WalkingCharacter {
  id: string;
  emoji: string;
  name: string;
  subtitle: string;
  soundText: string;
  topPercent: number;
  speedSeconds: number;
}

const CELEBRATION_TROUPE = [
  { emoji: '🥁🪘', name: 'Punjabi Dhol Master', soundText: 'DHOL DHAMAKA! 🪘' },
  { emoji: '🐘', name: 'Royal Hathi', soundText: 'TRUMPET! 🎺' },
  { emoji: '🐎', name: 'Baraat Ghodi', soundText: 'NEIGH! 🪘' },
  { emoji: '🦚', name: 'Dancing Peacock', soundText: 'PIHU-PIHU! 🌸' },
  { emoji: '🐪', name: 'Royal Camel', soundText: 'PADHARO MARE DESH! 🏜️' },
  { emoji: '🐅', name: 'Shahi Sher', soundText: 'ROAR! 👑' },
];

export const AnimalCelebrationSection: React.FC = () => {
  const [activeWalkers, setActiveWalkers] = useState<WalkingCharacter[]>([]);
  const [isOpen, setIsOpen] = useState(false);

  const launchWalkingCharacter = (character: typeof CELEBRATION_TROUPE[0]) => {
    const id = `walker-${Date.now()}-${Math.random()}`;
    const topPercent = 20 + Math.floor(Math.random() * 50);
    const speedSeconds = 7 + Math.random() * 3.5;

    const newWalker: WalkingCharacter = {
      id,
      emoji: character.emoji,
      name: character.name,
      subtitle: '',
      soundText: character.soundText,
      topPercent,
      speedSeconds,
    };

    setActiveWalkers((prev) => [...prev, newWalker]);

    confetti({
      particleCount: 40,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#F43F5E', '#3B82F6', '#8B5CF6', '#F59E0B', '#10B981']
    });

    setTimeout(() => {
      setActiveWalkers((prev) => prev.filter((w) => w.id !== id));
    }, speedSeconds * 1000);
  };

  const launchGrandProcession = () => {
    CELEBRATION_TROUPE.forEach((character, index) => {
      setTimeout(() => {
        launchWalkingCharacter(character);
      }, index * 700);
    });
  };

  return (
    <>
      {/* Floating Mascot / Baja Baraat Launcher Button */}
      <div className="fixed bottom-5 left-5 z-40">
        {!isOpen ? (
          <button
            onClick={() => setIsOpen(true)}
            title="Royal Baja Baraat & Dhol Beats"
            className="group flex items-center gap-2.5 px-3.5 py-2.5 rounded-full bg-white dark:bg-[#11141D] border border-slate-200 dark:border-white/10 shadow-lg hover:shadow-xl hover:border-pink-300 dark:hover:border-pink-500/30 transition-all cursor-pointer active:scale-95"
          >
            <span className="text-xl group-hover:scale-125 transition-transform duration-300">🥁</span>
            <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 group-hover:text-pink-600 dark:group-hover:text-pink-400">
              Baja Baraat
            </span>
          </button>
        ) : (
          <div className="bg-white dark:bg-[#11141D] border border-slate-200 dark:border-white/10 rounded-2xl p-3.5 shadow-2xl w-72 sm:w-80 backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-200">
            <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-white/10">
              <div className="flex items-center gap-1.5 text-xs font-bold text-slate-900 dark:text-white">
                <Music size={14} className="text-pink-600 dark:text-pink-400" />
                <span>Royal Baraat & Dhol Troupe</span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 cursor-pointer"
              >
                <X size={15} />
              </button>
            </div>

            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-2.5">
              Click a mascot to march them across your screen, or launch the full wedding caravan!
            </p>

            {/* Mascot Grid */}
            <div className="grid grid-cols-3 gap-1.5 mb-2.5">
              {CELEBRATION_TROUPE.map((character) => (
                <button
                  key={character.name}
                  onClick={() => launchWalkingCharacter(character)}
                  className="p-2 rounded-xl border border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/[0.02] hover:bg-pink-50 dark:hover:bg-pink-950/20 hover:border-pink-200 dark:hover:border-pink-500/30 flex flex-col items-center gap-1 transition-all cursor-pointer active:scale-95 text-center"
                >
                  <span className="text-2xl drop-shadow-xs">{character.emoji}</span>
                  <span className="text-[10px] font-medium text-slate-700 dark:text-slate-300 truncate max-w-full">
                    {character.name.replace('Royal ', '')}
                  </span>
                </button>
              ))}
            </div>

            <button
              onClick={launchGrandProcession}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 text-xs font-semibold hover:opacity-90 active:scale-98 transition-all cursor-pointer shadow-xs"
            >
              <PartyPopper size={14} />
              <span>Launch Full Caravan 🥁</span>
            </button>
          </div>
        )}
      </div>

      {/* Screen Floating Walkers Layer (Moving smoothly across screen) */}
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
            <div className="text-5xl sm:text-6xl drop-shadow-xl animate-bounce-subtle transform scale-x-[-1]">
              {walker.emoji}
            </div>

            <div className="bg-white/95 dark:bg-[#11141D]/95 border border-slate-200 dark:border-white/10 text-slate-900 dark:text-white px-3 py-1 rounded-xl shadow-xl backdrop-blur-md whitespace-nowrap">
              <div className="text-[11px] font-bold text-pink-600 dark:text-pink-400 flex items-center gap-1">
                <span>🥁</span>
                <span>{walker.name}</span>
              </div>
              <div className="text-[10px] font-medium text-slate-700 dark:text-slate-300">
                {walker.soundText}
              </div>
            </div>

            <div className="text-xl animate-spin-slow opacity-75">
              🎵 🌸 🪘
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
