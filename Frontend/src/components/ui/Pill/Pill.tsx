import React from 'react';
import { cn } from '../../../lib/cn';
import './Pill.css';

interface PillProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  active?: boolean;
}

export const Pill: React.FC<PillProps> = ({ children, active = false, className, ...props }) => {
  return (
    <button
      className={cn('fedmed-pill', active && 'fedmed-pill--active', className)}
      type="button"
      {...props}
    >
      {children}
    </button>
  );
};
