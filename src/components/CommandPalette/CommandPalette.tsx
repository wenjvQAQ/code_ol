import { useState, useEffect, useRef } from 'react';
import { Search, Command, FileText, FolderPlus, Moon, Sun, Terminal } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';
import { useFileStore } from '@/stores/fileStore';
import { useEditorStore } from '@/stores/editorStore';
import { useTerminalStore } from '@/stores/terminalStore';
import { FileTab } from '@/types';

interface CommandItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  action: () => void;
  shortcut?: string;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
  onToggleTerminal?: () => void;
}

export default function CommandPalette({ isOpen, onClose, onToggleTerminal }: CommandPaletteProps) {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { theme, toggleTheme } = useThemeStore();
  const { createFile } = useFileStore();
  const { openFile } = useEditorStore();
  const { clearTerminal } = useTerminalStore();

  const commands: CommandItem[] = [
    {
      id: 'new-file',
      label: 'New File',
      icon: <FileText className="w-4 h-4" />,
      action: () => {
        const name = prompt('Enter file name:', 'untitled.txt');
        if (name) {
          const fileId = createFile(name);
          const file = useFileStore.getState().getFile(fileId);
          if (file) {
            openFile({
              id: file.id,
              name: file.name,
              language: file.language || 'plaintext',
              isDirty: false,
            });
          }
        }
      },
      shortcut: 'Ctrl+N',
    },
    {
      id: 'new-folder',
      label: 'New Folder',
      icon: <FolderPlus className="w-4 h-4" />,
      action: () => {
        const name = prompt('Enter folder name:', 'new-folder');
        if (name) {
          createFile(name);
        }
      },
    },
    {
      id: 'toggle-theme',
      label: `Switch to ${theme === 'dark' ? 'Light' : 'Dark'} Theme`,
      icon: theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />,
      action: toggleTheme,
      shortcut: 'Ctrl+Shift+T',
    },
    {
      id: 'toggle-terminal',
      label: 'Toggle Terminal',
      icon: <Terminal className="w-4 h-4" />,
      action: () => onToggleTerminal?.(),
      shortcut: 'Ctrl+J',
    },
    {
      id: 'clear-terminal',
      label: 'Clear Terminal',
      icon: <Terminal className="w-4 h-4" />,
      action: clearTerminal,
    },
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.label.toLowerCase().includes(query.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.min(prev + 1, filteredCommands.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredCommands[selectedIndex]) {
        filteredCommands[selectedIndex].action();
        onClose();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-20 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-xl bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border-color)]">
          <Search className="w-5 h-5 text-[var(--text-secondary)]" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a command..."
            className="flex-1 bg-transparent outline-none text-[var(--text-primary)] placeholder-[var(--text-secondary)]"
          />
          <span className="text-xs text-[var(--text-secondary)] bg-[var(--bg-tertiary)] px-2 py-0.5 rounded">
            Esc
          </span>
        </div>

        <div className="max-h-80 overflow-y-auto py-2">
          {filteredCommands.length === 0 ? (
            <div className="px-4 py-8 text-center text-[var(--text-secondary)]">
              No commands found
            </div>
          ) : (
            filteredCommands.map((cmd, index) => (
              <div
                key={cmd.id}
                className={`flex items-center justify-between px-4 py-2 cursor-pointer transition-colors ${
                  index === selectedIndex
                    ? 'bg-[var(--accent-blue)] text-white'
                    : 'hover:bg-[var(--bg-tertiary)] text-[var(--text-primary)]'
                }`}
                onClick={() => {
                  cmd.action();
                  onClose();
                }}
                onMouseEnter={() => setSelectedIndex(index)}
              >
                <div className="flex items-center gap-3">
                  {cmd.icon}
                  <span className="text-sm">{cmd.label}</span>
                </div>
                {cmd.shortcut && (
                  <span className={`text-xs ${index === selectedIndex ? 'opacity-80' : 'text-[var(--text-secondary)]'}`}>
                    {cmd.shortcut}
                  </span>
                )}
              </div>
            ))
          )}
        </div>

        <div className="px-4 py-2 border-t border-[var(--border-color)] bg-[var(--bg-tertiary)] flex items-center gap-4 text-xs text-[var(--text-secondary)]">
          <span className="flex items-center gap-1">
            <Command className="w-3 h-3" />
            to select
          </span>
          <span>↑↓ to navigate</span>
          <span>Enter to run</span>
        </div>
      </div>
    </div>
  );
}
