'use client';

import React, { useState } from 'react';
import { UserProfile } from '@/types/wedding';
import { SUGGESTED_AVATARS, SUGGESTED_NAMES, getDeviceInfo, saveCurrentUserProfile } from '@/lib/user-session';
import { Sparkles, Check, Heart, Shield } from 'lucide-react';

interface UserIdentityModalProps {
  isOpen: boolean;
  onSaveProfile: (profile: UserProfile) => void;
}

export const UserIdentityModal: React.FC<UserIdentityModalProps> = ({
  isOpen,
  onSaveProfile,
}) => {
  const [name, setName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('💍');
  const [deviceInfo] = useState(() => getDeviceInfo());

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const finalName = name.trim() || 'Family Member';
    const profile: UserProfile = {
      id: `user-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
      name: finalName,
      avatar: selectedAvatar,
      role: finalName.toLowerCase().includes('harsha')
        ? 'Bride'
        : finalName.toLowerCase().includes('bhuvi') || finalName.toLowerCase().includes('bhuvesh')
        ? 'Groom'
        : 'Family',
      deviceInfo,
      createdAt: new Date().toISOString(),
    };

    saveCurrentUserProfile(profile);
    onSaveProfile(profile);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-md p-4 flex justify-center items-center">
      <div className="bg-white dark:bg-[#11141D] rounded-3xl max-w-md w-full p-6 sm:p-7 shadow-2xl border border-slate-200 dark:border-white/10 text-slate-800 dark:text-slate-100 animate-in fade-in zoom-in-95 duration-200 relative">
        
        {/* Brand / Welcome Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-pink-50 dark:bg-pink-950/40 text-pink-700 dark:text-pink-300 border border-pink-200/60 dark:border-pink-800/40 text-[11px] font-bold">
            <Sparkles size={12} className="text-pink-500 animate-pulse" />
            <span>Harsha & Bhuvi&apos;s Wedding Planner</span>
          </div>

          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
            Who is joining this session?
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Choose your identity so family members can see who adds, updates, or checks off items in the live notification log.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* 1. Avatar Picker */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
              Choose Your Wedding Avatar
            </label>
            <div className="grid grid-cols-4 gap-2">
              {SUGGESTED_AVATARS.map((av) => (
                <button
                  key={av.emoji}
                  type="button"
                  onClick={() => setSelectedAvatar(av.emoji)}
                  className={`flex flex-col items-center justify-center p-2.5 rounded-2xl border text-center transition-all cursor-pointer ${
                    selectedAvatar === av.emoji
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 border-transparent shadow-md scale-105'
                      : 'bg-slate-50 dark:bg-slate-800/60 border-slate-200 dark:border-white/10 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <span className="text-2xl mb-0.5">{av.emoji}</span>
                  <span className={`text-[10px] font-bold ${
                    selectedAvatar === av.emoji ? 'text-white dark:text-slate-900' : 'text-slate-500 dark:text-slate-400'
                  }`}>
                    {av.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* 2. Name Input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Your Name *
            </label>
            <input
              type="text"
              required
              autoFocus
              placeholder="e.g. Bhuvesh, Harsha, Papa Ji, Bharti Di"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-2.5 bg-slate-50 dark:bg-[#1A1F2E] border-2 border-slate-300 dark:border-white/20 rounded-xl text-slate-900 dark:text-white font-bold text-sm focus:outline-none focus:border-slate-800 dark:focus:border-white transition-all shadow-2xs"
            />

            {/* Quick Name Chips */}
            <div className="flex flex-wrap gap-1.5 mt-2.5">
              {SUGGESTED_NAMES.map((sug) => (
                <button
                  key={sug}
                  type="button"
                  onClick={() => setName(sug)}
                  className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 border border-slate-200 dark:border-white/10 text-[10px] font-semibold text-slate-600 dark:text-slate-300 cursor-pointer transition-colors"
                >
                  {sug}
                </button>
              ))}
            </div>
          </div>

          {/* Device & Privacy Badge */}
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200 dark:border-white/5 text-[11px] text-slate-500 dark:text-slate-400">
            <Shield size={14} className="text-slate-400 flex-shrink-0" />
            <span className="truncate">
              Device: <strong>{deviceInfo}</strong> • Saved locally in this browser.
            </span>
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="w-full py-3 px-4 rounded-xl bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-black text-sm shadow-md hover:opacity-90 active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-2"
          >
            <span>Continue to Planner</span>
            <Check size={16} />
          </button>
        </form>

      </div>
    </div>
  );
};

