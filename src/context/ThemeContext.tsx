'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

type ThemeMode = 'day' | 'night';

interface ThemeContextType {
  mode: ThemeMode;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: 'day',
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<ThemeMode>('day');

  useEffect(() => {
    try {
      const saved = localStorage.getItem('shaadi_theme_mode');
      if (saved === 'night' || saved === 'day') {
        setMode(saved);
        if (saved === 'night') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      }
    } catch (e) {
      console.warn(e);
    }
  }, []);

  const toggleTheme = () => {
    setMode((prev) => {
      const next = prev === 'day' ? 'night' : 'day';
      try {
        localStorage.setItem('shaadi_theme_mode', next);
        if (next === 'night') {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
      } catch (e) {}
      return next;
    });
  };

  return (
    <ThemeContext.Provider value={{ mode, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
