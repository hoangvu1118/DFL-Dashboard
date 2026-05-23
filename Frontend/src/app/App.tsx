import React, { useState, useEffect } from 'react';
import { AppShell } from '../components/layout/AppShell/AppShell';
import { DashboardContainer } from '../components/layout/DashboardContainer/DashboardContainer';
import { NetworkOverview } from '../features/federated-network/components/NetworkOverview';
import { RoundProgressCard } from '../features/federated-network/components/RoundProgressCard';
import { MetricsGrid } from '../features/metrics/components/MetricsGrid';
import { QueryInterface } from '../features/query-interface/components/QueryInterface';

// Typed Seed Data
import { SEED_NODES, SEED_AGGREGATOR } from '../features/federated-network/data';
import { SEED_METRICS } from '../features/metrics/data';
import { SCOPE_TABS, PROMPT_SUGGESTIONS } from '../features/query-interface/data';
import type { HospitalNode } from '../features/federated-network/types';
import type { NodeScope } from '../features/query-interface/types';

import './App.css';

const App: React.FC = () => {
  // Nodes, Aggregator and selected scope states
  const [nodes] = useState<HospitalNode[]>(SEED_NODES);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

  const [selectedScope, setSelectedScope] = useState<NodeScope>('all');

  // Query Interface state management
  const [query, setQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [statusText, setStatusText] = useState<string | null>(null);

  // Sync selectedNodeId and selectedScope
  const handleSelectNode = (nodeId: string | null) => {
    setSelectedNodeId(nodeId);
    if (nodeId === 'NODE-A') setSelectedScope('a');
    else if (nodeId === 'NODE-B') setSelectedScope('b');
    else if (nodeId === 'NODE-C') setSelectedScope('c');
    else setSelectedScope('all');
  };

  const handleSelectScope = (scope: NodeScope) => {
    setSelectedScope(scope);
    if (scope === 'a') setSelectedNodeId('NODE-A');
    else if (scope === 'b') setSelectedNodeId('NODE-B');
    else if (scope === 'c') setSelectedNodeId('NODE-C');
    else setSelectedNodeId(null);
  };

  // Sync status bar based on selectedScope
  useEffect(() => {
    if (selectedScope === 'all') {
      setStatusText('All Consortium Nodes');
    } else {
      const activeNode = nodes.find(
        (n) => n.id === `NODE-${selectedScope.toUpperCase()}`
      );
      if (activeNode) {
        setStatusText(`${activeNode.id} · ${activeNode.hospitalName}`);
      } else {
        setStatusText(null);
      }
    }
  }, [selectedScope, nodes]);

  // Handle Query submission
  const handleSubmitQuery = () => {
    if (!query.trim()) return;

    setIsLoading(true);
    const originalText = statusText;
    setStatusText('transmitting secure inference parameters...');

    // Simulate clinical model inference callback
    setTimeout(() => {
      setIsLoading(false);
      setStatusText(`response received from ${originalText}`);
      setQuery('');

      // Auto-reset status after a few seconds back to current node focus
      setTimeout(() => {
        if (selectedScope === 'all') {
          setStatusText('All Consortium Nodes');
        } else {
          const activeNode = nodes.find(
            (n) => n.id === `NODE-${selectedScope.toUpperCase()}`
          );
          if (activeNode) {
            setStatusText(`${activeNode.id} · ${activeNode.hospitalName}`);
          }
        }
      }, 4000);
    }, 1500);
  };

  // Header content structure
  const headerContent = (
    <div className="fedmed-header">
      <div className="fedmed-header__branding">
        {/* Dynamic Medical Federated Logo Mark */}
        <div className="fedmed-header__logo">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <circle cx="12" cy="12" r="10" />
            <circle cx="12" cy="12" r="4" />
            <path d="M12 2v4M12 18v4M2 12h4M18 12h4" />
          </svg>
        </div>
        <div className="fedmed-header__titles">
          <h1 className="fedmed-header__title">FedMed — Federated Learning Network</h1>
          <p className="fedmed-header__subtitle">
            Decentralized · Privacy-Preserving · Hospital Consortium
          </p>
        </div>
      </div>
      <div className="fedmed-header__actions">
        <RoundProgressCard currentRound={4} totalRounds={10} />
      </div>
    </div>
  );

  // Left Column content structure (Network visual)
  const leftColumnContent = (
    <NetworkOverview
      nodes={nodes}
      aggregator={SEED_AGGREGATOR}
      selectedNodeId={selectedNodeId}
      onSelectNode={handleSelectNode}
    />
  );

  // Right Column content structure (Model queries)
  const rightColumnContent = (
    <QueryInterface
      tabs={SCOPE_TABS}
      suggestions={PROMPT_SUGGESTIONS}
      selectedScope={selectedScope}
      onSelectScope={handleSelectScope}
      query={query}
      onQueryChange={setQuery}
      onSubmitQuery={handleSubmitQuery}
      statusText={statusText}
      isLoading={isLoading}
    />
  );

  // Footer content structure (Consortium KPIs)
  const footerContent = <MetricsGrid metrics={SEED_METRICS} />;

  return (
    <AppShell>
      <DashboardContainer
        header={headerContent}
        leftColumn={leftColumnContent}
        rightColumn={rightColumnContent}
        footer={footerContent}
      />
    </AppShell>
  );
};

export default App;
