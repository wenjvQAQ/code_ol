import { useEffect, useRef, useState } from 'react';
import { Terminal as XTerminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import { useTerminalStore } from '@/stores/terminalStore';
import '@xterm/xterm/css/xterm.css';

export default function Terminal() {
  const terminalRef = useRef<HTMLDivElement>(null);
  const xtermRef = useRef<XTerminal | null>(null);
  const fitAddonRef = useRef<FitAddon | null>(null);
  const { lines, executeCommand, setHistoryIndex, history } = useTerminalStore();
  const [inputValue, setInputValue] = useState('');

  useEffect(() => {
    if (!terminalRef.current || xtermRef.current) return;

    const terminal = new XTerminal({
      cursorBlink: true,
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 13,
      theme: {
        background: '#0d1117',
        foreground: '#c9d1d9',
        cursor: '#58a6ff',
        black: '#0d1117',
        brightBlack: '#6e7681',
        red: '#f85149',
        brightRed: '#ff7b72',
        green: '#3fb950',
        brightGreen: '#56d364',
        yellow: '#f0883e',
        brightYellow: '#e3b341',
        blue: '#58a6ff',
        brightBlue: '#79c0ff',
        magenta: '#bc8cff',
        brightMagenta: '#d2a8ff',
        cyan: '#39c5cf',
        brightCyan: '#56d4dd',
        white: '#c9d1d9',
        brightWhite: '#ffffff',
      },
      scrollback: 1000,
    });

    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    
    terminal.open(terminalRef.current);
    fitAddon.fit();

    xtermRef.current = terminal;
    fitAddonRef.current = fitAddon;

    const handleResize = () => {
      if (fitAddonRef.current) {
        fitAddonRef.current.fit();
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      terminal.dispose();
      xtermRef.current = null;
    };
  }, []);

  useEffect(() => {
    if (!xtermRef.current) return;

    const terminal = xtermRef.current;
    terminal.clear();

    lines.forEach((line) => {
      const color = line.type === 'input' ? '\x1b[36m' : 
                    line.type === 'error' ? '\x1b[31m' : '\x1b[37m';
      terminal.writeln(`${color}${line.content}\x1b[0m`);
    });

    terminal.writeln('\x1b[90m─────────────────────────────────\x1b[0m');
    terminal.write('\x1b[32m❯ \x1b[0m');
  }, [lines]);

  useEffect(() => {
    if (fitAddonRef.current) {
      fitAddonRef.current.fit();
    }
  }, [lines]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      executeCommand(inputValue);
      setInputValue('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const newIndex = useTerminalStore.getState().historyIndex + 1;
      setHistoryIndex(newIndex);
      if (history[newIndex] !== undefined) {
        setInputValue(history[newIndex]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const newIndex = useTerminalStore.getState().historyIndex - 1;
      setHistoryIndex(newIndex);
      if (newIndex < 0) {
        setInputValue('');
      } else if (history[newIndex] !== undefined) {
        setInputValue(history[newIndex]);
      }
    }
  };

  return (
    <div className="h-full flex flex-col bg-[var(--bg-primary)]">
      <div className="flex-1 overflow-hidden" ref={terminalRef} />
      <div className="flex items-center px-3 py-2 border-t border-[var(--border-color)] bg-[var(--bg-secondary)]">
        <span className="text-[var(--accent-green)] mr-2">❯</span>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-1 bg-transparent outline-none text-[var(--text-primary)] font-mono text-sm"
          placeholder="Type a command..."
          autoFocus
        />
      </div>
    </div>
  );
}
