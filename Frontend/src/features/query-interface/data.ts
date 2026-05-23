import type { NodeScopeTab, PromptSuggestion } from './types';

export const SCOPE_TABS: NodeScopeTab[] = [
  { id: 'a', label: 'A' },
  { id: 'b', label: 'B' },
  { id: 'c', label: 'C' },
];

export const PROMPT_SUGGESTIONS: PromptSuggestion[] = [
  { id: 's1', text: 'Diagnose chest pain differential' },
  { id: 's2', text: 'Interpret HbA1c = 8.2%' },
  { id: 's3', text: 'Sepsis early warning signs' },
  { id: 's4', text: 'Drug interaction: warfarin + aspirin' },
];
