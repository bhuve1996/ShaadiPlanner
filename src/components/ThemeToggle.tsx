'use client';

import React from 'react';
import { Sun, Moon, Sparkles } from 'lucide-react';
import { useTheme } from '@/context/ThemeContext';

export const ThemeToggle: React.FC = () => {
  const { mode, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`relative inline-flex items-center gap-1.5 px-3 py-1.5 rounded-2xl border text-xs font-black transition-all cursor-pointer shadow-sm active:scale-95 ${
        mode === 'night'
          ? 'bg-[#181E32] text-amber-300 border-amber-400/40 hover:bg-[#202742]'
          : 'bg-white text-slate-800 border-pink-200 hover:bg-pink-50'
      }`}
      title={mode === 'night' ? 'Switch to Day (Floral Blossom)' : 'Switch to Night (Starlight Velvet)'}
    >
      {mode === 'night' ? (
        <>
          <Moon size={14} className="text-amber-400 fill-amber-400" />
          <span>Starlight Night 🌙</span>
        </>
      ) : (
        <>
          <Sun size={14} className="text-amber-500 fill-amber-400" />
          <span>Floral Day ☀️</span>
        </>
      )}
    </button>
  );
};
