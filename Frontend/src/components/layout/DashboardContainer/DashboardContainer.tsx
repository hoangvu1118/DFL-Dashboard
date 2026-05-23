import React from 'react';
import './DashboardContainer.css';

interface DashboardContainerProps {
  header: React.ReactNode;
  leftColumn: React.ReactNode;
  rightColumn: React.ReactNode;
  footer: React.ReactNode;
}

export const DashboardContainer: React.FC<DashboardContainerProps> = ({
  header,
  leftColumn,
  rightColumn,
  footer,
}) => {
  return (
    <div className="fedmed-dashboard-container">
      <header className="fedmed-dashboard-container__header">{header}</header>
      <div className="fedmed-dashboard-container__content">
        <section className="fedmed-dashboard-container__left">{leftColumn}</section>
        <aside className="fedmed-dashboard-container__right">{rightColumn}</aside>
      </div>
      <footer className="fedmed-dashboard-container__footer">{footer}</footer>
    </div>
  );
};
