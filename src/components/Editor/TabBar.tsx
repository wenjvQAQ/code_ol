import { X, Circle } from 'lucide-react';
import { useEditorStore } from '@/stores/editorStore';

export default function TabBar() {
  const { openFiles, activeFileId, setActiveFile, closeFile } = useEditorStore();

  if (openFiles.length === 0) {
    return null;
  }

  return (
    <div className="h-9 bg-[var(--bg-secondary)] border-b border-[var(--border-color)] flex items-center overflow-x-auto">
      {openFiles.map((file) => (
        <div
          key={file.id}
          className={`group flex items-center gap-2 px-3 h-full cursor-pointer border-r border-[var(--border-color)] transition-colors ${
            activeFileId === file.id
              ? 'bg-[var(--bg-primary)] border-t-2 border-t-[var(--accent-blue)]'
              : 'hover:bg-[var(--bg-tertiary)]'
          }`}
          onClick={() => setActiveFile(file.id)}
        >
          <span className="text-sm text-[var(--text-primary)] whitespace-nowrap">
            {file.name}
          </span>
          
          {file.isDirty && (
            <Circle className="w-2 h-2 fill-[var(--accent-blue)] text-[var(--accent-blue)]" />
          )}
          
          <button
            onClick={(e) => {
              e.stopPropagation();
              closeFile(file.id);
            }}
            className="opacity-0 group-hover:opacity-100 p-0.5 hover:bg-[var(--bg-tertiary)] rounded transition-all"
          >
            <X className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
          </button>
        </div>
      ))}
    </div>
  );
}
