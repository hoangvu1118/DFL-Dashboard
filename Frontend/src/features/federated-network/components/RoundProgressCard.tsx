import React from 'react';
import './RoundProgressCard.css';

interface RoundProgressCardProps {
  currentRound: number;
  totalRounds: number;
}

export const RoundProgressCard: React.FC<RoundProgressCardProps> = ({
  currentRound,
  totalRounds,
}) => {
  return (
    <div className="fedmed-round-badge">
      <span className="fedmed-round-badge__label">Round {currentRound} / {totalRounds}</span>
    </div>
  );
};
