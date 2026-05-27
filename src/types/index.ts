export interface FileNode {
  id: string;
  name: string;
  type: 'file' | 'folder';
  parentId: string | null;
  content?: string;
  language?: string;
  createdAt: number;
  updatedAt: number;
  children?: FileNode[];
}

export interface FileTab {
  id: string;
  name: string;
  language: string;
  isDirty: boolean;
}

export interface TerminalLine {
  id: string;
  type: 'input' | 'output' | 'error';
  content: string;
  timestamp: number;
}

export type Theme = 'dark' | 'light';

export interface EditorPosition {
  line: number;
  column: number;
}
