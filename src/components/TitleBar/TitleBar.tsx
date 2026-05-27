import { Menu, Sun, Moon, Settings } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';

export default function TitleBar() {
  const { theme, toggleTheme } = useThemeStore();

  return (
    <div className="h-10 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] flex items-center justify-between px-4 select-none">
      <div className="flex items-center gap-3">
        <Menu className="w-5 h-5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer transition-colors" />
        <span className="font-semibold text-sm text-[var(--text-primary)]">
          云端代码工作室
        </span>
      </div>
      
      <div className="flex items-center gap-2">
        <button
          onClick={toggleTheme}
          className="p-2 rounded-md hover:bg-[var(--bg-tertiary)] transition-colors"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-[var(--accent-orange)]" />
          ) : (
            <Moon className="w-4 h-4 text-[var(--accent-purple)]" />
          )}
        </button>
        <button
          className="p-2 rounded-md hover:bg-[var(--bg-tertiary)] transition-colors"
          title="Settings"
        >
          <Settings className="w-4 h-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)]" />
        </button>
      </div>
    </div>
  );
}
