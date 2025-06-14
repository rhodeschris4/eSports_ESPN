"use client";
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import MatchCard from '../../components/MatchCard';
import NavigationBar from '../../components/NavigationBar';
import Link from 'next/link';
import FilterSelect from '../../components/FilterSelect';
import FilterInput from '../../components/FilterInput';
import SkeletonCard from '../../components/SkeletonCard';
import '../../styles/animations.css';

const GAME_OPTIONS = ['CS2', 'VALORANT', 'LOL'];
const STATUS_OPTIONS = ['upcoming', 'live', 'completed'];

async function fetchMatches() {
  const res = await fetch('/api/matches');
  return res.json();
}

async function fetchTeams() {
  const res = await fetch('/api/teams');
  return res.json();
}

function PlaceholderCard() {
  return (
    <div
      className="bg-surface p-4 relative shadow-none geometric-card overflow-visible min-h-[100px] flex items-center justify-center"
      style={{ clipPath: 'polygon(0 0, 92% 0, 100% 12%, 100% 100%, 8% 100%, 0 88%)' }}
    >
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 1 }}
        preserveAspectRatio="none"
      >
        {/* Top edge */}
        <line x1="0" y1="0" x2="92" y2="0" stroke="#888" strokeWidth="3" />
        {/* Top right diagonal */}
        <line x1="92" y1="0" x2="100" y2="12" stroke="#888" strokeWidth="3" />
        {/* Right edge (thin) */}
        <line x1="100" y1="12" x2="100" y2="100" stroke="#888" strokeWidth="1.5" />
        {/* Bottom edge */}
        <line x1="100" y1="100" x2="8" y2="100" stroke="#888" strokeWidth="3" />
        {/* Bottom left diagonal */}
        <line x1="8" y1="100" x2="0" y2="88" stroke="#888" strokeWidth="3" />
        {/* Left edge (thin) */}
        <line x1="0" y1="88" x2="0" y2="0" stroke="#888" strokeWidth="1.5" />
      </svg>
      <div className="relative z-10 text-gray-500 text-center w-full">No live matches</div>
    </div>
  );
}

export default function LivePage() {
  const { data: matches, isLoading, isError } = useQuery({
    queryKey: ['matches'],
    queryFn: fetchMatches,
  });
  const { data: teams } = useQuery({
    queryKey: ['teams'],
    queryFn: fetchTeams,
  });

  // Filter state
  const [game, setGame] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');
  const [teamId, setTeamId] = useState('');

  // Filtered matches
  const filteredMatches = matches?.filter((m: any) => {
    if (game && m.tournament?.game !== game) return false;
    if (status && m.status !== status) return false;
    if (date && new Date(m.startDate).toISOString().slice(0, 10) !== date) return false;
    if (teamId && m.teams && !m.teams.some((t: any) => t.id === teamId)) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <NavigationBar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="text-orange-600 font-bold mb-4 inline-block">&larr; Home</Link>
        <h1 className="text-3xl font-extrabold mb-6">Live & Upcoming Matches</h1>
        {/* Filter Bar */}
        <div className="flex flex-wrap gap-4 mb-8 items-end overflow-x-auto whitespace-nowrap scrollbar-hide -mx-2 px-2">
          <FilterSelect
            label="Game"
            value={game}
            onChange={e => setGame(e.target.value)}
            options={[{ value: '', label: 'All' }, ...GAME_OPTIONS.map(g => ({ value: g, label: g }))]}
            color="#a259ff"
          />
          <FilterSelect
            label="Status"
            value={status}
            onChange={e => setStatus(e.target.value)}
            options={[{ value: '', label: 'All' }, ...STATUS_OPTIONS.map(s => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))]}
            color="#a259ff"
          />
          <FilterInput
            label="Date"
            value={date}
            onChange={e => setDate(e.target.value)}
            type="date"
            color="#a259ff"
          />
          <FilterSelect
            label="Team"
            value={teamId}
            onChange={e => setTeamId(e.target.value)}
            options={[{ value: '', label: 'All' }, ...(teams ? teams.map((t: any) => ({ value: t.id, label: t.name })) : [])]}
            color="#a259ff"
          />
        </div>
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}
        {isError && (
          <div className="text-center text-red-400 font-bold py-10">Could not load matches. Please try again.</div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredMatches?.map((m: any) => (
            <div className="animate-fadein" key={m.id}>
              <MatchCard match={m} game={m.game} />
            </div>
          ))}
        </div>
        {filteredMatches && filteredMatches.length === 0 && (
          <div className="text-center text-gray-400 py-8 animate-fadein">
            <div className="inline-block px-8 py-6 bg-gray-900 rounded-xl border-2 border-gray-700 flex flex-col items-center gap-3" style={{clipPath: 'polygon(0 0, 96% 0, 100% 12%, 100% 100%, 4% 100%, 0 88%)'}}>
              <svg width="40" height="40" fill="none" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" stroke="#888" strokeWidth="2" fill="#222" /><path d="M13 20h14M20 13v14" stroke="#888" strokeWidth="2" strokeLinecap="round"/></svg>
              <div>No matches found for these filters.</div>
              <button onClick={() => { setGame(''); setStatus(''); setDate(''); setTeamId(''); }} className="mt-2 px-4 py-1 rounded bg-gray-800 text-gray-200 border border-gray-600 hover:bg-gray-700 transition">Clear Filters</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 