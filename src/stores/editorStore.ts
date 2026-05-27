import { create } from 'zustand';
import { FileTab, EditorPosition } from '@/types';

interface EditorState {
  openFiles: FileTab[];
  activeFileId: string | null;
  cursorPosition: EditorPosition;
  openFile: (file: FileTab) => void;
  closeFile: (fileId: string) => void;
  setActiveFile: (fileId: string) => void;
  setDirty: (fileId: string, isDirty: boolean) => void;
  setCursorPosition: (position: EditorPosition) => void;
  getActiveTab: () => FileTab | undefined;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  openFiles: JSON.parse(localStorage.getItem('cloud-code-open-tabs') || '[]'),
  activeFileId: localStorage.getItem('cloud-code-active-tab'),
  cursorPosition: { line: 1, column: 1 },

  openFile: (file) => {
    set((state) => {
      const exists = state.openFiles.find((f) => f.id === file.id);
      let newOpenFiles: FileTab[];
      if (exists) {
        newOpenFiles = state.openFiles;
      } else {
        newOpenFiles = [...state.openFiles, file];
      }
      localStorage.setItem('cloud-code-open-tabs', JSON.stringify(newOpenFiles));
      localStorage.setItem('cloud-code-active-tab', file.id);
      return {
        openFiles: newOpenFiles,
        activeFileId: file.id,
      };
    });
  },

  closeFile: (fileId) => {
    set((state) => {
      const index = state.openFiles.findIndex((f) => f.id === fileId);
      let newActiveId = state.activeFileId;
      if (state.activeFileId === fileId) {
        const newFiles = state.openFiles.filter((f) => f.id !== fileId);
        if (index > 0) {
          newActiveId = newFiles[index - 1]?.id || null;
        } else {
          newActiveId = newFiles[0]?.id || null;
        }
        localStorage.setItem('cloud-code-active-tab', newActiveId || '');
        localStorage.setItem('cloud-code-open-tabs', JSON.stringify(newFiles));
        return { openFiles: newFiles, activeFileId: newActiveId };
      }
      const newFiles = state.openFiles.filter((f) => f.id !== fileId);
      localStorage.setItem('cloud-code-open-tabs', JSON.stringify(newFiles));
      return { openFiles: newFiles };
    });
  },

  setActiveFile: (fileId) => {
    localStorage.setItem('cloud-code-active-tab', fileId);
    set({ activeFileId: fileId });
  },

  setDirty: (fileId, isDirty) => {
    set((state) => {
      const newOpenFiles = state.openFiles.map((f) =>
        f.id === fileId ? { ...f, isDirty } : f
      );
      localStorage.setItem('cloud-code-open-tabs', JSON.stringify(newOpenFiles));
      return { openFiles: newOpenFiles };
    });
  },

  setCursorPosition: (position) => {
    set({ cursorPosition: position });
  },

  getActiveTab: () => {
    const state = get();
    return state.openFiles.find((f) => f.id === state.activeFileId);
  },
}));
