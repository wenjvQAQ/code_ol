import { useState } from 'react';
import { Menu, Sun, Moon, Settings, Plus, Play } from 'lucide-react';
import { useThemeStore } from '@/stores/themeStore';
import { useEditorStore } from '@/stores/editorStore';
import { useFileStore } from '@/stores/fileStore';
import { useTerminalStore } from '@/stores/terminalStore';
import { runCode } from '@/lib/codeRunner';
import NewFileModal from '@/components/Modal/NewFileModal';
import SettingsModal from '@/components/Modal/SettingsModal';

interface TitleBarProps {
  onToggleSidebar: () => void;
  isMobile: boolean;
}

export default function TitleBar({ onToggleSidebar, isMobile }: TitleBarProps) {
  const { theme, toggleTheme } = useThemeStore();
  const { activeFileId } = useEditorStore();
  const { files } = useFileStore();
  const { addLine, appendOutput, appendError, clearTerminal } = useTerminalStore();
  const [showNewFileModal, setShowNewFileModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isRunning, setIsRunning] = useState(false);

  const getLanguageFromFilename = (filename: string): string => {
    const ext = filename.split('.').pop()?.toLowerCase() || '';
    const langMap: Record<string, string> = {
      js: 'javascript',
      ts: 'typescript',
      tsx: 'typescript',
      jsx: 'javascript',
      py: 'python',
      c: 'c',
      cpp: 'cpp',
      cc: 'cpp',
      html: 'html',
      htm: 'html',
      css: 'css',
    };
    return langMap[ext] || 'javascript';
  };

  const handleRun = async () => {
    if (!activeFileId) {
      addLine({ type: 'error', content: 'No active file to run' });
      return;
    }
    
    const file = files.find(f => f.id === activeFileId);
    if (!file) {
      addLine({ type: 'error', content: 'File not found' });
      return;
    }

    if (isRunning) {
      addLine({ type: 'output', content: 'Code is already running...' });
      return;
    }

    setIsRunning(true);
    clearTerminal();
    
    const language = getLanguageFromFilename(file.name);
    addLine({ type: 'input', content: `Running ${file.name}...` });
    addLine({ type: 'output', content: `Language: ${language}` });
    addLine({ type: 'output', content: '────────────────────────────' });

    try {
      const result = await runCode(file.content, language as any);
      
      if (result.output) {
        appendOutput(result.output);
      }
      
      if (result.error) {
        appendError(result.error);
      }

      addLine({ type: 'output', content: '────────────────────────────' });
      addLine({ 
        type: result.success ? 'output' : 'error', 
        content: `${result.success ? '✓' : '✗'} Execution ${result.success ? 'finished' : 'failed'} in ${result.executionTime}ms` 
      });
    } catch (error) {
      appendError(error instanceof Error ? error.message : String(error));
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="h-10 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] flex items-center justify-between px-3 select-none">
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded-md hover:bg-[var(--bg-tertiary)] transition-colors"
          title="Toggle Sidebar"
        >
          <Menu className="w-5 h-5 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors" />
        </button>
        <span className="font-semibold text-sm text-[var(--text-primary)]">
          云端代码工作室
        </span>
      </div>
      
      <div className="flex items-center gap-1">
        <button
          onClick={handleRun}
          disabled={isRunning}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
            isRunning 
              ? 'bg-[var(--accent-orange)] text-white cursor-wait' 
              : 'bg-[var(--accent-green)] text-white hover:bg-[var(--accent-green)]/90'
          }`}
        >
          <Play className="w-4 h-4" />
          {!isMobile && (isRunning ? '运行中...' : '运行')}
        </button>
        <button
          onClick={() => setShowNewFileModal(true)}
          className="flex items-center gap-1 px-3 py-1.5 bg-[var(--accent-blue)] text-white rounded-md text-sm font-medium hover:bg-[var(--accent-blue)]/90 transition-colors"
        >
          {!isMobile && <Plus className="w-4 h-4" />}
          {isMobile ? '新建' : '新建文件'}
        </button>
        <button
          onClick={toggleTheme}
          className="p-1.5 rounded-md hover:bg-[var(--bg-tertiary)] transition-colors"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-[var(--accent-orange)]" />
          ) : (
            <Moon className="w-4 h-4 text-[var(--accent-purple)]" />
          )}
        </button>
        <button
          onClick={() => setShowSettings(true)}
          className="p-1.5 rounded-md hover:bg-[var(--bg-tertiary)] transition-colors"
          title="Settings"
        >
          <Settings className="w-4 h-4 text-[var(--text-secondary)] hover:text-[var(--text-primary)]" />
        </button>
      </div>

      <NewFileModal
        isOpen={showNewFileModal}
        onClose={() => setShowNewFileModal(false)}
      />
      
      <SettingsModal
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />
    </div>
  );
}
