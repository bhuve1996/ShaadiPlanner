'use client';

import React, { useState } from 'react';
import { Lock, Eye, EyeOff, ShieldCheck, X } from 'lucide-react';

interface SecurityCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (target: 'GOLD' | 'SHAGUN') => void;
  targetType: 'GOLD' | 'SHAGUN';
}

export const SecurityCodeModal: React.FC<SecurityCodeModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  targetType,
}) => {
  const [code, setCode] = useState('');
  const [error, setError] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (code === '14334') {
      onSuccess(targetType);
      setCode('');
      setError(false);
      onClose();
    } else {
      setError(true);
    }
  };

  const title = targetType === 'GOLD' ? 'Gold & Fine Jewelry' : 'Family Shagun & Gifts';
  const icon = targetType === 'GOLD' ? '✨' : '💌';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-white/10 rounded-3xl max-w-sm w-full p-6 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <X size={18} />
        </button>

        <div className="flex flex-col items-center text-center space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800/50 flex items-center justify-center text-2xl shadow-inner">
            {icon}
          </div>

          <div>
            <h3 className="text-base font-black text-slate-900 dark:text-white">
              Unlock {title}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Enter security passcode to reveal confidential figures and totals.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="w-full space-y-4 pt-2">
            <div className="relative">
              <input
                type="password"
                inputMode="numeric"
                pattern="[0-9]*"
                autoFocus
                placeholder="Enter passcode (e.g. 14334)"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value);
                  if (error) setError(false);
                }}
                className={`w-full text-center tracking-widest text-lg font-mono font-black py-2.5 px-4 rounded-xl border bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white outline-none transition-all ${
                  error
                    ? 'border-rose-500 ring-2 ring-rose-500/20'
                    : 'border-slate-300 dark:border-slate-700 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20'
                }`}
              />
              {error && (
                <p className="text-[11px] font-bold text-rose-500 mt-1.5 animate-shake">
                  Incorrect passcode. Please try again.
                </p>
              )}
            </div>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-2 px-3 text-xs font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 py-2 px-3 text-xs font-black text-white bg-amber-600 hover:bg-amber-700 active:scale-98 rounded-xl shadow-md cursor-pointer flex items-center justify-center gap-1.5"
              >
                <ShieldCheck size={14} />
                <span>Unlock View</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

