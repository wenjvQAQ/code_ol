import { useState, useEffect } from 'react';
import { Terminal, AlertCircle, FileText, Minus, Square, X } from 'lucide-react';
import TerminalComponent from '@/components/Terminal/Terminal';

type Panel = 'terminal' | 'problems' | 'output';

interface BottomPanelProps {
  isVisible: boolean;
  onToggle: () => void;
}

export default function BottomPanel({ isVisible, onToggle }: BottomPanelProps) {
  const [activePanel, setActivePanel] = useState<Panel>('terminal');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!isVisible) return null;

  return (
    <div className={`bg-[var(--bg-secondary)] border-t border-[var(--border-color)] flex flex-col ${isMobile ? 'h-40' : 'h-48'}`}>
      <div className="flex items-center justify-between border-b border-[var(--border-color)]">
        <div className="flex">
          {(['terminal', 'problems', 'output'] as Panel[]).map((panel) => (
            <button
              key={panel}
              onClick={() => setActivePanel(panel)}
              className={`px-3 py-2 text-sm flex items-center gap-1.5 transition-colors ${
                activePanel === panel
                  ? 'text-[var(--text-primary)] border-b-2 border-[var(--accent-blue)]'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              {panel === 'terminal' && <Terminal className="w-4 h-4" />}
              {panel === 'problems' && <AlertCircle className="w-4 h-4" />}
              {panel === 'output' && <FileText className="w-4 h-4" />}
              {!isMobile && <span className="capitalize">{panel}</span>}
            </button>
          ))}
        </div>

        <div className="flex items-center px-2">
          <button
            onClick={onToggle}
            className="p-1.5 hover:bg-[var(--bg-tertiary)] rounded transition-colors"
            title="Close Panel"
          >
            <Minus className="w-4 h-4 text-[var(--text-secondary)]" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-hidden">
        {activePanel === 'terminal' && <TerminalComponent />}
        {activePanel === 'problems' && (
          <div className="h-full flex items-center justify-center text-[var(--text-secondary)]">
            No problems detected
          </div>
        )}
        {activePanel === 'output' && (
          <div className="h-full flex items-center justify-center text-[var(--text-secondary)]">
            Output panel - Coming soon
          </div>
        )}
      </div>
    </div>
  );
}
