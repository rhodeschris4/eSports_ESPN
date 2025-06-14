import React from 'react';

interface ScoreDisplayProps {
  team1: string;
  team2: string;
  team1Score?: number;
  team2Score?: number;
}

const ScoreDisplay: React.FC<ScoreDisplayProps> = ({ team1, team2, team1Score, team2Score }) => {
  return (
    <div className="flex items-center justify-center gap-4 bg-dark rounded p-2">
      <div className="flex flex-col items-center">
        <span className="font-bold text-white">{team1}</span>
        <span className="text-2xl text-green-400 font-mono">{team1Score ?? '-'}</span>
      </div>
      <span className="text-gray-400 font-bold text-lg">vs</span>
      <div className="flex flex-col items-center">
        <span className="font-bold text-white">{team2}</span>
        <span className="text-2xl text-green-400 font-mono">{team2Score ?? '-'}</span>
      </div>
    </div>
  );
};

export default ScoreDisplay; 