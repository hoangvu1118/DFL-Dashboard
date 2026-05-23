import React from 'react';
import './AppShell.css';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  return (
    <div className="fedmed-app-shell">
      <main className="fedmed-app-shell__main">{children}</main>
    </div>
  );
};
