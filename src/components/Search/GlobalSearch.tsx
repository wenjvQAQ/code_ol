import { useState, useEffect, useRef } from 'react';
import { Search, X, FileText, ChevronRight, Replace, ReplaceAll } from 'lucide-react';
import { useFileStore } from '@/stores/fileStore';
import { useEditorStore } from '@/stores/editorStore';

interface SearchMatch {
  fileId: string;
  fileName: string;
  matches: { line: number; content: string; start: number; end: number }[];
}

interface GlobalSearchProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function GlobalSearch({ isOpen, onClose }: GlobalSearchProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [replaceQuery, setReplaceQuery] = useState('');
  const [showReplace, setShowReplace] = useState(false);
  const [results, setResults] = useState<SearchMatch[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { files, updateFileContent } = useFileStore();
  const { openFile } = useEditorStore();

  useEffect(() => {
    if (isOpen) {
      setSearchQuery('');
      setReplaceQuery('');
      setResults([]);
      setTimeout(() => searchInputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    const matches: SearchMatch[] = [];
    const regex = new RegExp(searchQuery, 'gi');

    files.filter(f => !f.isFolder).forEach(file => {
      const fileMatches: SearchMatch['matches'] = [];
      const lines = file.content.split('\n');
      
      lines.forEach((line, idx) => {
        let match;
        while ((match = regex.exec(line)) !== null) {
          fileMatches.push({
            line: idx + 1,
            content: line.trim(),
            start: match.index,
            end: match.index + searchQuery.length
          });
        }
      });

      if (fileMatches.length > 0) {
        matches.push({
          fileId: file.id,
          fileName: file.name,
          matches: fileMatches
        });
      }
    });

    setResults(matches);
  }, [searchQuery, files]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [results]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onClose();
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, 0));
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault();
      const firstMatch = results[selectedIndex].matches[0];
      openFile({
        id: results[selectedIndex].fileId,
        name: results[selectedIndex].fileName,
        language: 'plaintext',
        isDirty: false
      });
      onClose();
    }
  };

  const handleReplaceOne = (fileId: string, matchIndex: number) => {
    const file = files.find(f => f.id === fileId);
    if (!file) return;

    const result = results.find(r => r.fileId === fileId);
    if (!result || !result.matches[matchIndex]) return;

    const match = result.matches[matchIndex];
    const lines = file.content.split('\n');
    
    if (lines[match.line - 1]) {
      const line = lines[match.line - 1];
      const newLine = line.substring(0, match.start) + replaceQuery + line.substring(match.end);
      lines[match.line - 1] = newLine;
      updateFileContent(fileId, lines.join('\n'));
    }
  };

  const handleReplaceAll = () => {
    results.forEach(result => {
      const file = files.find(f => f.id === result.fileId);
      if (!file) return;
      
      const regex = new RegExp(searchQuery, 'g');
      const newContent = file.content.replace(regex, replaceQuery);
      updateFileContent(result.fileId, newContent);
    });
  };

  if (!isOpen) return null;

  const totalMatches = results.reduce((sum, r) => sum + r.matches.length, 0);

  return (
    <div 
      className="fixed inset-0 z-50 flex items-start justify-center pt-12 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-3xl bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={handleKeyDown}
      >
        <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border-color)]">
          <Search className="w-5 h-5 text-[var(--text-secondary)]" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search in all files..."
            className="flex-1 bg-transparent outline-none text-[var(--text-primary)] placeholder-[var(--text-secondary)]"
          />
          <button 
            onClick={() => setShowReplace(!showReplace)}
            className="p-1 rounded hover:bg-[var(--bg-tertiary)] transition-colors text-[var(--text-secondary)]"
          >
            <Replace className="w-4 h-4" />
          </button>
          <button 
            onClick={onClose}
            className="p-1 rounded hover:bg-[var(--bg-tertiary)] transition-colors"
          >
            <X className="w-5 h-5 text-[var(--text-secondary)]" />
          </button>
        </div>

        {showReplace && (
          <div className="flex items-center gap-3 px-4 py-3 border-b border-[var(--border-color)] bg-[var(--bg-tertiary)]">
            <Replace className="w-5 h-5 text-[var(--text-secondary)]" />
            <input
              type="text"
              value={replaceQuery}
              onChange={(e) => setReplaceQuery(e.target.value)}
              placeholder="Replace with..."
              className="flex-1 bg-transparent outline-none text-[var(--text-primary)] placeholder-[var(--text-secondary)]"
            />
            {totalMatches > 0 && (
              <button
                onClick={handleReplaceAll}
                className="flex items-center gap-1 px-3 py-1 bg-[var(--accent-blue)] text-white rounded text-sm hover:bg-[var(--accent-blue)]/90"
              >
                <ReplaceAll className="w-3 h-3" />
                Replace All
              </button>
            )}
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {searchQuery.trim() === '' ? (
            <div className="p-8 text-center text-[var(--text-secondary)]">
              Type to search in all files
            </div>
          ) : results.length === 0 ? (
            <div className="p-8 text-center text-[var(--text-secondary)]">
              No matches found for "{searchQuery}"
            </div>
          ) : (
            <div className="divide-y divide-[var(--border-color)]">
              {results.map((result, idx) => (
                <div key={result.fileId} className={`${idx === selectedIndex ? 'bg-[var(--bg-tertiary)]' : ''}`}>
                  <div className="flex items-center gap-2 px-4 py-2 cursor-pointer hover:bg-[var(--bg-tertiary)]"
                    onClick={() => {
                      openFile({
                        id: result.fileId,
                        name: result.fileName,
                        language: 'plaintext',
                        isDirty: false
                      });
                      onClose();
                    }}
                  >
                    <FileText className="w-4 h-4 text-[var(--accent-blue)]" />
                    <span className="text-sm font-medium text-[var(--text-primary)]">{result.fileName}</span>
                    <span className="text-xs text-[var(--text-secondary)] ml-auto">{result.matches.length} match{result.matches.length > 1 ? 'es' : ''}</span>
                  </div>
                  
                  <div className="pl-10 pr-4 pb-2 space-y-1">
                    {result.matches.map((match, matchIdx) => (
                      <div key={matchIdx} className="flex items-center gap-2 group">
                        <span className="text-xs text-[var(--text-secondary)] w-10 text-right">
                          {match.line}
                        </span>
                        <span className="flex-1 text-sm text-[var(--text-secondary)] truncate font-mono">
                          {match.content}
                        </span>
                        {showReplace && (
                          <button
                            onClick={() => handleReplaceOne(result.fileId, matchIdx)}
                            className="opacity-0 group-hover:opacity-100 p-1 text-xs bg-[var(--accent-blue)] text-white rounded"
                          >
                            Replace
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="px-4 py-2 border-t border-[var(--border-color)] bg-[var(--bg-tertiary)] text-xs text-[var(--text-secondary)] flex items-center gap-4">
          {searchQuery && (
            <span>{totalMatches} match{totalMatches !== 1 ? 'es' : ''} in {results.length} file{results.length !== 1 ? 's' : ''}</span>
          )}
          <span className="ml-auto">↑↓ to navigate · Enter to open · Esc to close</span>
        </div>
      </div>
    </div>
  );
}
