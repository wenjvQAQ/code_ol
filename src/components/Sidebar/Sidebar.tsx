import { Files, Search, GitBranch, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import FileTree from './FileTree';

type View = 'files' | 'search' | 'git';

export default function Sidebar() {
  const [activeView, setActiveView] = useState<View>('files');
  const [collapsed, setCollapsed] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return (
    <div 
      className={`flex flex-col bg-[var(--bg-secondary)] border-r border-[var(--border-color)] transition-all duration-200 h-full ${
        collapsed ? 'w-12' : 'w-64'
      }`}
    >
      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="flex items-center justify-between py-2 px-2 border-b border-[var(--border-color)]">
          <div className="flex items-center justify-around flex-1">
            <button
              onClick={() => setActiveView('files')}
              className={`p-2 rounded transition-colors ${
                activeView === 'files' 
                  ? 'bg-[var(--bg-tertiary)] text-[var(--accent-blue)]' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              title="Explorer"
            >
              <Files className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveView('search')}
              className={`p-2 rounded transition-colors ${
                activeView === 'search' 
                  ? 'bg-[var(--bg-tertiary)] text-[var(--accent-blue)]' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              title="Search"
            >
              <Search className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveView('git')}
              className={`p-2 rounded transition-colors ${
                activeView === 'git' 
                  ? 'bg-[var(--bg-tertiary)] text-[var(--accent-green)]' 
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
              title="Git"
            >
              <GitBranch className="w-5 h-5" />
            </button>
          </div>
          {isMobile && (
            <button
              onClick={() => {
                const event = new CustomEvent('sidebarClose');
                window.dispatchEvent(event);
              }}
              className="p-1.5 rounded hover:bg-[var(--bg-tertiary)] transition-colors ml-2"
              title="Close Sidebar"
            >
              <X className="w-4 h-4 text-[var(--text-secondary)]" />
            </button>
          )}
        </div>

        {!collapsed && (
          <div className="flex-1 overflow-y-auto">
            {activeView === 'files' && <FileTree />}
            {activeView === 'search' && (
              <div className="p-4 text-center text-sm text-[var(--text-secondary)]">
                Search coming soon...
              </div>
            )}
            {activeView === 'git' && (
              <div className="p-4 text-center text-sm text-[var(--text-secondary)]">
                Git integration coming soon...
              </div>
            )}
          </div>
        )}
      </div>

      {!isMobile && (
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center justify-center h-8 bg-[var(--bg-secondary)] border-t border-[var(--border-color)] hover:bg-[var(--bg-tertiary)] transition-colors"
        >
          {collapsed ? (
            <ChevronRight className="w-4 h-4 text-[var(--text-secondary)]" />
          ) : (
            <ChevronLeft className="w-4 h-4 text-[var(--text-secondary)]" />
          )}
        </button>
      )}
    </div>
  );
}
