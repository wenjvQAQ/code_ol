import { useRef, useEffect } from 'react';
import Editor, { OnMount, OnChange } from '@monaco-editor/react';
import { useThemeStore } from '@/stores/themeStore';
import { useFileStore } from '@/stores/fileStore';
import { useEditorStore } from '@/stores/editorStore';

export default function CodeEditor() {
  const { theme } = useThemeStore();
  const { getFile } = useFileStore();
  const { activeFileId, setDirty, setCursorPosition } = useEditorStore();
  const editorRef = useRef<any>(null);
  const debounceRef = useRef<NodeJS.Timeout>();

  const activeFile = activeFileId ? getFile(activeFileId) : null;

  const handleEditorMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;
    
    editor.onDidChangeCursorPosition((e) => {
      setCursorPosition({
        line: e.position.lineNumber,
        column: e.position.column,
      });
    });

    monaco.editor.defineTheme('cyberpunk-dark', {
      base: 'vs-dark',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6a737d', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'ff7b72' },
        { token: 'string', foreground: 'a5d6ff' },
        { token: 'number', foreground: '79c0ff' },
        { token: 'type', foreground: 'ffa657' },
      ],
      colors: {
        'editor.background': '#0d1117',
        'editor.foreground': '#c9d1d9',
        'editor.lineHighlightBackground': '#161b2233',
        'editor.selectionBackground': '#264f78',
        'editorCursor.foreground': '#58a6ff',
        'editorLineNumber.foreground': '#6e7681',
        'editorLineNumber.activeForeground': '#c9d1d9',
      },
    });

    monaco.editor.defineTheme('cyberpunk-light', {
      base: 'vs',
      inherit: true,
      rules: [
        { token: 'comment', foreground: '6a737d', fontStyle: 'italic' },
        { token: 'keyword', foreground: 'cf222e' },
        { token: 'string', foreground: '0a3069' },
        { token: 'number', foreground: '0550ae' },
        { token: 'type', foreground: '953800' },
      ],
      colors: {
        'editor.background': '#ffffff',
        'editor.foreground': '#1f2328',
        'editor.lineHighlightBackground': '#f6f8fa',
        'editor.selectionBackground': '#add6ff',
        'editorCursor.foreground': '#0066cc',
        'editorLineNumber.foreground': '#8b949e',
        'editorLineNumber.activeForeground': '#1f2328',
      },
    });

    editor.updateOptions({
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 14,
      lineHeight: 1.6,
      minimap: { enabled: true },
      scrollBeyondLastLine: false,
      smoothScrolling: true,
      cursorBlinking: 'smooth',
      cursorSmoothCaretAnimation: 'on',
    });
  };

  const handleChange: OnChange = (value) => {
    if (activeFileId && value !== undefined) {
      setDirty(activeFileId, true);

      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }

      debounceRef.current = setTimeout(() => {
        const { updateFileContent } = useFileStore.getState();
        updateFileContent(activeFileId, value);
        setDirty(activeFileId, false);
      }, 500);
    }
  };

  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  if (!activeFile) {
    return (
      <div className="flex-1 flex items-center justify-center bg-[var(--bg-primary)]">
        <div className="text-center">
          <div className="text-6xl mb-4">🚀</div>
          <h2 className="text-2xl font-semibold text-[var(--text-primary)] mb-2">
            云端代码工作室
          </h2>
          <p className="text-[var(--text-secondary)]">
            选择左侧文件开始编辑，或创建新文件
          </p>
          <div className="mt-6 text-sm text-[var(--text-secondary)]">
            <p>快捷键提示：</p>
            <p className="mt-1">Ctrl+N - 新建文件</p>
            <p>Ctrl+S - 保存文件</p>
            <p>Ctrl+Shift+P - 命令面板</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1">
      <Editor
        height="100%"
        language={activeFile.language || 'plaintext'}
        value={activeFile.content || ''}
        theme={theme === 'dark' ? 'cyberpunk-dark' : 'cyberpunk-light'}
        onMount={handleEditorMount}
        onChange={handleChange}
        options={{
          automaticLayout: true,
          padding: { top: 16, bottom: 16 },
        }}
      />
    </div>
  );
}
