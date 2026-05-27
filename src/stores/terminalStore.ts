import { create } from 'zustand';
import { TerminalLine } from '@/types';

interface TerminalState {
  lines: TerminalLine[];
  currentInput: string;
  history: string[];
  historyIndex: number;
  addLine: (line: Omit<TerminalLine, 'id' | 'timestamp'>) => void;
  setInput: (input: string) => void;
  executeCommand: (command: string) => void;
  clearTerminal: () => void;
  setHistoryIndex: (index: number) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

const executeBuiltinCommand = (command: string): string => {
  const [cmd, ...args] = command.trim().split(/\s+/);
  
  switch (cmd.toLowerCase()) {
    case '':
      return '';
    case 'help':
      return `Available commands:
  help     - Show this help message
  clear    - Clear the terminal
  echo     - Print text to terminal
  date     - Show current date and time
  whoami   - Show current user
  pwd      - Print working directory
  ls       - List files
  cat      - Display file content (usage: cat <filename>)
  mkdir    - Create a directory (usage: mkdir <dirname>)
  rm       - Remove a file (usage: rm <filename>)
  version  - Show version info`;
    case 'clear':
      return '__CLEAR__';
    case 'echo':
      return args.join(' ');
    case 'date':
      return new Date().toString();
    case 'whoami':
      return 'guest@cloud-studio';
    case 'pwd':
      return '/workspace';
    case 'ls':
      return 'src/\nREADME.md';
    case 'version':
      return 'Cloud Code Studio v1.0.0';
    case 'cat':
      if (args.length === 0) {
        return 'cat: missing file operand';
      }
      return `Content of ${args[0]}:\n(Lorem ipsum content placeholder)`;
    case 'mkdir':
      if (args.length === 0) {
        return 'mkdir: missing directory name';
      }
      return `Directory '${args[0]}' created`;
    case 'rm':
      if (args.length === 0) {
        return 'rm: missing file operand';
      }
      return `File '${args[0]}' removed`;
    default:
      return `${cmd}: command not found`;
  }
};

const getInitialLines = (): TerminalLine[] => [
  {
    id: generateId(),
    type: 'output',
    content: 'Welcome to Cloud Code Studio Terminal',
    timestamp: Date.now(),
  },
  {
    id: generateId(),
    type: 'output',
    content: 'Type "help" for available commands',
    timestamp: Date.now(),
  },
];

export const useTerminalStore = create<TerminalState>((set, get) => ({
  lines: getInitialLines(),
  currentInput: '',
  history: JSON.parse(localStorage.getItem('cloud-code-terminal-history') || '[]'),
  historyIndex: -1,

  addLine: (line) => {
    set((state) => ({
      lines: [...state.lines, { ...line, id: generateId(), timestamp: Date.now() }],
    }));
  },

  setInput: (input) => {
    set({ currentInput: input, historyIndex: -1 });
  },

  executeCommand: (command) => {
    const { addLine, history } = get();
    
    addLine({ type: 'input', content: command });
    
    const output = executeBuiltinCommand(command);
    
    if (output === '__CLEAR__') {
      set({ lines: [], currentInput: '' });
    } else if (output) {
      const isError = output.includes('not found') || output.includes('missing');
      addLine({ 
        type: isError ? 'error' : 'output', 
        content: output 
      });
    }
    
    if (command.trim()) {
      const newHistory = [command, ...history.filter(h => h !== command)].slice(0, 50);
      localStorage.setItem('cloud-code-terminal-history', JSON.stringify(newHistory));
      set({ history: newHistory, currentInput: '' });
    } else {
      set({ currentInput: '' });
    }
  },

  clearTerminal: () => {
    set({ lines: [] });
  },

  setHistoryIndex: (index) => {
    const { history } = get();
    if (index >= 0 && index < history.length) {
      set({ historyIndex: index, currentInput: history[index] });
    } else if (index < 0) {
      set({ historyIndex: -1, currentInput: '' });
    }
  },
}));
