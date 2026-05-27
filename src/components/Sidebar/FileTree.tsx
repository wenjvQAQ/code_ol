import { useState } from 'react';
import { 
  ChevronRight, 
  ChevronDown, 
  File, 
  Folder, 
  FolderOpen,
  Plus,
  MoreHorizontal,
  Trash2,
  Edit3,
  Download,
  FolderPlus
} from 'lucide-react';
import { useFileStore } from '@/stores/fileStore';
import { useEditorStore } from '@/stores/editorStore';
import { FileNode, FileTab } from '@/types';

export default function FileTree() {
  const { files, expandedFolders, toggleFolder, createFile, createFolder, deleteFile, renameFile, getFile } = useFileStore();
  const { openFile } = useEditorStore();
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; node: FileNode } | null>(null);
  const [renaming, setRenaming] = useState<string | null>(null);
  const [newName, setNewName] = useState('');

  const handleFileClick = (node: FileNode) => {
    if (node.type === 'file') {
      const tab: FileTab = {
        id: node.id,
        name: node.name,
        language: node.language || 'plaintext',
        isDirty: false,
      };
      openFile(tab);
    }
  };

  const handleContextMenu = (e: React.MouseEvent, node: FileNode) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, node });
  };

  const handleCreateFile = () => {
    const name = prompt('Enter file name:', 'untitled.txt');
    if (name) {
      const parentId = contextMenu?.node.type === 'folder' ? contextMenu.node.id : null;
      createFile(name, parentId);
    }
    setContextMenu(null);
  };

  const handleDelete = (node: FileNode) => {
    if (confirm(`Delete ${node.name}?`)) {
      deleteFile(node.id);
    }
    setContextMenu(null);
  };

  const handleRename = (node: FileNode) => {
    setRenaming(node.id);
    setNewName(node.name);
    setContextMenu(null);
  };

  const handleCreateFolder = () => {
    const name = prompt('Enter folder name:', 'newfolder');
    if (name) {
      const parentId = contextMenu?.node.type === 'folder' ? contextMenu.node.id : null;
      createFolder(name, parentId);
    }
    setContextMenu(null);
  };

  const handleExport = (node: FileNode) => {
    if (node.type === 'file' && node.content) {
      const blob = new Blob([node.content], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = node.name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
    setContextMenu(null);
  };

  const handleExportAll = () => {
    const exportData = JSON.stringify(files, null, 2);
    const blob = new Blob([exportData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'cloud-code-project.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    setContextMenu(null);
  };

  const submitRename = (nodeId: string) => {
    if (newName.trim()) {
      renameFile(nodeId, newName.trim());
    }
    setRenaming(null);
    setNewName('');
  };

  const renderNode = (node: FileNode, depth: number = 0) => {
    const isExpanded = expandedFolders.has(node.id);
    const isFolder = node.type === 'folder';

    return (
      <div key={node.id}>
        <div
          className="flex items-center gap-1 px-2 py-1 cursor-pointer hover:bg-[var(--bg-tertiary)] rounded transition-colors group"
          style={{ paddingLeft: `${depth * 12 + 8}px` }}
          onClick={() => isFolder ? toggleFolder(node.id) : handleFileClick(node)}
          onContextMenu={(e) => handleContextMenu(e, node)}
        >
          {isFolder ? (
            isExpanded ? (
              <ChevronDown className="w-4 h-4 text-[var(--text-secondary)]" />
            ) : (
              <ChevronRight className="w-4 h-4 text-[var(--text-secondary)]" />
            )
          ) : (
            <span className="w-4" />
          )}
          
          {isFolder ? (
            isExpanded ? (
              <FolderOpen className="w-4 h-4 text-[var(--accent-blue)]" />
            ) : (
              <Folder className="w-4 h-4 text-[var(--accent-blue)]" />
            )
          ) : (
            <File className="w-4 h-4 text-[var(--text-secondary)]" />
          )}
          
          {renaming === node.id ? (
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              onBlur={() => submitRename(node.id)}
              onKeyDown={(e) => e.key === 'Enter' && submitRename(node.id)}
              className="flex-1 px-1 text-sm bg-[var(--bg-primary)] border border-[var(--accent-blue)] rounded outline-none text-[var(--text-primary)]"
              autoFocus
              onClick={(e) => e.stopPropagation()}
            />
          ) : (
            <span className="flex-1 text-sm text-[var(--text-primary)] truncate">
              {node.name}
            </span>
          )}
          
          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-1 transition-opacity">
            <button
              onClick={(e) => {
                e.stopPropagation();
                handleContextMenu(e, node);
              }}
              className="p-0.5 hover:bg-[var(--bg-tertiary)] rounded"
            >
              <MoreHorizontal className="w-3 h-3 text-[var(--text-secondary)]" />
            </button>
          </div>
        </div>
        
        {isFolder && isExpanded && node.children && (
          <div>
            {node.children.map((child) => renderNode(child, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="py-2 relative" onClick={() => setContextMenu(null)}>
      <div className="flex items-center justify-between px-4 mb-2">
        <span className="text-xs font-semibold text-[var(--text-secondary)] uppercase tracking-wide">
          Explorer
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            handleCreateFile();
          }}
          className="p-1 hover:bg-[var(--bg-tertiary)] rounded transition-colors"
          title="New File"
        >
          <Plus className="w-4 h-4 text-[var(--text-secondary)]" />
        </button>
      </div>
      
      <div>
        {files.map((node) => renderNode(node))}
      </div>

      {contextMenu && (
        <div
          className="fixed z-50 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-md shadow-lg py-1 min-w-[180px]"
          style={{ left: contextMenu.x, top: contextMenu.y }}
          onClick={(e) => e.stopPropagation()}
        >
          <button
            className="w-full px-3 py-1.5 text-left text-sm hover:bg-[var(--bg-tertiary)] flex items-center gap-2 text-[var(--text-primary)]"
            onClick={() => handleCreateFile()}
          >
            <Plus className="w-4 h-4" />
            New File
          </button>
          <button
            className="w-full px-3 py-1.5 text-left text-sm hover:bg-[var(--bg-tertiary)] flex items-center gap-2 text-[var(--text-primary)]"
            onClick={() => handleCreateFolder()}
          >
            <FolderPlus className="w-4 h-4" />
            New Folder
          </button>
          <div className="border-t border-[var(--border-color)] my-1" />
          {contextMenu.node.type === 'file' && (
            <button
              className="w-full px-3 py-1.5 text-left text-sm hover:bg-[var(--bg-tertiary)] flex items-center gap-2 text-[var(--text-primary)]"
              onClick={() => handleExport(contextMenu.node)}
            >
              <Download className="w-4 h-4" />
              Export File
            </button>
          )}
          <button
            className="w-full px-3 py-1.5 text-left text-sm hover:bg-[var(--bg-tertiary)] flex items-center gap-2 text-[var(--text-primary)]"
            onClick={() => handleExportAll()}
          >
            <Download className="w-4 h-4" />
            Export All
          </button>
          <div className="border-t border-[var(--border-color)] my-1" />
          <button
            className="w-full px-3 py-1.5 text-left text-sm hover:bg-[var(--bg-tertiary)] flex items-center gap-2 text-[var(--text-primary)]"
            onClick={() => handleRename(contextMenu.node)}
          >
            <Edit3 className="w-4 h-4" />
            Rename
          </button>
          <button
            className="w-full px-3 py-1.5 text-left text-sm hover:bg-[var(--bg-tertiary)] flex items-center gap-2 text-[var(--accent-red)]"
            onClick={() => handleDelete(contextMenu.node)}
          >
            <Trash2 className="w-4 h-4" />
            Delete
          </button>
        </div>
      )}
    </div>
  );
}
