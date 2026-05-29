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
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!isMobile) {
      setSidebarOpen(false);
    }
  }, [isMobile]);

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
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
        e.preventDefault();
        setSidebarOpen(prev => !prev);
      }
    };

    const handleSidebarClose = () => {
      setSidebarOpen(false);
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('sidebarClose', handleSidebarClose);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('sidebarClose', handleSidebarClose);
    };
  }, [createFile, openFile, isMobile]);

  return (
    <div className={`h-screen w-screen flex flex-col overflow-hidden ${theme}`}>
      <div className="absolute inset-0 noise-bg pointer-events-none" />
      
      <TitleBar onToggleSidebar={() => setSidebarOpen(prev => !prev)} isMobile={isMobile} />
      
      <div className="flex-1 flex overflow-hidden relative">
        {isMobile && sidebarOpen && (
          <div 
            className="absolute inset-0 bg-black/50 z-40" 
            onClick={() => setSidebarOpen(false)}
          />
        )}
        
        <div className={`
          transition-transform duration-200 
          ${isMobile 
            ? `absolute inset-y-0 left-0 z-50 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} w-64` 
            : 'relative translate-x-0'
          }
        `}>
          <Sidebar />
        </div>
        
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
