import React from 'react';
import type { Metric } from '../types';
import { StatTile } from '../../../components/ui/StatTile/StatTile';
import './MetricsGrid.css';

interface MetricsGridProps {
  metrics: Metric[];
}

export const MetricsGrid: React.FC<MetricsGridProps> = ({ metrics }) => {
  return (
    <div className="fedmed-metrics-grid">
      {metrics.map((metric) => (
        <StatTile
          key={metric.id}
          label={metric.label}
          value={metric.value}
          accent={metric.accent}
          mono={metric.mono}
        />
      ))}
    </div>
  );
};
