import React from 'react';
import type { NodeScope, NodeScopeTab, PromptSuggestion } from '../types';
import { NodeScopeTabs } from './NodeScopeTabs';
import { PromptSuggestions } from './PromptSuggestions';
import { QueryInput } from './QueryInput';
import './QueryInterface.css';

interface QueryInterfaceProps {
  tabs: NodeScopeTab[];
  suggestions: PromptSuggestion[];
  selectedScope: NodeScope;
  onSelectScope: (scope: NodeScope) => void;
  query: string;
  onQueryChange: (val: string) => void;
  onSubmitQuery: () => void;
  statusText: string | null;
  isLoading?: boolean;
}

export const QueryInterface: React.FC<QueryInterfaceProps> = ({
  tabs,
  suggestions,
  selectedScope,
  onSelectScope,
  query,
  onQueryChange,
  onSubmitQuery,
  statusText,
  isLoading = false,
}) => {
  return (
    <div className="fedmed-query-interface">
      {/* Scope node tabs */}
      <NodeScopeTabs
        tabs={tabs}
        selectedScope={selectedScope}
        onSelectScope={onSelectScope}
      />

      {/* Main empty/query content state */}
      <div className="fedmed-query-interface__content">
        <div className="fedmed-query-interface__center-state">
          {/* Target Radar Icon */}
          <div className="fedmed-query-interface__target-icon">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.2"
              width="48"
              height="48"
            >
              <circle cx="12" cy="12" r="10" strokeDasharray="3 3" />
              <circle cx="12" cy="12" r="6" />
              <circle cx="12" cy="12" r="2" />
              <line x1="12" y1="2" x2="12" y2="6" />
              <line x1="12" y1="18" x2="12" y2="22" />
              <line x1="2" y1="12" x2="6" y2="12" />
              <line x1="18" y1="12" x2="22" y2="12" />
            </svg>
          </div>
          <p className="fedmed-query-interface__prompt-text">
            Select a node tab or use <span className="fedmed-query-interface__bold">All</span>
            <br />
            then ask a clinical question
          </p>
        </div>

        {/* Prompt suggestion chips */}
        <div className="fedmed-query-interface__suggestions-wrapper">
          <PromptSuggestions suggestions={suggestions} onSelectSuggestion={onQueryChange} />
        </div>
      </div>

      {/* Bottom control panel inputs */}
      <div className="fedmed-query-interface__controls">
        <QueryInput
          value={query}
          onChange={onQueryChange}
          onSubmit={onSubmitQuery}
          disabled={isLoading}
        />
      </div>
    </div>
  );
};
