import { Files, Search, GitBranch, ChevronLeft, ChevronRight } from 'lucide-react';
import { useState } from 'react';
import FileTree from './FileTree';

type View = 'files' | 'search' | 'git';

export default function Sidebar() {
  const [activeView, setActiveView] = useState<View>('files');
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div 
      className={`flex bg-[var(--bg-secondary)] border-r border-[var(--border-color)] transition-all duration-200 ${
        collapsed ? 'w-12' : 'w-64'
      }`}
    >
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-around py-2 border-b border-[var(--border-color)]">
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

      <button
        onClick={() => setCollapsed(!collapsed)}
        className="hidden md:flex items-center justify-center w-6 bg-[var(--bg-secondary)] border-l border-[var(--border-color)] hover:bg-[var(--bg-tertiary)] transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="w-4 h-4 text-[var(--text-secondary)]" />
        ) : (
          <ChevronLeft className="w-4 h-4 text-[var(--text-secondary)]" />
        )}
      </button>
    </div>
  );
}
