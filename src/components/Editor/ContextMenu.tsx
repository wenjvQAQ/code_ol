import { useEffect, useRef } from 'react';
import { Copy, ClipboardPaste, Cut, Scissors, FileCode, Play, Settings, Terminal, FilePlus } from 'lucide-react';

interface ContextMenuProps {
  isOpen: boolean;
  position: { x: number; y: number };
  onClose: () => void;
  onRunCode?: () => void;
  onNewFile?: () => void;
  onOpenSettings?: () => void;
  onToggleTerminal?: () => void;
}

interface MenuItem {
  label: string;
  icon: React.ReactNode;
  action: () => void;
  divider?: boolean;
}

export default function ContextMenu({ 
  isOpen, position, onClose, onRunCode, onNewFile, onOpenSettings, onToggleTerminal 
}: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!menuRef.current) return;

    const rect = menuRef.current.getBoundingClientRect();
    if (position.x + rect.width > window.innerWidth) {
      menuRef.current.style.left = `${position.x - rect.width}px`;
    }
    if (position.y + rect.height > window.innerHeight) {
      menuRef.current.style.top = `${position.y - rect.height}px`;
    }

    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('click', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    
    return () => {
      document.removeEventListener('click', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  const handleCopy = async () => {
    try {
      const selection = window.getSelection();
      if (selection) {
        await navigator.clipboard.writeText(selection.toString());
      }
    } catch (err) {
      console.error('Failed to copy:', err);
    }
    onClose();
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      document.execCommand('insertText', false, text);
    } catch (err) {
      console.error('Failed to paste:', err);
    }
    onClose();
  };

  const handleCut = async () => {
    try {
      const selection = window.getSelection();
      if (selection) {
        await navigator.clipboard.writeText(selection.toString());
        document.execCommand('delete');
      }
    } catch (err) {
      console.error('Failed to cut:', err);
    }
    onClose();
  };

  const items: MenuItem[] = [
    { label: 'Cut', icon: <Scissors className="w-4 h-4" />, action: handleCut },
    { label: 'Copy', icon: <Copy className="w-4 h-4" />, action: handleCopy },
    { label: 'Paste', icon: <ClipboardPaste className="w-4 h-4" />, action: handlePaste },
    { label: '', icon: <></>, action: onClose, divider: true },
    { label: 'Run Code', icon: <Play className="w-4 h-4" />, action: () => { onRunCode?.(); onClose(); } },
    { label: '', icon: <></>, action: onClose, divider: true },
    { label: 'New File', icon: <FilePlus className="w-4 h-4" />, action: () => { onNewFile?.(); onClose(); } },
    { label: 'Toggle Terminal', icon: <Terminal className="w-4 h-4" />, action: () => { onToggleTerminal?.(); onClose(); } },
    { label: 'Settings', icon: <Settings className="w-4 h-4" />, action: () => { onOpenSettings?.(); onClose(); } },
  ];

  if (!isOpen) return null;

  return (
    <div 
      ref={menuRef}
      style={{ left: position.x, top: position.y }}
      className="fixed z-50 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-lg shadow-xl py-1 min-w-[180px]"
    >
      {items.map((item, idx) => 
        item.divider ? (
          <div key={idx} className="border-t border-[var(--border-color)] my-1" />
        ) : (
          <button
            key={idx}
            className="w-full flex items-center gap-3 px-3 py-1.5 text-sm text-[var(--text-primary)] hover:bg-[var(--bg-tertiary)] transition-colors text-left"
            onClick={item.action}
          >
            <span className="w-4 text-[var(--text-secondary)]">{item.icon}</span>
            <span>{item.label}</span>
          </button>
        )
      )}
    </div>
  );
}
