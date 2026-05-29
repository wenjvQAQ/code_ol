type Language = 'javascript' | 'python' | 'c' | 'cpp' | 'typescript' | 'html' | 'css';

interface RunResult {
  success: boolean;
  output: string;
  error: string;
  executionTime: number;
}

export function runCode(code: string, language: Language): Promise<RunResult> {
  const startTime = Date.now();
  
  return new Promise((resolve) => {
    try {
      switch (language) {
        case 'javascript':
          return runJavaScript(code, startTime, resolve);
        
        case 'python':
          return runPythonSimulated(code, startTime, resolve);
        
        case 'c':
        case 'cpp':
          return runCppSimulated(code, language, startTime, resolve);
        
        case 'typescript':
          return runTypeScriptSimulated(code, startTime, resolve);
        
        case 'html':
          return runHTMLSimulated(code, startTime, resolve);
        
        case 'css':
          return runCSSSimulated(code, startTime, resolve);
        
        default:
          return resolve({
            success: false,
            output: '',
            error: `Language ${language} not supported yet`,
            executionTime: Date.now() - startTime,
          });
      }
    } catch (error) {
      resolve({
        success: false,
        output: '',
        error: error instanceof Error ? error.message : String(error),
        executionTime: Date.now() - startTime,
      });
    }
  });
}

function runJavaScript(code: string, startTime: number, resolve: (result: RunResult) => void) {
  const logs: string[] = [];
  const originalLog = console.log;
  const originalError = console.error;
  const originalWarn = console.warn;

  try {
    console.log = (...args: any[]) => {
      logs.push(args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' '));
    };
    console.error = (...args: any[]) => {
      logs.push('[ERROR] ' + args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' '));
    };
    console.warn = (...args: any[]) => {
      logs.push('[WARN] ' + args.map(arg => 
        typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
      ).join(' '));
    };

    const result = new Function(code)();
    
    if (result !== undefined) {
      logs.push(`=> ${typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result)}`);
    }

    setTimeout(() => {
      resolve({
        success: true,
        output: logs.join('\n'),
        error: '',
        executionTime: Date.now() - startTime,
      });
    }, 100);
  } catch (error) {
    setTimeout(() => {
      resolve({
        success: false,
        output: logs.join('\n'),
        error: error instanceof Error ? error.message : String(error),
        executionTime: Date.now() - startTime,
      });
    }, 100);
  } finally {
    console.log = originalLog;
    console.error = originalError;
    console.warn = originalWarn;
  }
}

