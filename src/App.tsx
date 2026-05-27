import { useState, useEffect } from 'react';
import TitleBar from '@/components/TitleBar/TitleBar';
import Sidebar from '@/components/Sidebar/Sidebar';
import EditorArea from '@/components/Editor/EditorArea';
import StatusBar from '@/components/StatusBar/StatusBar';
import CommandPalette from '@/components/CommandPalette/CommandPalette';
import BottomPanel from '@/components/BottomPanel/BottomPanel';
import { useThemeStore } from '@/stores/themeStore';
import { useFileStore } from '@/stores/fileStore';
import { useEditorStore } from '@/stores/editorStore';
import { FileTab } from '@/types';

export default function App() {
  const { theme } = useThemeStore();
  const { createFile } = useFileStore();
  const { openFile } = useEditorStore();
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [terminalVisible, setTerminalVisible] = useState(true);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'p') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'n') {
        e.preventDefault();
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
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'j') {
        e.preventDefault();
        setTerminalVisible((prev) => !prev);
      } else if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        console.log('File saved');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [createFile, openFile]);

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden ${theme}`}>
      <div className="absolute inset-0 noise-bg pointer-events-none" />
      
      <TitleBar />
      
      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar />
        <div className="flex-1 flex flex-col overflow-hidden">
          <EditorArea />
          <BottomPanel 
            isVisible={terminalVisible} 
            onToggle={() => setTerminalVisible(false)} 
          />
        </div>
      </div>
      
      <StatusBar />
      
      <CommandPalette 
        isOpen={commandPaletteOpen}
        onClose={() => setCommandPaletteOpen(false)}
        onToggleTerminal={() => setTerminalVisible((prev) => !prev)}
      />
    </div>
  );
}
