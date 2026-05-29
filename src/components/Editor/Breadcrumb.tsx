import { useEditorStore } from '@/stores/editorStore';
import { useFileStore } from '@/stores/fileStore';
import { Home, Folder, FileText, ChevronRight } from 'lucide-react';

export default function Breadcrumb() {
  const { activeFileId } = useEditorStore();
  const { getFile } = useFileStore();

  const activeFile = activeFileId ? getFile(activeFileId) : null;

  if (!activeFile) {
    return (
      <div className="h-6 bg-[var(--bg-tertiary)] border-b border-[var(--border-color)] flex items-center px-3 text-xs text-[var(--text-secondary)]">
        <Home className="w-3 h-3 mr-1" />
        Workspace
      </div>
    );
  }

  return (
    <div className="h-6 bg-[var(--bg-tertiary)] border-b border-[var(--border-color)] flex items-center px-3 text-xs overflow-hidden">
      <Home className="w-3 h-3 mr-1 text-[var(--text-secondary)]" />
      <span className="text-[var(--text-secondary)]">Workspace</span>
      <ChevronRight className="w-3 h-3 mx-1 text-[var(--text-secondary)]" />
      {activeFile.isFolder ? (
        <>
          <Folder className="w-3 h-3 mr-1 text-[var(--text-secondary)]" />
          <span className="text-[var(--text-primary)]">{activeFile.name}</span>
        </>
      ) : (
        <>
          <FileText className="w-3 h-3 mr-1 text-[var(--text-secondary)]" />
          <span className="text-[var(--text-primary)]">{activeFile.name}</span>
        </>
      )}
    </div>
  );
}
