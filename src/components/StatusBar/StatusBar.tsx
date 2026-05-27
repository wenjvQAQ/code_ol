import { useEditorStore } from '@/stores/editorStore';
import { useFileStore } from '@/stores/fileStore';
import { useThemeStore } from '@/stores/themeStore';
import { GitBranch, GitPullRequest, CircleDot } from 'lucide-react';

export default function StatusBar() {
  const { activeFileId, cursorPosition } = useEditorStore();
  const { getFile } = useFileStore();
  const { theme } = useThemeStore();

  const activeFile = activeFileId ? getFile(activeFileId) : null;

  return (
    <div className="h-6 bg-[var(--accent-blue)] text-white flex items-center justify-between px-3 text-xs select-none">
      <div className="flex items-center gap-4">
        {activeFile ? (
          <>
            <span className="flex items-center gap-1">
              {activeFile.name}
              {activeFile.language && (
                <span className="opacity-80">({activeFile.language})</span>
              )}
            </span>
            <span>
              Ln {cursorPosition.line}, Col {cursorPosition.column}
            </span>
            <span>UTF-8</span>
            <span className="flex items-center gap-1">
              <CircleDot className="w-3 h-3" />
              {activeFile.language || 'Plain Text'}
            </span>
          </>
        ) : (
          <span>No file open</span>
        )}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1 opacity-80">
          <GitBranch className="w-3 h-3" />
          <span>main</span>
        </div>
        <div className="flex items-center gap-1 opacity-80">
          <GitPullRequest className="w-3 h-3" />
          <span>0</span>
        </div>
        <span className="opacity-80">
          {theme === 'dark' ? 'Dark' : 'Light'} Theme
        </span>
      </div>
    </div>
  );
}
