import { create } from 'zustand';

export interface Snippet {
  id: string;
  name: string;
  description: string;
  prefix: string;
  code: string;
  language: string;
  scope?: string[];
}

interface SnippetState {
  snippets: Snippet[];
  addSnippet: (snippet: Omit<Snippet, 'id'>) => void;
  removeSnippet: (id: string) => void;
  updateSnippet: (id: string, snippet: Partial<Snippet>) => void;
  getSnippetsByLanguage: (language: string) => Snippet[];
  getSnippetByPrefix: (prefix: string, language: string) => Snippet | undefined;
  importSnippets: (snippets: Snippet[]) => void;
  exportSnippets: () => Snippet[];
}

const defaultSnippets: Omit<Snippet, 'id'>[] = [
  {
    name: 'Log to Console',
    description: 'Print a message to the browser console',
    prefix: 'log',
    code: 'console.log(${1:message});',
    language: 'javascript',
    scope: ['javascript', 'typescript'],
  },
  {
    name: 'Console Error',
    description: 'Print an error message to the browser console',
    prefix: 'error',
    code: 'console.error(${1:message});',
    language: 'javascript',
    scope: ['javascript', 'typescript'],
  },
  {
    name: 'Console Warning',
    description: 'Print a warning message to the browser console',
    prefix: 'warn',
    code: 'console.warn(${1:message});',
    language: 'javascript',
    scope: ['javascript', 'typescript'],
  },
  {
    name: 'Function Declaration',
    description: 'Declare a new function',
    prefix: 'fn',
    code: 'function ${1:name}(${2:params}) {\n  ${3:// code}\n}',
    language: 'javascript',
    scope: ['javascript', 'typescript'],
  },
  {
    name: 'Arrow Function',
    description: 'Create an arrow function',
    prefix: 'afn',
    code: '(${1:params}) => {\n  ${2:// code}\n}',
    language: 'javascript',
    scope: ['javascript', 'typescript'],
  },
  {
    name: 'If Statement',
    description: 'Create an if statement',
    prefix: 'if',
    code: 'if (${1:condition}) {\n  ${2:// code}\n}',
    language: 'javascript',
    scope: ['javascript', 'typescript'],
  },
  {
    name: 'For Loop',
    description: 'Create a for loop',
    prefix: 'for',
    code: 'for (let ${1:i} = 0; ${1:i} < ${2:length}; ${1:i}++) {\n  ${3:// code}\n}',
    language: 'javascript',
    scope: ['javascript', 'typescript'],
  },
  {
    name: 'For Each',
    description: 'Iterate over an array',
    prefix: 'foreach',
    code: '${1:array}.forEach((${2:item}) => {\n  ${3:// code}\n});',
    language: 'javascript',
    scope: ['javascript', 'typescript'],
  },
  {
    name: 'Map',
    description: 'Create a new array by mapping',
    prefix: 'map',
    code: '${1:array}.map((${2:item}) => {\n  ${3:// code}\n});',
    language: 'javascript',
    scope: ['javascript', 'typescript'],
  },
  {
    name: 'Filter',
    description: 'Filter an array',
    prefix: 'filter',
    code: '${1:array}.filter((${2:item}) => {\n  ${3:// condition}\n});',
    language: 'javascript',
    scope: ['javascript', 'typescript'],
  },
  {
    name: 'Timeout',
    description: 'Create a setTimeout',
    prefix: 'timeout',
    code: 'setTimeout(() => {\n  ${1:// code}\n}, ${2:1000});',
    language: 'javascript',
    scope: ['javascript', 'typescript'],
  },
  {
    name: 'Interval',
    description: 'Create a setInterval',
    prefix: 'interval',
    code: 'setInterval(() => {\n  ${1:// code}\n}, ${2:1000});',
    language: 'javascript',
    scope: ['javascript', 'typescript'],
  },
  {
    name: 'Fetch',
    description: 'Fetch data from an API',
    prefix: 'fetch',
    code: 'fetch(${1:url})\n  .then(response => response.json())\n  .then(data => {\n    ${2:// handle data}\n  })\n  .catch(error => {\n    console.error(${3:error});\n  });',
    language: 'javascript',
    scope: ['javascript', 'typescript'],
  },
  {
    name: 'Async/Await',
    description: 'Create an async function with await',
    prefix: 'async',
    code: 'async function ${1:name}() {\n  const ${2:result} = await ${3:promise};\n}',
    language: 'javascript',
    scope: ['javascript', 'typescript'],
  },
  {
    name: 'TypeScript Interface',
    description: 'Declare a TypeScript interface',
    prefix: 'interface',
    code: 'interface ${1:Name} {\n  ${2:property}: ${3:type};\n}',
    language: 'typescript',
    scope: ['typescript'],
  },
  {
    name: 'TypeScript Type',
    description: 'Declare a TypeScript type alias',
    prefix: 'type',
    code: 'type ${1:Name} = ${2:type};',
    language: 'typescript',
    scope: ['typescript'],
  },
  {
    name: 'HTML Template',
    description: 'Basic HTML document structure',
    prefix: 'html',
    code: '<!DOCTYPE html>\n<html lang="en">\n<head>\n  <meta charset="UTF-8">\n  <meta name="viewport" content="width=device-width, initial-scale=1.0">\n  <title>${1:Document}</title>\n</head>\n<body>\n  ${2:<!-- content -->}\n</body>\n</html>',
    language: 'html',
    scope: ['html'],
  },
  {
    name: 'HTML Div',
    description: 'Create a div element',
    prefix: 'div',
    code: '<div>${1:content}</div>',
    language: 'html',
    scope: ['html'],
  },
  {
    name: 'HTML Link',
    description: 'Create an anchor tag',
    prefix: 'a',
    code: '<a href="${1:#}">${2:Link Text}</a>',
    language: 'html',
    scope: ['html'],
  },
  {
    name: 'Python Function',
    description: 'Declare a Python function',
    prefix: 'def',
    code: 'def ${1:name}(${2:params}):\n    ${3:pass}',
    language: 'python',
    scope: ['python'],
  },
  {
    name: 'Python Class',
    description: 'Declare a Python class',
    prefix: 'class',
    code: 'class ${1:Name}:\n    def __init__(self, ${2:params}):\n        ${3:pass}',
    language: 'python',
    scope: ['python'],
  },
  {
    name: 'Python For Loop',
    description: 'Create a for loop in Python',
    prefix: 'for',
    code: 'for ${1:item} in ${2:iterable}:\n    ${3:pass}',
    language: 'python',
    scope: ['python'],
  },
  {
    name: 'Python If Statement',
    description: 'Create an if statement in Python',
    prefix: 'if',
    code: 'if ${1:condition}:\n    ${2:pass}',
    language: 'python',
    scope: ['python'],
  },
  {
    name: 'CSS Class',
    description: 'Create a CSS class',
    prefix: 'cls',
    code: '.${1:class-name} {\n  ${2:/* styles */}\n}',
    language: 'css',
    scope: ['css'],
  },
  {
    name: 'CSS Flexbox',
    description: 'Create a flex container',
    prefix: 'flex',
    code: 'display: flex;\nflex-direction: ${1:row};\njustify-content: ${2:center};\nalign-items: ${3:center};',
    language: 'css',
    scope: ['css'],
  },
];

