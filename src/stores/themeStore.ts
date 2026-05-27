import { create } from 'zustand';
import { Theme } from '@/types';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const getInitialTheme = (): Theme => {
  const saved = localStorage.getItem('cloud-code-theme');
  if (saved === 'light' || saved === 'dark') {
    return saved;
  }
  return 'dark';
};

export const useThemeStore = create<ThemeState>((set) => ({
  theme: getInitialTheme(),
  toggleTheme: () => {
    set((state) => {
      const newTheme = state.theme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('cloud-code-theme', newTheme);
      return { theme: newTheme };
    });
  },
  setTheme: (theme) => {
    localStorage.setItem('cloud-code-theme', theme);
    set({ theme });
  },
}));
