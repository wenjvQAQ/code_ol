import { create } from 'zustand';

export interface EditorSettings {
  fontSize: number;
  tabSize: number;
  wordWrap: 'on' | 'off' | 'wordWrapColumn' | 'bounded';
  minimap: boolean;
  lineNumbers: 'on' | 'off' | 'relative' | 'interval';
  autoSave: boolean;
  autoSaveDelay: number;
  formatOnPaste: boolean;
  formatOnType: boolean;
  cursorBlinking: 'blink' | 'smooth' | 'phase' | 'expand' | 'solid';
  cursorStyle: 'line' | 'block' | 'underline' | 'line-thin' | 'block-outline' | 'underline-thin';
  fontFamily: string;
  fontLigatures: boolean;
  smoothScrolling: boolean;
  mouseWheelZoom: boolean;
}

export interface UISettings {
  sidebarWidth: number;
  terminalHeight: number;
  showStatusBar: boolean;
  showTabBar: boolean;
  compactMode: boolean;
  animations: boolean;
}

export interface Settings {
  editor: EditorSettings;
  ui: UISettings;
}

const defaultSettings: Settings = {
  editor: {
    fontSize: 14,
    tabSize: 2,
    wordWrap: 'on',
    minimap: true,
    lineNumbers: 'on',
    autoSave: false,
    autoSaveDelay: 1000,
    formatOnPaste: false,
    formatOnType: false,
    cursorBlinking: 'blink',
    cursorStyle: 'line',
    fontFamily: 'JetBrains Mono, Consolas, Monaco, monospace',
    fontLigatures: true,
    smoothScrolling: true,
    mouseWheelZoom: false,
  },
  ui: {
    sidebarWidth: 256,
    terminalHeight: 192,
    showStatusBar: true,
    showTabBar: true,
    compactMode: false,
    animations: true,
  },
};

interface SettingsState extends Settings {
  updateEditorSettings: (settings: Partial<EditorSettings>) => void;
  updateUISettings: (settings: Partial<UISettings>) => void;
  resetSettings: () => void;
}

const loadSettings = (): Settings => {
  const saved = localStorage.getItem('cloud-code-settings');
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      return {
        editor: { ...defaultSettings.editor, ...parsed.editor },
        ui: { ...defaultSettings.ui, ...parsed.ui },
      };
    } catch {
      return defaultSettings;
    }
  }
  return defaultSettings;
};

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...loadSettings(),

  updateEditorSettings: (newSettings) => {
    set((state) => {
      const updated = {
        ...state,
        editor: { ...state.editor, ...newSettings },
      };
      localStorage.setItem('cloud-code-settings', JSON.stringify({
        editor: updated.editor,
        ui: updated.ui,
      }));
      return updated;
    });
  },

  updateUISettings: (newSettings) => {
    set((state) => {
      const updated = {
        ...state,
        ui: { ...state.ui, ...newSettings },
      };
      localStorage.setItem('cloud-code-settings', JSON.stringify({
        editor: updated.editor,
        ui: updated.ui,
      }));
      return updated;
    });
  },

  resetSettings: () => {
    localStorage.setItem('cloud-code-settings', JSON.stringify(defaultSettings));
    set(defaultSettings);
  },
}));
