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

    // 注册 JavaScript/TypeScript 补全提供器
    monaco.languages.registerCompletionItemProvider('javascript', {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };
        
        return {
          suggestions: [
            { label: 'console.log', kind: monaco.languages.CompletionItemKind.Function, insertText: 'console.log()', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range, documentation: '输出到控制台' },
            { label: 'console.error', kind: monaco.languages.CompletionItemKind.Function, insertText: 'console.error()', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range, documentation: '输出错误' },
            { label: 'function', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'function ${1:name}(${2:params}) {\n\t${3:// code}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range, documentation: '函数声明' },
            { label: 'const', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'const ', range },
            { label: 'let', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'let ', range },
            { label: 'if', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'if (${1:condition}) {\n\t${2:// code}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
            { label: 'for', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'for (let ${1:i} = 0; ${1:i} < ${2:length}; ${1:i}++) {\n\t${3:// code}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
            { label: 'forEach', kind: monaco.languages.CompletionItemKind.Method, insertText: '.forEach(${1:item} => ${2:// code})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
            { label: 'map', kind: monaco.languages.CompletionItemKind.Method, insertText: '.map(${1:item} => ${2:// code})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
            { label: 'filter', kind: monaco.languages.CompletionItemKind.Method, insertText: '.filter(${1:item} => ${2:// condition})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
            { label: 'return', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'return ', range },
            { label: 'async', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'async ', range },
            { label: 'await', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'await ', range },
            { label: 'try/catch', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'try {\n\t${1:// code}\n} catch (${2:error}) {\n\t${3:// handle error}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
            { label: 'setTimeout', kind: monaco.languages.CompletionItemKind.Function, insertText: 'setTimeout(() => {\n\t${1:// code}\n}, ${2:1000})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
            { label: 'setInterval', kind: monaco.languages.CompletionItemKind.Function, insertText: 'setInterval(() => {\n\t${1:// code}\n}, ${2:1000})', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
          ]
        };
      }
    });

    monaco.languages.registerCompletionItemProvider('typescript', {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };
        
        return {
          suggestions: [
            { label: 'console.log', kind: monaco.languages.CompletionItemKind.Function, insertText: 'console.log()', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range, documentation: '输出到控制台' },
            { label: 'interface', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'interface ${1:Name} {\n\t${2:prop}: ${3:type};\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
            { label: 'type', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'type ', range },
            { label: 'const', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'const ', range },
            { label: 'let', kind: monaco.languages.CompletionItemKind.Keyword, insertText: 'let ', range },
            { label: 'function', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'function ${1:name}(${2:params}: ${3:type}): ${4:void} {\n\t${5:// code}\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
            { label: 'async/await', kind: monaco.languages.CompletionItemKind.Snippet, insertText: 'async function ${1:name}() {\n\tconst ${2:result} = await ${3:promise};\n}', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
          ]
        };
      }
    });

    monaco.languages.registerCompletionItemProvider('html', {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };
        
        return {
          suggestions: [
            { label: 'div', kind: monaco.languages.CompletionItemKind.Snippet, insertText: '<div>${1:content}</div>', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
            { label: 'span', kind: monaco.languages.CompletionItemKind.Snippet, insertText: '<span>${1:content}</span>', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
            { label: 'p', kind: monaco.languages.CompletionItemKind.Snippet, insertText: '<p>${1:content}</p>', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
            { label: 'a', kind: monaco.languages.CompletionItemKind.Snippet, insertText: '<a href="${1:url}">${2:link text}</a>', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
            { label: 'img', kind: monaco.languages.CompletionItemKind.Snippet, insertText: '<img src="${1:src}" alt="${2:alt}">', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
            { label: 'ul', kind: monaco.languages.CompletionItemKind.Snippet, insertText: '<ul>\n\t<li>${1:item 1}</li>\n</ul>', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
            { label: 'ol', kind: monaco.languages.CompletionItemKind.Snippet, insertText: '<ol>\n\t<li>${1:item 1}</li>\n</ol>', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
            { label: 'button', kind: monaco.languages.CompletionItemKind.Snippet, insertText: '<button>${1:text}</button>', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
            { label: 'input', kind: monaco.languages.CompletionItemKind.Snippet, insertText: '<input type="${1:text}">', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
            { label: 'script', kind: monaco.languages.CompletionItemKind.Snippet, insertText: '<script>\n\t${1:// code}\n</script>', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
            { label: 'style', kind: monaco.languages.CompletionItemKind.Snippet, insertText: '<style>\n\t${1:/* styles */}\n</style>', insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet, range },
          ]
        };
      }
    });

    monaco.languages.registerCompletionItemProvider('css', {
      provideCompletionItems: (model, position) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn,
        };
        
        return {
          suggestions: [
            { label: 'display: flex', kind: monaco.languages.CompletionItemKind.Property, insertText: 'display: flex;', range },
            { label: 'display: grid', kind: monaco.languages.CompletionItemKind.Property, insertText: 'display: grid;', range },
            { label: 'flex-direction', kind: monaco.languages.CompletionItemKind.Property, insertText: 'flex-direction: ', range },
            { label: 'justify-content', kind: monaco.languages.CompletionItemKind.Property, insertText: 'justify-content: ', range },
            { label: 'align-items', kind: monaco.languages.CompletionItemKind.Property, insertText: 'align-items: ', range },
            { label: 'margin', kind: monaco.languages.CompletionItemKind.Property, insertText: 'margin: ', range },
            { label: 'padding', kind: monaco.languages.CompletionItemKind.Property, insertText: 'padding: ', range },
            { label: 'color', kind: monaco.languages.CompletionItemKind.Property, insertText: 'color: ', range },
            { label: 'background', kind: monaco.languages.CompletionItemKind.Property, insertText: 'background: ', range },
            { label: 'font-size', kind: monaco.languages.CompletionItemKind.Property, insertText: 'font-size: ', range },
            { label: 'width', kind: monaco.languages.CompletionItemKind.Property, insertText: 'width: ', range },
            { label: 'height', kind: monaco.languages.CompletionItemKind.Property, insertText: 'height: ', range },
            { label: 'border', kind: monaco.languages.CompletionItemKind.Property, insertText: 'border: ', range },
            { label: 'border-radius', kind: monaco.languages.CompletionItemKind.Property, insertText: 'border-radius: ', range },
          ]
        };
      }
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
      quickSuggestions: { other: true, comments: true, strings: true },
      suggestOnTriggerCharacters: true,
      wordBasedSuggestions: 'currentDocument',
      tabCompletion: 'on',
      acceptSuggestionOnEnter: 'on',
      suggestSelection: 'first',
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
