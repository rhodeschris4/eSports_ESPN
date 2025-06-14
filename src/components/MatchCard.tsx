"use client";
import React from 'react';
import { Match } from '../types';
import LiveIndicator from './LiveIndicator';
import CountdownTimer from './CountdownTimer';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface MatchCardProps {
  match: Match;
  game: 'CS2' | 'VALORANT' | 'LOL';
}

const GAME_COLORS: Record<string, string> = {
  CS2: '#ff7a00', // orange
  VALORANT: '#e10600', // red
  LOL: '#a259ff', // purple
};

const MatchCard: React.FC<MatchCardProps> = ({ match, game }) => {
  const accent = GAME_COLORS[game] || '#ff7a00';
  return (
    <Link href={`/matches/${match.id}`} className="block">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.04, y: -4, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.18)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className="bg-surface p-4 relative shadow-none geometric-card overflow-visible"
        style={{ clipPath: 'polygon(0 0, 92% 0, 100% 12%, 100% 100%, 8% 100%, 0 88%)' }}
      >
        {/* SVG Outline */}
        <svg
          viewBox="0 0 100 100"
          className="absolute inset-0 w-full h-full pointer-events-none"
          style={{ zIndex: 1 }}
          preserveAspectRatio="none"
        >
          {/* Top edge */}
          <line x1="0" y1="0" x2="92" y2="0" stroke={accent} strokeWidth="3" />
          {/* Top right diagonal */}
          <line x1="92" y1="0" x2="100" y2="12" stroke={accent} strokeWidth="3" />
          {/* Right edge (thin) */}
          <line x1="100" y1="12" x2="100" y2="100" stroke={accent} strokeWidth="1.5" />
          {/* Bottom edge */}
          <line x1="100" y1="100" x2="8" y2="100" stroke={accent} strokeWidth="3" />
          {/* Bottom left diagonal */}
          <line x1="8" y1="100" x2="0" y2="88" stroke={accent} strokeWidth="3" />
          {/* Left edge (thin) */}
          <line x1="0" y1="88" x2="0" y2="0" stroke={accent} strokeWidth="1.5" />
        </svg>
        {/* Card Content */}
        <div className="relative z-10">
          <div className="flex justify-between items-center mb-2">
            <span className="font-extrabold text-xl text-white">{match.team1.name}</span>
            <span className="text-lg text-light font-black">vs</span>
            <span className="font-extrabold text-xl text-white">{match.team2.name}</span>
          </div>
          <div className="flex justify-between text-sm text-light items-center">
            <span>
              {match.status === 'live' && <LiveIndicator />}
              {match.status === 'scheduled' && <CountdownTimer targetDate={new Date(match.scheduledTime)} />}
              {match.status === 'completed' && <span className="text-red-300 font-bold">COMPLETED</span>}
            </span>
            <span>{new Date(match.scheduledTime).toLocaleString()}</span>
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default MatchCard; 