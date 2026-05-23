import React from 'react';
import { cn } from '../../../lib/cn';
import './Card.css';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'node-a' | 'node-b' | 'node-c' | 'aggregator';
  interactive?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className,
  variant = 'default',
  interactive = false,
  ...props
}) => {
  return (
    <div
      className={cn(
        'fedmed-card',
        `fedmed-card--${variant}`,
        interactive && 'fedmed-card--interactive',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};