const loadSnippets = (): Snippet[] => {
  const saved = localStorage.getItem('cloud-code-snippets');
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      return defaultSnippets.map((s) => ({ ...s, id: Math.random().toString(36).substring(2, 15) }));
    }
  }
  return defaultSnippets.map((s) => ({ ...s, id: Math.random().toString(36).substring(2, 15) }));
};

export const useSnippetStore = create<SnippetState>((set, get) => ({
  snippets: loadSnippets(),

  addSnippet: (snippet) => {
    const newSnippet = { ...snippet, id: Math.random().toString(36).substring(2, 15) };
    set((state) => {
      const newSnippets = [...state.snippets, newSnippet];
      localStorage.setItem('cloud-code-snippets', JSON.stringify(newSnippets));
      return { snippets: newSnippets };
    });
  },

  removeSnippet: (id) => {
    set((state) => {
      const newSnippets = state.snippets.filter((s) => s.id !== id);
      localStorage.setItem('cloud-code-snippets', JSON.stringify(newSnippets));
      return { snippets: newSnippets };
    });
  },

  updateSnippet: (id, snippet) => {
    set((state) => {
      const newSnippets = state.snippets.map((s) =>
        s.id === id ? { ...s, ...snippet } : s
      );
      localStorage.setItem('cloud-code-snippets', JSON.stringify(newSnippets));
      return { snippets: newSnippets };
    });
  },

  getSnippetsByLanguage: (language) => {
    return get().snippets.filter(
      (s) => s.language === language || (s.scope && s.scope.includes(language))
    );
  },

  getSnippetByPrefix: (prefix, language) => {
    return get().snippets.find(
      (s) =>
        s.prefix === prefix &&
        (s.language === language || (s.scope && s.scope.includes(language)))
    );
  },

  importSnippets: (snippets) => {
    set((state) => {
      const newSnippets = [...state.snippets, ...snippets];
      localStorage.setItem('cloud-code-snippets', JSON.stringify(newSnippets));
      return { snippets: newSnippets };
    });
  },

  exportSnippets: () => {
    return get().snippets;
  },
}));
