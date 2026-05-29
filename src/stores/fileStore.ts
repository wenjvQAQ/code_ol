import { create } from 'zustand';
import { FileNode } from '@/types';

interface FileState {
  files: FileNode[];
  expandedFolders: Set<string>;
  createFile: (name: string, parentId?: string | null, content?: string) => string;
  createFolder: (name: string, parentId?: string | null) => string;
  deleteFile: (id: string) => void;
  renameFile: (id: string, newName: string) => void;
  updateFileContent: (id: string, content: string) => void;
  toggleFolder: (folderId: string) => void;
  getFile: (id: string) => FileNode | undefined;
  getLanguage: (filename: string) => string;
  setFiles: (files: FileNode[]) => void;
}

const generateId = () => Math.random().toString(36).substring(2, 15);

const getLanguage = (filename: string): string => {
  const ext = filename.split('.').pop()?.toLowerCase();
  const langMap: Record<string, string> = {
    'js': 'javascript',
    'jsx': 'javascript',
    'ts': 'typescript',
    'tsx': 'typescript',
    'py': 'python',
    'rb': 'ruby',
    'java': 'java',
    'cpp': 'cpp',
    'c': 'c',
    'go': 'go',
    'rs': 'rust',
    'php': 'php',
    'html': 'html',
    'css': 'css',
    'scss': 'scss',
    'json': 'json',
    'md': 'markdown',
    'yaml': 'yaml',
    'yml': 'yaml',
    'xml': 'xml',
    'sql': 'sql',
    'sh': 'shell',
    'bash': 'shell',
  };
  return langMap[ext || ''] || 'plaintext';
};

const findNode = (nodes: FileNode[], id: string): FileNode | undefined => {
  for (const node of nodes) {
    if (node.id === id) return node;
    if (node.children) {
      const found = findNode(node.children, id);
      if (found) return found;
    }
  }
  return undefined;
};

const updateNode = (nodes: FileNode[], id: string, updater: (node: FileNode) => FileNode): FileNode[] => {
  return nodes.map(node => {
    if (node.id === id) {
      return updater(node);
    }
    if (node.children) {
      return { ...node, children: updateNode(node.children, id, updater) };
    }
    return node;
  });
};

const removeNode = (nodes: FileNode[], id: string): FileNode[] => {
  return nodes
    .filter(node => node.id !== id)
    .map(node => {
      if (node.children) {
        return { ...node, children: removeNode(node.children, id) };
      }
      return node;
    });
};

const addNode = (nodes: FileNode[], parentId: string | null, newNode: FileNode): FileNode[] => {
  if (parentId === null) {
    return [...nodes, newNode];
  }
  return nodes.map(node => {
    if (node.id === parentId) {
      return { ...node, children: [...(node.children || []), newNode] };
    }
    if (node.children) {
      return { ...node, children: addNode(node.children, parentId, newNode) };
    }
    return node;
  });
};

const getInitialFiles = (): FileNode[] => {
  const saved = localStorage.getItem('cloud-code-files');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return getDefaultFiles();
    }
  }
  return getDefaultFiles();
};

const getDefaultFiles = (): FileNode[] => [
  {
    id: 'folder-src',
    name: 'src',
    type: 'folder',
    parentId: null,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    children: [
      {
        id: 'file-index',
        name: 'index.ts',
        type: 'file',
        parentId: 'folder-src',
        content: '// Welcome to Cloud Code Studio\nconsole.log("Hello, World!");',
        language: 'typescript',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
      {
        id: 'file-app',
        name: 'app.ts',
        type: 'file',
        parentId: 'folder-src',
        content: 'const app = {\n  name: "Cloud Code Studio",\n  version: "1.0.0"\n};\n\nexport default app;',
        language: 'typescript',
        createdAt: Date.now(),
        updatedAt: Date.now(),
      },
    ],
  },
  {
    id: 'file-readme',
    name: 'README.md',
    type: 'file',
    parentId: null,
    content: '# Cloud Code Studio\n\nA VS Code-like online editor built with React.',
    language: 'markdown',
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

export const useFileStore = create<FileState>((set, get) => ({
  files: getInitialFiles(),
  expandedFolders: new Set(['folder-src']),

  createFile: (name, parentId = null, content = '') => {
    const id = generateId();
    const newFile: FileNode = {
      id,
      name,
      type: 'file',
      parentId,
      content,
      language: getLanguage(name),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    set((state) => {
      const newFiles = addNode(state.files, parentId, newFile);
      localStorage.setItem('cloud-code-files', JSON.stringify(newFiles));
      return { files: newFiles };
    });
    return id;
  },

  createFolder: (name, parentId = null) => {
    const id = generateId();
    const newFolder: FileNode = {
      id,
      name,
      type: 'folder',
      parentId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
      children: [],
    };
    set((state) => {
      const newFiles = addNode(state.files, parentId, newFolder);
      localStorage.setItem('cloud-code-files', JSON.stringify(newFiles));
      return { files: newFiles };
    });
    return id;
  },

  deleteFile: (id) => {
    set((state) => {
      const newFiles = removeNode(state.files, id);
      localStorage.setItem('cloud-code-files', JSON.stringify(newFiles));
      return { files: newFiles };
    });
  },

  renameFile: (id, newName) => {
    set((state) => {
      const newFiles = updateNode(state.files, id, (node) => ({
        ...node,
        name: newName,
        language: node.type === 'file' ? getLanguage(newName) : node.language,
        updatedAt: Date.now(),
      }));
      localStorage.setItem('cloud-code-files', JSON.stringify(newFiles));
      return { files: newFiles };
    });
  },

  updateFileContent: (id, content) => {
    set((state) => {
      const newFiles = updateNode(state.files, id, (node) => ({
        ...node,
        content,
        updatedAt: Date.now(),
      }));
      localStorage.setItem('cloud-code-files', JSON.stringify(newFiles));
      return { files: newFiles };
    });
  },

  toggleFolder: (folderId) => {
    set((state) => {
      const newExpanded = new Set(state.expandedFolders);
      if (newExpanded.has(folderId)) {
        newExpanded.delete(folderId);
      } else {
        newExpanded.add(folderId);
      }
      return { expandedFolders: newExpanded };
    });
  },

  getFile: (id) => findNode(get().files, id),

  getLanguage,

  setFiles: (files) => {
    localStorage.setItem('cloud-code-files', JSON.stringify(files));
    set({ files });
  },
}));
