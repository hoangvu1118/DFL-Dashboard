import React from 'react';
import { cn } from '../../../lib/cn';
import './StatTile.css';

interface StatTileProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string;
  value: string | number;
  accent?: string;
  mono?: boolean;
}

export const StatTile: React.FC<StatTileProps> = ({
  label,
  value,
  accent = 'default',
  mono = false,
  className,
  ...props
}) => {
  return (
    <div className={cn('fedmed-stat-tile', `fedmed-stat-tile--${accent}`, className)} {...props}>
      <span className="fedmed-stat-tile__label">{label}</span>
      <span className={cn('fedmed-stat-tile__value', mono && 'fedmed-stat-tile__value--mono')}>
        {value}
      </span>
    </div>
  );
};
