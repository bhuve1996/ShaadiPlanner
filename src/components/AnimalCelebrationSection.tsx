'use client';

import React, { useState } from 'react';
import { Sparkles, PartyPopper, Music } from 'lucide-react';
import confetti from 'canvas-confetti';

interface WalkingCharacter {
  id: string;
  emoji: string;
  name: string;
  subtitle: string;
  soundText: string;
  topPercent: number; // Vertical position across screen
  speedSeconds: number; // Walking duration
}

const CELEBRATION_TROUPE = [
  { emoji: '🥁🪘', name: 'Punjabi Dhol Master', subtitle: 'Baraat Beats for Bhuvesh & Harsha', soundText: 'DHOL DHAMAKA! DHIK-CHIK BOOM! 🪘' },
  { emoji: '🐘', name: 'Royal Hathi (Elephant)', subtitle: 'Royal Maharaja Procession', soundText: 'TRUMPET! 🎺' },
  { emoji: '🐎', name: 'Baraat Ghodi (White Horse)', subtitle: 'Baraat Swag for Bhuvesh', soundText: 'NEIGH! 🪘' },
  { emoji: '🦚', name: 'Mor (Dancing Peacock)', subtitle: 'Harsha Sangeet Welcome', soundText: 'PIHU-PIHU! 🌸' },
  { emoji: '🐪', name: 'Royal Unt (Desert Camel)', subtitle: 'Rajasthani Royal Caravan', soundText: 'PADHARO MARE DESH! 🏜️' },
  { emoji: '🐅', name: 'Shahi Sher (Royal Tiger)', subtitle: 'Courage & Grandeur', soundText: 'ROAR! 👑' },
];

export const AnimalCelebrationSection: React.FC = () => {
  const [activeWalkers, setActiveWalkers] = useState<WalkingCharacter[]>([]);

  const launchWalkingCharacter = (character: typeof CELEBRATION_TROUPE[0]) => {
    const id = `walker-${Date.now()}-${Math.random()}`;
    const topPercent = 18 + Math.floor(Math.random() * 55);
    const speedSeconds = 7 + Math.random() * 4;

    const newWalker: WalkingCharacter = {
      id,
      emoji: character.emoji,
      name: character.name,
      subtitle: character.subtitle,
      soundText: character.soundText,
      topPercent,
      speedSeconds,
    };

    setActiveWalkers((prev) => [...prev, newWalker]);

    // Flower petal confetti blast
    confetti({
      particleCount: 55,
      spread: 70,
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
      }, index * 750);
    });
  };

  return (
    <>
      {/* 1. Interactive Troupe Selection Card */}
      <div className="bg-white/90 backdrop-blur-md rounded-3xl p-5 sm:p-6 border-2 border-pink-200/80 shadow-lg relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-100 text-pink-700 border border-pink-300 text-xs font-black mb-2">
              <Music size={13} className="text-pink-600 animate-bounce" />
              <span>Royal Baraat Dhol & Ceremonial Troupe</span>
            </div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              <span>Baraat Procession & Dhol Beats</span>
              <span className="text-lg">🥁 🌸</span>
            </h3>
            <p className="text-xs text-slate-600 font-medium mt-1 max-w-xl">
              Click the <strong>Punjabi Dhol Master</strong> or royal wedding mascots to watch them <strong>march smoothly across your screen from left to right</strong> with celebratory drums, flower petals, and dholak beats!
            </p>
          </div>

          <button
            onClick={launchGrandProcession}
            className="flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-2xl bg-gradient-to-r from-pink-500 via-purple-500 to-blue-500 text-white text-xs font-black shadow-lg hover:brightness-105 active:scale-95 transition-all cursor-pointer"
          >
            <PartyPopper size={16} />
            <span>Launch Full Baraat & Dhol Caravan</span>
          </button>
        </div>

        {/* Troupe Mascot Buttons (Includes Dhol Player) */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mt-4">
          {CELEBRATION_TROUPE.map((character, idx) => (
            <button
              key={character.name}
              onClick={() => launchWalkingCharacter(character)}
              className={`rounded-2xl p-3 border-2 shadow-xs hover:shadow-md transition-all active:scale-95 text-center flex flex-col items-center justify-center gap-1.5 group cursor-pointer ${
                idx === 0 
                  ? 'bg-gradient-to-br from-amber-50 via-rose-50 to-pink-50 border-pink-400 ring-2 ring-pink-300/50' 
                  : 'bg-white hover:bg-pink-50/60 border-pink-200 hover:border-pink-300'
              }`}
            >
              <span className="text-4xl group-hover:scale-125 transition-transform duration-300 block drop-shadow-sm">
                {character.emoji}
              </span>
              <div className="font-black text-xs text-slate-900 group-hover:text-pink-600 transition-colors">
                {character.name.split(' ')[0]} {character.name.split(' ')[1] || ''}
              </div>
              <span className={`text-[10px] font-black px-2 py-0.5 rounded-full ${
                idx === 0 
                  ? 'bg-pink-500 text-white shadow-2xs' 
                  : 'bg-pink-100 text-pink-700'
              }`}>
                {idx === 0 ? '🥁 Beat Dhol ➡️' : 'Walk Screen ➡️'}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* 2. Full-Screen Floating Walkers Layer (Moving smoothly from left to right) */}
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
            {/* The Character / Dhol Person with rhythmic walking bounce */}
            <div className="text-6xl sm:text-7xl drop-shadow-2xl animate-bounce-subtle transform scale-x-[-1]">
              {walker.emoji}
            </div>

            {/* Celebratory Speech Bubble */}
            <div className="bg-white/95 border-2 border-pink-400 text-slate-900 px-3.5 py-1.5 rounded-2xl shadow-2xl backdrop-blur-md whitespace-nowrap">
              <div className="text-xs font-black text-pink-700 flex items-center gap-1">
                <span>🥁</span>
                <span>{walker.name}</span>
              </div>
              <div className="text-[11px] font-bold text-slate-800">
                {walker.soundText}
              </div>
            </div>

            {/* Trailing Musical Notes & Flower Petals */}
            <div className="text-2xl animate-spin-slow opacity-80">
              🎵 🌸 🪘 ✨
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
