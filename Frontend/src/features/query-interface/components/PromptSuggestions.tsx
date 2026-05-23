import React from 'react';
import type { PromptSuggestion } from '../types';
import { Pill } from '../../../components/ui/Pill/Pill';
import './PromptSuggestions.css';

interface PromptSuggestionsProps {
  suggestions: PromptSuggestion[];
  onSelectSuggestion: (text: string) => void;
}

export const PromptSuggestions: React.FC<PromptSuggestionsProps> = ({
  suggestions,
  onSelectSuggestion,
}) => {
  return (
    <div className="fedmed-suggestions">
      <div className="fedmed-suggestions__list">
        {suggestions.map((suggestion) => (
          <Pill key={suggestion.id} onClick={() => onSelectSuggestion(suggestion.text)}>
            {suggestion.text}
          </Pill>
        ))}
      </div>
    </div>
  );
};
