import { useState, useEffect } from 'react';
import { X, Command } from 'lucide-react';

interface ShortcutHelpProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ShortcutItem {
  action: string;
  key: string;
  category: string;
}

const shortcuts: ShortcutItem[] = [
  { action: 'Command Palette', key: 'Ctrl+Shift+P', category: 'General' },
  { action: 'Global Search', key: 'Ctrl+Shift+F', category: 'Search' },
  { action: 'Keyboard Shortcuts', key: 'Ctrl+Shift+?', category: 'General' },
  { action: 'New File', key: 'Ctrl+N', category: 'File' },
  { action: 'Save File', key: 'Ctrl+S', category: 'File' },
  { action: 'Run Code', key: 'Ctrl+Shift+Enter', category: 'Editor' },
  { action: 'Toggle Theme', key: 'Ctrl+Shift+T', category: 'View' },
  { action: 'Toggle Terminal', key: 'Ctrl+`', category: 'View' },
  { action: 'Toggle Sidebar', key: 'Ctrl+B', category: 'View' },
  { action: 'Zen Mode', key: 'Ctrl+K Z', category: 'View' },
  { action: 'Settings', key: 'Ctrl+,', category: 'Preferences' },
];

export default function ShortcutHelp({ isOpen, onClose }: ShortcutHelpProps) {
  const groupedShortcuts = shortcuts.reduce((acc, shortcut) => {
    if (!acc[shortcut.category]) {
      acc[shortcut.category] = [];
    }
    acc[shortcut.category].push(shortcut);
    return acc;
  }, {} as Record<string, ShortcutItem[]>);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    
    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }
    
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={onClose}>
      <div 
        className="w-full max-w-2xl max-h-[80vh] bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl shadow-2xl overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2">
            <Command className="w-5 h-5 text-[var(--accent-blue)]" />
            <h2 className="text-lg font-semibold text-[var(--text-primary)]">Keyboard Shortcuts</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-1 rounded hover:bg-[var(--bg-tertiary)] transition-colors"
          >
            <X className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>
        </div>
        
        <div className="flex-1 overflow-y-auto p-6">
          {Object.entries(groupedShortcuts).map(([category, items]) => (
            <div key={category} className="mb-6 last:mb-0">
              <h3 className="text-sm font-semibold text-[var(--accent-blue)] mb-3 uppercase tracking-wider">
                {category}
              </h3>
              <div className="space-y-2">
                {items.map((shortcut, idx) => (
                  <div key={idx} className="flex items-center justify-between py-1">
                    <span className="text-sm text-[var(--text-primary)]">{shortcut.action}</span>
                    <div className="flex gap-1">
                      {shortcut.key.split('+').map((part, partIdx) => (
                        <kbd key={partIdx} className="px-2 py-1 text-xs bg-[var(--bg-tertiary)] border border-[var(--border-color)] rounded text-[var(--text-secondary)] font-mono">
                          {part}
                        </kbd>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
        
        <div className="px-6 py-3 border-t border-[var(--border-color)] bg-[var(--bg-tertiary)] text-xs text-[var(--text-secondary)]">
          Press <kbd className="px-1.5 py-0.5 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded mx-1">Esc</kbd> to close
        </div>
      </div>
    </div>
  );
}
