import React from 'react';
import { cn } from '../../../lib/cn';
import type { NodeStatus } from '../../../features/federated-network/types';
import './Badge.css';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  status: NodeStatus;
}

export const Badge: React.FC<BadgeProps> = ({ status, className, ...props }) => {
  return (
    <span className={cn('fedmed-badge', `fedmed-badge--${status}`, className)} {...props}>
      <span className="fedmed-badge__dot" />
      <span className="fedmed-badge__text">{status}</span>
    </span>
  );
};
