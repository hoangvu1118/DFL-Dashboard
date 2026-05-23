import React from 'react';
import type { HospitalNode } from '../types';
import { Card } from '../../../components/ui/Card/Card';
import { Badge } from '../../../components/ui/Badge/Badge';
import { formatNumber } from '../../../lib/format';
import './HospitalNodeCard.css';

interface HospitalNodeCardProps {
  node: HospitalNode;
  active?: boolean;
  onClick?: () => void;
}

export const HospitalNodeCard: React.FC<HospitalNodeCardProps> = ({
  node,
  active = false,
  onClick,
}) => {
  const cardVariant = node.id.toLowerCase() as 'node-a' | 'node-b' | 'node-c';

  return (
    <Card
      variant={cardVariant}
      interactive
      className={`fedmed-node-card ${active ? 'fedmed-node-card--active' : ''}`}
      onClick={onClick}
      style={{
        transform: active ? 'scale(1.02)' : 'none',
      }}
    >
      <div className="fedmed-node-card__header">
        <div className="fedmed-node-card__identity">
          <div className="fedmed-node-card__icon-wrapper" style={{ color: node.accentColor }}>
            <svg
              className="fedmed-node-card__icon"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              {/* Clinical device / server node icon */}
              <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
              <line x1="8" y1="21" x2="16" y2="21" />
              <line x1="12" y1="17" x2="12" y2="21" />
            </svg>
          </div>
          <div className="fedmed-node-card__title-group">
            <h3 className="fedmed-node-card__code">{node.id}</h3>
            <p className="fedmed-node-card__name">{node.hospitalName}</p>
          </div>
        </div>
      </div>

      <div className="fedmed-node-card__status-row">
        <Badge status={node.status} />
      </div>

      <div className="fedmed-node-card__metrics">
        <div className="fedmed-node-card__metric">
          <span className="fedmed-node-card__metric-label">round</span>
          <span className="fedmed-node-card__metric-value fedmed-node-card__metric-value--mono">
            {String(node.round).padStart(2, '0')}
          </span>
        </div>
        <div className="fedmed-node-card__metric">
          <span className="fedmed-node-card__metric-label">samples</span>
          <span className="fedmed-node-card__metric-value fedmed-node-card__metric-value--mono">
            {formatNumber(node.samples)}
          </span>
        </div>
        <div className="fedmed-node-card__metric">
          <span className="fedmed-node-card__metric-label">timestamp</span>
          <span className="fedmed-node-card__metric-value fedmed-node-card__metric-value--mono">
            {node.timestamp}
          </span>
        </div>
      </div>
    </Card>
  );
};
