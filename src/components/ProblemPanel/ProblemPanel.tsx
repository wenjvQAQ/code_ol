import { useEffect, useState } from 'react';
import { AlertCircle, AlertTriangle, Info, XCircle, Filter } from 'lucide-react';
import { useProblemStore, ProblemSeverity } from '@/stores/problemStore';

const severityIcon = {
  error: <XCircle className="w-4 h-4 text-[var(--accent-red)]" />,
  warning: <AlertTriangle className="w-4 h-4 text-[var(--accent-orange)]" />,
  info: <Info className="w-4 h-4 text-[var(--accent-blue)]" />,
  hint: <AlertCircle className="w-4 h-4 text-[var(--text-secondary)]" />,
};

export default function ProblemPanel() {
  const { problems, clearProblems } = useProblemStore();
  const [filter, setFilter] = useState<ProblemSeverity | 'all'>('all');
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const filteredProblems = filter === 'all' 
    ? problems 
    : problems.filter(p => p.severity === filter);

  const errorCount = problems.filter(p => p.severity === 'error').length;
  const warningCount = problems.filter(p => p.severity === 'warning').length;
  const infoCount = problems.filter(p => p.severity === 'info').length;

  if (problems.length === 0) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-[var(--text-secondary)]">
        <AlertCircle className="w-8 h-8 mb-2 opacity-50" />
        <p className="text-sm">没有检测到问题</p>
        <p className="text-xs mt-1">打开文件后将显示诊断信息</p>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="flex items-center justify-between px-3 py-2 border-b border-[var(--border-color)] bg-[var(--bg-tertiary)]/30">
        <div className="flex items-center gap-4 text-sm">
          {errorCount > 0 && (
            <div className="flex items-center gap-1 text-[var(--accent-red)]">
              <XCircle className="w-3.5 h-3.5" />
              <span>{errorCount}</span>
            </div>
          )}
          {warningCount > 0 && (
            <div className="flex items-center gap-1 text-[var(--accent-orange)]">
              <AlertTriangle className="w-3.5 h-3.5" />
              <span>{warningCount}</span>
            </div>
          )}
          {infoCount > 0 && (
            <div className="flex items-center gap-1 text-[var(--accent-blue)]">
              <Info className="w-3.5 h-3.5" />
              <span>{infoCount}</span>
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <div className="relative">
            <Filter className="w-3.5 h-3.5 text-[var(--text-secondary)] absolute left-2 top-1/2 -translate-y-1/2" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as any)}
              className="pl-7 pr-2 py-1 text-xs bg-[var(--bg-primary)] border border-[var(--border-color)] rounded text-[var(--text-primary)] appearance-none cursor-pointer"
            >
              <option value="all">全部</option>
              <option value="error">错误</option>
              <option value="warning">警告</option>
              <option value="info">信息</option>
            </select>
          </div>

          <button
            onClick={clearProblems}
            className="p-1 hover:bg-[var(--bg-tertiary)] rounded transition-colors"
            title="清除所有问题"
          >
            <XCircle className="w-3.5 h-3.5 text-[var(--text-secondary)]" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {filteredProblems.length === 0 ? (
          <div className="p-4 text-center text-[var(--text-secondary)] text-sm">
            没有符合筛选条件的问题
          </div>
        ) : (
          <div className="divide-y divide-[var(--border-color)]">
            {filteredProblems.map((problem) => (
              <div 
                key={problem.id} 
                className="px-3 py-2 hover:bg-[var(--bg-tertiary)]/30 transition-colors cursor-pointer"
              >
                <div className="flex items-start gap-2">
                  <div className="mt-0.5 flex-shrink-0">
                    {severityIcon[problem.severity]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm text-[var(--text-primary)]">
                      {problem.message}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs text-[var(--text-secondary)]">
                      <span>{problem.file}</span>
                      <span>:</span>
                      <span>{problem.line}:{problem.column}</span>
                      {problem.source && (
                        <>
                          <span>•</span>
                          <span className="text-[var(--text-secondary)]">{problem.source}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
