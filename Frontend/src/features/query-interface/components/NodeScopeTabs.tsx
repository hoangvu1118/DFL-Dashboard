import React from 'react';
import type { NodeScope, NodeScopeTab } from '../types';
import { cn } from '../../../lib/cn';
import './NodeScopeTabs.css';

interface NodeScopeTabsProps {
  tabs: NodeScopeTab[];
  selectedScope: NodeScope;
  onSelectScope: (scope: NodeScope) => void;
}

export const NodeScopeTabs: React.FC<NodeScopeTabsProps> = ({
  tabs,
  selectedScope,
  onSelectScope,
}) => {
  return (
    <div className="fedmed-scope-tabs" role="tablist" aria-label="Query node scope">
      {tabs.map((tab) => {
        const isActive = selectedScope === tab.id;
        let dotColor = 'rgba(255,255,255,0.3)';

        if (tab.id === 'a') dotColor = 'var(--color-teal-400)';
        else if (tab.id === 'b') dotColor = 'var(--color-orange-400)';
        else if (tab.id === 'c') dotColor = 'var(--color-purple-400)';

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            aria-controls={`tabpanel-${tab.id}`}
            id={`tab-${tab.id}`}
            className={cn('fedmed-scope-tab', isActive && 'fedmed-scope-tab--active')}
            onClick={() => onSelectScope(tab.id)}
          >
            <span className="fedmed-scope-tab__dot" style={{ backgroundColor: dotColor }} />
            <span className="fedmed-scope-tab__label">{tab.label}</span>
            {isActive && <div className="fedmed-scope-tab__indicator" />}
          </button>
        );
      })}
    </div>
  );
};
