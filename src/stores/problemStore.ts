import { create } from 'zustand';

export type ProblemSeverity = 'error' | 'warning' | 'info' | 'hint';

export interface Problem {
  id: string;
  severity: ProblemSeverity;
  message: string;
  file: string;
  line: number;
  column: number;
  source?: string;
}

interface ProblemState {
  problems: Problem[];
  addProblem: (problem: Omit<Problem, 'id'>) => void;
  clearProblems: () => void;
  clearFileProblems: (file: string) => void;
  getProblemsBySeverity: (severity: ProblemSeverity) => Problem[];
  getProblemsByFile: (file: string) => Problem[];
}

export const useProblemStore = create<ProblemState>((set, get) => ({
  problems: [],

  addProblem: (problem) => {
    set((state) => ({
      problems: [...state.problems, { ...problem, id: Math.random().toString(36).substring(2, 15) }],
    }));
  },

  clearProblems: () => set({ problems: [] }),

  clearFileProblems: (file) => {
    set((state) => ({
      problems: state.problems.filter((p) => p.file !== file),
    }));
  },

  getProblemsBySeverity: (severity) => {
    return get().problems.filter((p) => p.severity === severity);
  },

  getProblemsByFile: (file) => {
    return get().problems.filter((p) => p.file === file);
  },
}));
