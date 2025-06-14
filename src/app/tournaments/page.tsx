"use client";
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import TournamentCard from '../../components/TournamentCard';
import NavigationBar from '../../components/NavigationBar';
import Link from 'next/link';
import FilterSelect from '../../components/FilterSelect';
import FilterInput from '../../components/FilterInput';
import SkeletonCard from '../../components/SkeletonCard';
import '../../styles/animations.css';

const GAME_OPTIONS = ['CS2', 'VALORANT', 'LOL'];
const STATUS_OPTIONS = ['upcoming', 'live', 'completed'];

async function fetchTournaments() {
  const res = await fetch('/api/tournaments');
  return res.json();
}

export default function TournamentsPage() {
  const { data: tournaments, isLoading, isError } = useQuery({
    queryKey: ['tournaments'],
    queryFn: fetchTournaments,
  });

  // Filter state
  const [game, setGame] = useState('');
  const [status, setStatus] = useState('');
  const [date, setDate] = useState('');

  // Filtered tournaments
  const filteredTournaments = tournaments?.filter((t: any) => {
    if (game && t.game !== game) return false;
    if (status && t.status !== status) return false;
    if (date && new Date(t.startDate).toISOString().slice(0, 10) !== date) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <NavigationBar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="text-orange-600 font-bold mb-4 inline-block">&larr; Home</Link>
        <h1 className="text-3xl font-extrabold mb-6">All Tournaments</h1>
        {/* Filter Bar */}
        <div className="flex flex-wrap gap-4 mb-8 items-end overflow-x-auto whitespace-nowrap scrollbar-hide -mx-2 px-2">
          <FilterSelect
            label="Game"
            value={game}
            onChange={e => setGame(e.target.value)}
            options={[{ value: '', label: 'All' }, ...GAME_OPTIONS.map(g => ({ value: g, label: g }))]}
            color="#ff7a00"
          />
          <FilterSelect
            label="Status"
            value={status}
            onChange={e => setStatus(e.target.value)}
            options={[{ value: '', label: 'All' }, ...STATUS_OPTIONS.map(s => ({ value: s, label: s.charAt(0).toUpperCase() + s.slice(1) }))]}
            color="#ff7a00"
          />
          <FilterInput
            label="Start Date"
            value={date}
            onChange={e => setDate(e.target.value)}
            type="date"
            color="#ff7a00"
          />
        </div>
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}
        {isError && (
          <div className="text-center text-red-400 font-bold py-10">Could not load tournaments. Please try again.</div>
        )}
        {GAME_OPTIONS.map(gameOption => (
          <div key={gameOption} className="mb-8">
            <h2 className="text-xl font-bold mb-2">{gameOption}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {filteredTournaments?.filter((t: any) => t.game === gameOption).map((t: any) => (
                <div className="animate-fadein" key={t.id}>
                  <TournamentCard tournament={t} />
                </div>
              ))}
            </div>
            {filteredTournaments && filteredTournaments.filter((t: any) => t.game === gameOption).length === 0 && (
              <div className="text-center text-gray-400 py-8 animate-fadein">
                <div className="inline-block px-8 py-6 bg-gray-900 rounded-xl border-2 border-gray-700 flex flex-col items-center gap-3" style={{clipPath: 'polygon(0 0, 96% 0, 100% 12%, 100% 100%, 4% 100%, 0 88%)'}}>
                  <svg width="40" height="40" fill="none" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" stroke="#888" strokeWidth="2" fill="#222" /><path d="M13 20h14M20 13v14" stroke="#888" strokeWidth="2" strokeLinecap="round"/></svg>
                  <div>No tournaments found for these filters.</div>
                  <button onClick={() => { setGame(''); setStatus(''); setDate(''); }} className="mt-2 px-4 py-1 rounded bg-gray-800 text-gray-200 border border-gray-600 hover:bg-gray-700 transition">Clear Filters</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 