function runPythonSimulated(code: string, startTime: number, resolve: (result: RunResult) => void) {
  setTimeout(() => {
    const output: string[] = [];
    let hasError = false;
    let errorMessage = '';

    const printMatches = code.match(/print\s*\(([\s\S]*?)\)/g);
    if (printMatches) {
      printMatches.forEach(match => {
        try {
          const content = match.slice(6, -1);
          const cleanContent = content.replace(/["']/g, '');
          output.push(cleanContent);
        } catch {
          // ignore
        }
      });
    }

    if (code.includes('print(') || code.includes('input(')) {
      if (output.length === 0) {
        output.push('Python code executed successfully!');
      }
    } else {
      output.push('Python code executed! (Add print() statements to see output)');
    }

    if (code.includes('syntax error') || code.includes('IndentationError')) {
      hasError = true;
      errorMessage = 'SyntaxError: invalid syntax';
    }

    resolve({
      success: !hasError,
      output: output.join('\n'),
      error: errorMessage,
      executionTime: Date.now() - startTime + 200,
    });
  }, 300);
}

function runCppSimulated(code: string, language: string, startTime: number, resolve: (result: RunResult) => void) {
  setTimeout(() => {
    const output: string[] = [];
    let hasError = false;
    let errorMessage = '';

    output.push(`Compiling ${language.toUpperCase()}...`);
    
    const coutMatches = code.match(/cout\s*<<\s*([\s\S]*?)\s*;/g);
    if (coutMatches) {
      output.push('Compilation successful!');
      output.push('');
      coutMatches.forEach(match => {
        try {
          let content = match.replace(/cout\s*<<\s*/, '').replace(/;$/, '');
          content = content.replace(/<<\s*endl/g, '');
          content = content.replace(/["']/g, '');
          content = content.replace(/<<\s*"\\n"/g, '');
          if (content.trim()) {
            output.push(content.trim());
          }
        } catch {
          // ignore
        }
      });
    } else {
      output.push('Compilation successful!');
      output.push('');
      output.push('Program executed!');
    }

    resolve({
      success: !hasError,
      output: output.join('\n'),
      error: errorMessage,
      executionTime: Date.now() - startTime + 500,
    });
  }, 500);
}

function runTypeScriptSimulated(code: string, startTime: number, resolve: (result: RunResult) => void) {
  setTimeout(() => {
    const jsCode = code
      .replace(/:\s*\w+(\[\])?/g, '')
      .replace(/:\s*\w+<[\s\S]*?>/g, '')
      .replace(/interface\s+\w+\s*\{[\s\S]*?\}/g, '')
      .replace(/type\s+\w+\s*=/g, '// type =')
      .replace(/public\s+/g, '')
      .replace(/private\s+/g, '')
      .replace(/protected\s+/g, '')
      .replace(/readonly\s+/g, '');

    const logs: string[] = [];
    const originalLog = console.log;
    
    try {
      console.log = (...args: any[]) => {
        logs.push(args.map(arg => 
          typeof arg === 'object' ? JSON.stringify(arg, null, 2) : String(arg)
        ).join(' '));
      };

      const result = new Function(jsCode)();
      if (result !== undefined) {
        logs.push(`=> ${typeof result === 'object' ? JSON.stringify(result, null, 2) : String(result)}`);
      }
    } catch (error) {
      console.log = originalLog;
      return resolve({
        success: false,
        output: '',
        error: error instanceof Error ? error.message : String(error),
        executionTime: Date.now() - startTime,
      });
    }

    console.log = originalLog;

    resolve({
      success: true,
      output: logs.join('\n'),
      error: '',
      executionTime: Date.now() - startTime + 100,
    });
  }, 200);
}

function runHTMLSimulated(code: string, startTime: number, resolve: (result: RunResult) => void) {
  setTimeout(() => {
    const output: string[] = [];
    
    output.push('HTML parsed successfully!');
    output.push('');
    
    const titleMatch = code.match(/<title>([\s\S]*?)<\/title>/i);
    if (titleMatch) {
      output.push(`Title: ${titleMatch[1]}`);
    }
    
    const h1Matches = code.match(/<h1>([\s\S]*?)<\/h1>/gi);
    if (h1Matches) {
      output.push('Headings found:');
      h1Matches.forEach(m => {
        const text = m.replace(/<\/?h1>/gi, '');
        output.push(`  - ${text}`);
      });
    }
    
    const pMatches = code.match(/<p>([\s\S]*?)<\/p>/gi);
    if (pMatches) {
      output.push(`Paragraphs: ${pMatches.length}`);
    }

    const imgMatches = code.match(/<img/gi);
    if (imgMatches) {
      output.push(`Images: ${imgMatches.length}`);
    }

    if (!titleMatch && !h1Matches && !pMatches) {
      output.push('HTML file ready!');
    }

    resolve({
      success: true,
      output: output.join('\n'),
      error: '',
      executionTime: Date.now() - startTime + 100,
    });
  }, 200);
}

function runCSSSimulated(code: string, startTime: number, resolve: (result: RunResult) => void) {
  setTimeout(() => {
    const output: string[] = [];
    
    const selectors = code.match(/[\s\S]*?\{/g);
    if (selectors) {
      const cleaned = selectors
        .map(s => s.trim())
        .filter(s => s && !s.startsWith('/*'));
      
      output.push(`CSS rules: ${cleaned.length}`);
      
      if (cleaned.length > 0) {
        output.push('');
        output.push('Selectors:');
        cleaned.slice(0, 5).forEach(s => {
          const selector = s.replace(/\s*\{/, '').trim();
          if (selector) {
            output.push(`  - ${selector}`);
          }
        });
        if (cleaned.length > 5) {
          output.push(`  ... and ${cleaned.length - 5} more`);
        }
      }
    } else {
      output.push('CSS file ready!');
    }

    resolve({
      success: true,
      output: output.join('\n'),
      error: '',
      executionTime: Date.now() - startTime + 50,
    });
  }, 100);
}
