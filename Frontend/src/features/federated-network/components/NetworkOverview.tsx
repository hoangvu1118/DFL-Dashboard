import React from 'react';
import type { HospitalNode, AggregatorNodeData } from '../types';
import { HospitalNodeCard } from './HospitalNodeCard';
import './NetworkOverview.css';

interface NetworkOverviewProps {
  nodes: HospitalNode[];
  aggregator: AggregatorNodeData;
  selectedNodeId: string | null;
  onSelectNode: (nodeId: string | null) => void;
}

export const NetworkOverview: React.FC<NetworkOverviewProps> = ({
  nodes,
  selectedNodeId,
  onSelectNode,
}) => {

  const nodePositions: Record<string, { x: number; y: number }> = {
    'NODE-A': { x: 43, y: 3 },
    'NODE-B': { x: 15, y: 60 },
    'NODE-C': { x: 70, y: 60 },
  };

  return (
    <div className="fedmed-network-overview">
      {/* Visual Clinical Grid overlay */}
      <div className="bg-grid" />

      {/* Hospital Nodes absolute placement */}
      {nodes.map((node) => {
        const pos = nodePositions[node.id];
        if (!pos) return null;

        // Visual offset to center the 220px wide / 160px high cards
        const style: React.CSSProperties = {
          left: `${pos.x}%`,
          top: `${pos.y}%`,
          transform: 'translate(-50%, -50%)',
        };

        return (
          <div key={node.id} style={style} className="fedmed-network-overview__node-wrapper">
            <HospitalNodeCard
              node={node}
              active={selectedNodeId === node.id}
              onClick={() => onSelectNode(node.id)}
            />
          </div>
        );
      })}
    </div>
  );
};
