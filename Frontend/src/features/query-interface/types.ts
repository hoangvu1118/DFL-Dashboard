
export type NodeScope = 'a' | 'b' | 'c';

export interface NodeScopeTab {
  id: NodeScope;
  label: string;
}

export interface PromptSuggestion {
  id: string;
  text: string;
}

export interface QueryState {
  scope: NodeScope;
  query: string;
  isLoading: boolean;
  statusText: string | null;
}
