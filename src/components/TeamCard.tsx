"use client";
import React from 'react';
import { Team } from '../types';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface TeamCardProps {
  team: Team;
}

function getFlagEmoji(country: string) {
  const code = country
    .replace('UK', 'GB')
    .replace('USA', 'US')
    .replace('South Korea', 'KR')
    .replace('Vietnam', 'VN')
    .replace('Brazil', 'BR')
    .replace('Sweden', 'SE')
    .replace('France', 'FR')
    .replace('China', 'CN')
    .replace('Japan', 'JP')
    .replace('Germany', 'DE')
    .replace('USA', 'US')
    .toUpperCase()
    .split(/[^A-Z]/)[0];
  if (code.length !== 2) return '';
  return String.fromCodePoint(...[...code].map(c => 0x1f1e6 + c.charCodeAt(0) - 65));
}

const TeamCard: React.FC<TeamCardProps> = ({ team }) => {
  const accent = '#ffe600'; // yellow accent for teams
  return (
    <Link href={`/teams/${team.id}`} className="block">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ scale: 1.04, y: -4, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.18)' }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        className="bg-surface p-4 relative shadow-none flex items-center geometric-card overflow-visible"
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
        <div className="relative z-10 flex items-center">
          {team.logoUrl && (
            <img src={team.logoUrl} alt={team.name} className="w-10 h-10 mr-3 rounded-full border-2 border-gray-300" />
          )}
          <div>
            <div className="font-extrabold text-xl text-white">{team.name}</div>
            <div className="text-xs text-light font-bold">{getFlagEmoji(team.country)} {team.country}</div>
            {team.ranking && <div className="text-xs text-light font-bold">#{team.ranking}</div>}
          </div>
        </div>
      </motion.div>
    </Link>
  );
};

export default TeamCard; 