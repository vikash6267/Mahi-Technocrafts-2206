'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>('light'); // Default to light theme

  useEffect(() => {
    // Force light theme and remove dark theme class
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
    setTheme('light');
  }, []);

  const toggleTheme = () => {
    // Force light theme and ignore toggles for now
    setTheme('light');
    document.documentElement.classList.remove('dark');
    document.documentElement.classList.add('light');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
