import React from 'react';

const LiveIndicator: React.FC = () => {
  return (
    <div className="flex items-center">
      <span className="relative flex h-3 w-3 mr-2">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-red-600"></span>
      </span>
      <span className="text-red-500 font-bold text-xs">LIVE</span>
    </div>
  );
};

export default LiveIndicator; 