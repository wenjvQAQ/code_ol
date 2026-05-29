import { useState } from 'react';
import { GitBranch, GitCommit, FilePlus, FileMinus, RefreshCw, FileText, Clock, GitPullRequest, AlertCircle } from 'lucide-react';

export default function GitPanel() {
  const [commits] = useState([
    {
      id: '1',
      message: 'Initial commit',
      author: 'You',
      time: '2 days ago',
      files: ['README.md', 'src/index.ts']
    },
    {
      id: '2',
      message: 'Add new features',
      author: 'You',
      time: '1 day ago',
      files: ['src/app.ts']
    }
  ]);

  const [changes] = useState([
    { file: 'README.md', status: 'modified' },
    { file: 'src/index.ts', status: 'modified' }
  ]);

  const statusColors = {
    added: 'text-[var(--accent-green)]',
    modified: 'text-[var(--accent-blue)]',
    removed: 'text-[var(--accent-red)]'
  };

  const statusIcons = {
    added: FilePlus,
    modified: FileText,
    removed: FileMinus
  };

  return (
    <div className="h-full flex flex-col bg-[var(--bg-primary)]">
      <div className="p-3 border-b border-[var(--border-color)]">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-[var(--text-primary)]">Source Control</h3>
          <button
            className="p-1 hover:bg-[var(--bg-tertiary)] rounded transition-colors"
            title="Refresh"
          >
            <RefreshCw className="w-4 h-4 text-[var(--text-secondary)]" />
          </button>
        </div>
        <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
          <GitBranch className="w-3.5 h-3.5" />
          <span>main</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2 space-y-4">
        {changes.length > 0 && (
          <div>
            <div className="px-2 py-1 text-xs font-medium text-[var(--text-secondary)]">
              Changes ({changes.length})
            </div>
            <div className="space-y-1">
              {changes.map((change, i) => {
                const Icon = statusIcons[change.status as keyof typeof statusIcons];
                return (
                  <div
                    key={i}
                    className="px-2 py-1.5 hover:bg-[var(--bg-tertiary)] rounded flex items-center gap-2 text-sm cursor-pointer"
                  >
                    <Icon className={`w-3.5 h-3.5 ${statusColors[change.status as keyof typeof statusColors]}`} />
                    <span className="text-[var(--text-primary)] truncate">{change.file}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        <div>
          <div className="px-2 py-1 text-xs font-medium text-[var(--text-secondary)]">
            Commits
          </div>
          <div className="space-y-1">
            {commits.map((commit) => (
            <div
              key={commit.id}
              className="px-2 py-1.5 hover:bg-[var(--bg-tertiary)] rounded text-sm"
            >
              <div className="flex items-start gap-2">
                <GitCommit className="w-3.5 h-3.5 text-[var(--text-secondary)] mt-0.5" />
                <div className="flex-1 min-w-0">
                  <div className="text-[var(--text-primary)] truncate">{commit.message}</div>
                  <div className="flex items-center gap-2 text-xs text-[var(--text-secondary)]">
                    <span>{commit.author}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {commit.time}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

      <div className="p-3 border-t border-[var(--border-color)]">
        <div className="text-xs text-[var(--text-secondary)]">
          <div className="flex items-center gap-1 text-xs text-[var(--text-secondary)]">
            <AlertCircle className="w-3 h-3" />
            <span>Read-only mode</span>
          </div>
          <p className="mt-1 text-xs opacity-70">
            Full Git features available with backend integration
          </p>
        </div>
      </div>
    </div>
  );
}
