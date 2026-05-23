import React from 'react';
import { cn } from '../../../lib/cn';
import './SectionHeader.css';

interface SectionHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  subtitle,
  icon,
  className,
  ...props
}) => {
  return (
    <div className={cn('fedmed-section-header', className)} {...props}>
      {icon && <div className="fedmed-section-header__icon">{icon}</div>}
      <div className="fedmed-section-header__content">
        <h2 className="fedmed-section-header__title">{title}</h2>
        {subtitle && <p className="fedmed-section-header__subtitle">{subtitle}</p>}
      </div>
    </div>
  );
};
