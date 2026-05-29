import { useState } from 'react';
import { useSnippetStore, Snippet } from '@/stores/snippetStore';
import { useFileStore } from '@/stores/fileStore';
import { useEditorStore } from '@/stores/editorStore';
import { Plus, Copy, Trash2, Edit, Search, Code } from 'lucide-react';

export default function SnippetPanel() {
  const { snippets, addSnippet, removeSnippet, updateSnippet, getSnippetsByLanguage } = useSnippetStore();
  const { getFile, updateFileContent } = useFileStore();
  const { activeFileId } = useEditorStore();
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingSnippet, setEditingSnippet] = useState<Snippet | null>(null);
  const [newSnippet, setNewSnippet] = useState<Partial<Snippet>>({
    name: '',
    description: '',
    prefix: '',
    code: '',
    language: 'javascript',
  });

  const activeFile = activeFileId ? getFile(activeFileId) : null;
  const currentLanguage = activeFile?.language || 'javascript';

  const filteredSnippets = getSnippetsByLanguage(currentLanguage).filter((snippet) =>
    snippet.name.toLowerCase().includes(search.toLowerCase()) ||
    snippet.prefix.toLowerCase().includes(search.toLowerCase()) ||
    snippet.description.toLowerCase().includes(search.toLowerCase())
  );

  const handleInsertSnippet = async (snippet: Snippet) => {
    if (!activeFileId) return;

    try {
      updateFileContent(activeFileId, (activeFile?.content || '') + '\n' + snippet.code);
    } catch (err) {
      console.error('Failed to insert snippet:', err);
    }
  };

  const handleAddSnippet = () => {
    if (newSnippet.name && newSnippet.prefix && newSnippet.code) {
      addSnippet(newSnippet as Omit<Snippet, 'id'>);
      setNewSnippet({
        name: '',
        description: '',
        prefix: '',
        code: '',
        language: 'javascript',
      });
      setShowAddModal(false);
    }
  };

  const handleEditSnippet = (snippet: Snippet) => {
    setEditingSnippet(snippet);
    setNewSnippet(snippet);
    setShowAddModal(true);
  };

  const handleSaveEdit = () => {
    if (editingSnippet && newSnippet.name && newSnippet.prefix && newSnippet.code) {
      updateSnippet(editingSnippet.id, newSnippet);
      setEditingSnippet(null);
      setNewSnippet({
        name: '',
        description: '',
        prefix: '',
        code: '',
        language: 'javascript',
      });
      setShowAddModal(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[var(--bg-primary)]">
      <div className="p-3 border-b border-[var(--border-color)]">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-medium text-[var(--text-primary)]">Snippets</h3>
          <button
            onClick={() => {
              setEditingSnippet(null);
              setNewSnippet({
                name: '',
                description: '',
                prefix: '',
                code: '',
                language: currentLanguage,
              });
              setShowAddModal(true);
            }}
            className="p-1 hover:bg-[var(--bg-tertiary)] rounded transition-colors"
            title="Add Snippet"
          >
            <Plus className="w-4 h-4 text-[var(--text-secondary)]" />
          </button>
        </div>
        <div className="relative">
          <Search className="w-3.5 h-3.5 text-[var(--text-secondary)] absolute left-2 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search snippets..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-7 pr-3 py-1.5 text-xs bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded text-[var(--text-primary)] placeholder-[var(--text-secondary)]"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-2">
        {filteredSnippets.length === 0 ? (
          <div className="text-center py-8 text-[var(--text-secondary)] text-xs">
            {search ? 'No snippets found' : 'No snippets for this language'}
          </div>
        ) : (
          <div className="space-y-1">
            {filteredSnippets.map((snippet) => (
              <div
                key={snippet.id}
                className="p-2 bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded hover:border-[var(--accent-blue)] transition-colors group"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-[var(--text-primary)] text-xs">
                        {snippet.name}
                      </span>
                      <span className="text-[var(--accent-blue)] text-xs font-mono bg-[var(--accent-blue)]/10 px-1.5 py-0.5 rounded">
                        {snippet.prefix}
                      </span>
                    </div>
                    {snippet.description && (
                      <p className="text-[var(--text-secondary)] text-xs mt-1 line-clamp-2">
                        {snippet.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-1 ml-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      onClick={() => handleInsertSnippet(snippet)}
                      className="p-1 hover:bg-[var(--bg-tertiary)] rounded transition-colors"
                      title="Insert"
                    >
                      <Copy className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                    </button>
                    <button
                      onClick={() => handleEditSnippet(snippet)}
                      className="p-1 hover:bg-[var(--bg-tertiary)] rounded transition-colors"
                      title="Edit"
                    >
                      <Edit className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                    </button>
                    <button
                      onClick={() => removeSnippet(snippet.id)}
                      className="p-1 hover:bg-[var(--bg-tertiary)] rounded transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
          <div className="bg-[var(--bg-secondary)] border border-[var(--border-color)] rounded-xl shadow-2xl w-full max-w-md max-h-[80vh] overflow-hidden">
            <div className="flex items-center justify-between p-4 border-b border-[var(--border-color)]">
              <h3 className="font-semibold text-[var(--text-primary)]">
                {editingSnippet ? 'Edit Snippet' : 'Add Snippet'}
              </h3>
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingSnippet(null);
                  setNewSnippet({
                    name: '',
                    description: '',
                    prefix: '',
                    code: '',
                    language: 'javascript',
                  });
                }}
                className="p-1 hover:bg-[var(--bg-tertiary)] rounded transition-colors"
              >
                <span className="text-[var(--text-secondary)]">✕</span>
              </button>
            </div>
            <div className="p-4 space-y-3 overflow-y-auto max-h-[calc(80vh-120px)]">
              <div>
                <label className="block text-xs font-medium text-[var(--text-primary)] mb-1">
                  Name
                </label>
                <input
                  type="text"
                  value={newSnippet.name}
                  onChange={(e) => setNewSnippet({ ...newSnippet, name: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-[var(--bg-primary)] border border-[var(--border-color)] rounded text-[var(--text-primary)]"
                  placeholder="My Snippet"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-primary)] mb-1">
                  Prefix
                </label>
                <input
                  type="text"
                  value={newSnippet.prefix}
                  onChange={(e) => setNewSnippet({ ...newSnippet, prefix: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-[var(--bg-primary)] border border-[var(--border-color)] rounded text-[var(--text-primary)]"
                  placeholder="my-snippet"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-primary)] mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={newSnippet.description}
                  onChange={(e) => setNewSnippet({ ...newSnippet, description: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-[var(--bg-primary)] border border-[var(--border-color)] rounded text-[var(--text-primary)]"
                  placeholder="What does this snippet do?"
                />
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-primary)] mb-1">
                  Language
                </label>
                <select
                  value={newSnippet.language}
                  onChange={(e) => setNewSnippet({ ...newSnippet, language: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-[var(--bg-primary)] border border-[var(--border-color)] rounded text-[var(--text-primary)]"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="typescript">TypeScript</option>
                  <option value="python">Python</option>
                  <option value="html">HTML</option>
                  <option value="css">CSS</option>
                  <option value="plaintext">Plain Text</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium text-[var(--text-primary)] mb-1">
                  Code
                </label>
                <textarea
                  value={newSnippet.code}
                  onChange={(e) => setNewSnippet({ ...newSnippet, code: e.target.value })}
                  className="w-full px-3 py-2 text-sm bg-[var(--bg-primary)] border border-[var(--border-color)] rounded text-[var(--text-primary)] font-mono"
                  rows={8}
                  placeholder="console.log('Hello, World!');"
                />
              </div>
            </div>
            <div className="p-4 border-t border-[var(--border-color)] flex justify-end gap-2">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingSnippet(null);
                  setNewSnippet({
                    name: '',
                    description: '',
                    prefix: '',
                    code: '',
                    language: 'javascript',
                  });
                }}
                className="px-4 py-2 text-sm text-[var(--text-secondary)] hover:bg-[var(--bg-tertiary)] rounded transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingSnippet ? handleSaveEdit : handleAddSnippet}
                className="px-4 py-2 text-sm bg-[var(--accent-blue)] text-white rounded hover:bg-[var(--accent-blue)]/90 transition-colors"
              >
                {editingSnippet ? 'Save Changes' : 'Add Snippet'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
