import { useState } from 'react';
import { X, Save, ArrowLeft, ArrowRight, Copy } from 'lucide-react';

interface DiffViewerProps {
  oldContent: string;
  newContent: string;
  fileName: string;
  onClose: () => void;
  onApply?: () => void;
}

type Line = {
  type: 'added' | 'removed' | 'unchanged';
  content: string;
  lineNumber: number;
};

export default function DiffViewer({ oldContent, newContent, fileName, onClose, onApply }: DiffViewerProps) {
  const [viewMode, setViewMode] = useState<'split' | 'unified'>('split');

  const computeDiff = (oldStr: string, newStr: string): Line[] => {
    const oldLines = oldStr.split('\n');
    const newLines = newStr.split('\n');
    const lines: Line[] = [];
    
    const maxLen = Math.max(oldLines.length, newLines.length);
    
    for (let i = 0; i < maxLen; i++) {
      const oldLine = oldLines[i];
      const newLine = newLines[i];
      
      if (oldLine === undefined) {
        lines.push({ type: 'added', content: newLine, lineNumber: i + 1 });
      } else if (newLine === undefined) {
        lines.push({ type: 'removed', content: oldLine, lineNumber: i + 1 });
      } else if (oldLine === newLine) {
        lines.push({ type: 'unchanged', content: oldLine, lineNumber: i + 1 });
      } else {
        lines.push({ type: 'removed', content: oldLine, lineNumber: i + 1 });
        lines.push({ type: 'added', content: newLine, lineNumber: i + 1 });
      }
    }
    
    return lines;
  };

  const diffLines = computeDiff(oldContent, newContent);
  const oldLines = oldContent.split('\n');
  const newLines = newContent.split('\n');

  const hasChanges = oldContent !== newContent;

  return (
    <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
      <div className="bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-xl shadow-2xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-3">
            <div>
              <h3 className="font-semibold text-[var(--text-primary)]">{fileName}</h3>
              <p className="text-xs text-[var(--text-secondary)]">
                {hasChanges ? `${diffLines.filter(l => l.type !== 'unchanged').length} changes` : 'No changes'}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex bg-[var(--bg-secondary)] rounded-lg overflow-hidden border border-[var(--border-color)]">
              <button
                onClick={() => setViewMode('split')}
                className={`px-3 py-1.5 text-xs transition-colors ${
                  viewMode === 'split'
                    ? 'bg-[var(--accent-blue)] text-white'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Split
              </button>
              <button
                onClick={() => setViewMode('unified')}
                className={`px-3 py-1.5 text-xs transition-colors ${
                  viewMode === 'unified'
                    ? 'bg-[var(--accent-blue)] text-white'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                Unified
              </button>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[var(--bg-tertiary)] rounded transition-colors"
              title="Close"
            >
              <X className="w-4 h-4 text-[var(--text-secondary)]" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col">
          {viewMode === 'split' ? (
            <div className="flex flex-1 overflow-hidden">
              <div className="flex-1 flex flex-col border-r border-[var(--border-color)]">
                <div className="px-4 py-2 bg-[var(--bg-tertiary)] border-b border-[var(--border-color)]">
                  <span className="text-xs font-medium text-[var(--text-secondary)]">Original</span>
                </div>
                <div className="flex-1 overflow-auto font-mono text-sm">
                  {oldLines.map((line, i) => (
                    <div key={i} className="flex">
                      <span className="w-12 text-right px-2 text-[var(--text-secondary)] select-none bg-[var(--bg-tertiary)]">
                        {i + 1}
                      </span>
                      <span className="flex-1 px-3">{line}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="flex-1 flex flex-col">
                <div className="px-4 py-2 bg-[var(--bg-tertiary)] border-b border-[var(--border-color)]">
                  <span className="text-xs font-medium text-[var(--text-secondary)]">Modified</span>
                </div>
                <div className="flex-1 overflow-auto font-mono text-sm">
                  {newLines.map((line, i) => {
                    const isAdded = !oldLines.includes(line);
                    const isRemoved = !newLines.includes(oldLines[i]);
                    let bgClass = '';
                    if (isAdded && oldLines[i] !== line) bgClass = 'bg-[var(--accent-green)]/20';
                    else if (isRemoved && oldLines[i] !== undefined) bgClass = 'bg-[var(--accent-red)]/20';
                    return (
                      <div key={i} className={`flex ${bgClass}`}>
                        <span className="w-12 text-right px-2 text-[var(--text-secondary)] select-none bg-[var(--bg-tertiary)]">
                          {i + 1}
                        </span>
                        <span className="flex-1 px-3">{line}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="flex-1 overflow-auto font-mono text-sm">
              {diffLines.map((line, i) => (
                <div
                  key={i}
                  className={`flex ${
                    line.type === 'added' ? 'bg-[var(--accent-green)]/20' :
                    line.type === 'removed' ? 'bg-[var(--accent-red)]/20' : ''
                  }`}
                >
                  <span className="w-12 text-right px-2 text-[var(--text-secondary)] select-none bg-[var(--bg-tertiary)]">
                    {line.lineNumber}
                  </span>
                  <span className="w-6 text-center text-[var(--text-secondary)] select-none">
                    {line.type === 'added' ? '+' : line.type === 'removed' ? '-' : ' '}
                  </span>
                  <span className="flex-1 px-2">{line.content}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 p-4 border-t border-[var(--border-color)]">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] rounded transition-colors"
          >
            Cancel
          </button>
          {hasChanges && onApply && (
            <button
              onClick={onApply}
              className="px-4 py-2 text-sm bg-[var(--accent-blue)] text-white rounded hover:bg-[var(--accent-blue)]/90 transition-colors flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              Apply Changes
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
