import React from 'react';

export default function SkeletonCard({ height = 120 }: { height?: number }) {
  return (
    <div
      className="bg-gray-900 animate-pulse relative shadow-none geometric-card overflow-visible flex flex-col justify-center"
      style={{
        clipPath: 'polygon(0 0, 96% 0, 100% 12%, 100% 100%, 4% 100%, 0 88%)',
        minHeight: height,
        height,
        alignItems: 'flex-start',
        padding: '1rem',
      }}
    >
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
        preserveAspectRatio="none"
      >
        <line x1="0" y1="0" x2="96" y2="0" stroke="#888" strokeWidth="3" />
        <line x1="96" y1="0" x2="100" y2="12" stroke="#888" strokeWidth="3" />
        <line x1="100" y1="12" x2="100" y2="100" stroke="#888" strokeWidth="1.5" />
        <line x1="100" y1="100" x2="4" y2="100" stroke="#888" strokeWidth="3" />
        <line x1="4" y1="100" x2="0" y2="88" stroke="#888" strokeWidth="3" />
        <line x1="0" y1="88" x2="0" y2="0" stroke="#888" strokeWidth="1.5" />
      </svg>
      <div className="relative z-10 flex flex-col gap-3 w-full">
        <div className="h-5 bg-gray-700 rounded w-2/3 mb-2" />
        <div className="h-4 bg-gray-800 rounded w-1/2 mb-1" />
        <div className="h-3 bg-gray-800 rounded w-1/3" />
      </div>
    </div>
  );
} 