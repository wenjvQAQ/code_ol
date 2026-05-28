import { useState, useEffect, useRef } from 'react';
import { X, File, Folder, Plus } from 'lucide-react';
import { useFileStore } from '@/stores/fileStore';
import { useEditorStore } from '@/stores/editorStore';

interface NewFileModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialParentId?: string | null;
  type?: 'file' | 'folder';
}

const FILE_TEMPLATES = [
  { ext: '.ts', label: 'TypeScript' },
  { ext: '.tsx', label: 'TypeScript React' },
  { ext: '.js', label: 'JavaScript' },
  { ext: '.jsx', label: 'JavaScript React' },
  { ext: '.html', label: 'HTML' },
  { ext: '.css', label: 'CSS' },
  { ext: '.json', label: 'JSON' },
  { ext: '.md', label: 'Markdown' },
  { ext: '.py', label: 'Python' },
  { ext: '.c', label: 'C' },
  { ext: '.cpp', label: 'C++' },
];

export default function NewFileModal({ 
  isOpen, 
  onClose, 
  initialParentId = null, 
  type = 'file' 
}: NewFileModalProps) {
  const [name, setName] = useState('');
  const [selectedType, setSelectedType] = useState<'file' | 'folder'>(type);
  const [selectedExt, setSelectedExt] = useState('.ts');
  const inputRef = useRef<HTMLInputElement>(null);
  
  const { createFile, createFolder } = useFileStore();
  const { openFile } = useEditorStore();

  useEffect(() => {
    if (isOpen) {
      setName('');
      setSelectedType(type);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen, type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    if (selectedType === 'folder') {
      createFolder(name.trim(), initialParentId);
    } else {
      const fileName = name.includes('.') ? name.trim() : `${name.trim()}${selectedExt}`;
      const fileId = createFile(fileName, initialParentId);
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
    
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      onClick={onClose}
    >
      <div 
        className="w-full max-w-md bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-[var(--border-color)]">
          <div className="flex items-center gap-2">
            {selectedType === 'file' ? (
              <File className="w-5 h-5 text-[var(--accent-blue)]" />
            ) : (
              <Folder className="w-5 h-5 text-[var(--accent-green)]" />
            )}
            <h3 className="font-semibold text-[var(--text-primary)]">
              新建{selectedType === 'file' ? '文件' : '文件夹'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[var(--bg-tertiary)] rounded transition-colors"
          >
            <X className="w-4 h-4 text-[var(--text-secondary)]" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          {/* Type toggle */}
          <div className="flex gap-2 mb-4 bg-[var(--bg-tertiary)] rounded-lg p-1">
            <button
              type="button"
              onClick={() => setSelectedType('file')}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedType === 'file'
                  ? 'bg-[var(--accent-blue)] text-white'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <File className="w-4 h-4" />
              文件
            </button>
            <button
              type="button"
              onClick={() => setSelectedType('folder')}
              className={`flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                selectedType === 'folder'
                  ? 'bg-[var(--accent-green)] text-white'
                  : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
              }`}
            >
              <Folder className="w-4 h-4" />
              文件夹
            </button>
          </div>

          {/* Name input */}
          <div className="mb-4">
            <label className="block text-sm text-[var(--text-secondary)] mb-2">
              {selectedType === 'file' ? '文件名' : '文件夹名'}
            </label>
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder={selectedType === 'file' ? 'index.ts' : 'src'}
                className="w-full px-3 py-2 bg-[var(--bg-primary)] border border-[var(--border-color)] rounded-lg text-[var(--text-primary)] placeholder-[var(--text-secondary)] outline-none focus:border-[var(--accent-blue)] transition-colors"
              />
              {selectedType === 'file' && !name.includes('.') && (
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-secondary)] text-sm pointer-events-none">
                  {selectedExt}
                </span>
              )}
            </div>
          </div>

          {/* File templates */}
          {selectedType === 'file' && (
            <div className="mb-4">
              <label className="block text-sm text-[var(--text-secondary)] mb-2">
                快速选择模板
              </label>
              <div className="grid grid-cols-5 gap-1">
                {FILE_TEMPLATES.map((template) => (
                  <button
                    key={template.ext}
                    type="button"
                    onClick={() => {
                      setSelectedExt(template.ext);
                      if (!name) {
                        setName(template.ext === '.tsx' ? 'App' : 'index');
                      }
                    }}
                    className={`px-2 py-1.5 text-xs rounded border transition-colors ${
                      selectedExt === template.ext
                        ? 'border-[var(--accent-blue)] bg-[var(--accent-blue)]/10 text-[var(--accent-blue)]'
                        : 'border-[var(--border-color)] text-[var(--text-secondary)] hover:border-[var(--text-secondary)]'
                    }`}
                  >
                    {template.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-2 justify-end">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={!name.trim()}
              className="flex items-center gap-2 px-4 py-2 bg-[var(--accent-blue)] text-white rounded-lg text-sm font-medium hover:bg-[var(--accent-blue)]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Plus className="w-4 h-4" />
              创建
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
