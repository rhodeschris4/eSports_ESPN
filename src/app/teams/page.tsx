"use client";
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import TeamCard from '../../components/TeamCard';
import NavigationBar from '../../components/NavigationBar';
import Link from 'next/link';
import FilterSelect from '../../components/FilterSelect';
import FilterInput from '../../components/FilterInput';
import SkeletonCard from '../../components/SkeletonCard';
import '../../styles/animations.css';

const GAME_OPTIONS = ['CS2', 'VALORANT', 'LOL'];

async function fetchTeams() {
  const res = await fetch('/api/teams');
  return res.json();
}

export default function TeamsPage() {
  const { data: teams, isLoading, isError } = useQuery({
    queryKey: ['teams'],
    queryFn: fetchTeams,
  });

  // Extract unique countries from teams
  const countryOptions: string[] = Array.isArray(teams)
    ? Array.from(new Set(teams.map((t: any) => t.country))).filter(Boolean) as string[]
    : [];

  // Filter state
  const [game, setGame] = useState('');
  const [country, setCountry] = useState('');
  const [ranking, setRanking] = useState('');
  const [name, setName] = useState('');

  // Filtered teams
  const filteredTeams = teams?.filter((t: any) => {
    if (game && !(t.tournaments && t.tournaments.some((tour: any) => tour.game === game))) return false;
    if (country && t.country !== country) return false;
    if (ranking && t.ranking !== Number(ranking)) return false;
    if (name && !t.name.toLowerCase().includes(name.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="min-h-screen bg-black text-white">
      <NavigationBar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="text-orange-600 font-bold mb-4 inline-block">&larr; Home</Link>
        <h1 className="text-3xl font-extrabold mb-6">All Teams</h1>
        {/* Filter Bar */}
        <div className="flex flex-wrap gap-4 mb-8 items-end overflow-x-auto whitespace-nowrap scrollbar-hide -mx-2 px-2">
          <FilterSelect
            label="Game"
            value={game}
            onChange={e => setGame(e.target.value)}
            options={[{ value: '', label: 'All' }, ...GAME_OPTIONS.map(g => ({ value: g, label: g }))]}
            color="#ffe600"
          />
          <FilterSelect
            label="Country"
            value={country}
            onChange={e => setCountry(e.target.value)}
            options={[{ value: '', label: 'All' }, ...countryOptions.map(c => ({ value: String(c), label: String(c) }))]}
            color="#ffe600"
          />
          <FilterInput
            label="Ranking"
            value={ranking}
            onChange={e => setRanking(e.target.value)}
            type="number"
            placeholder="#"
            min={1}
            color="#ffe600"
          />
          <FilterInput
            label="Name"
            value={name}
            onChange={e => setName(e.target.value)}
            type="text"
            placeholder="Search by name"
            color="#ffe600"
          />
        </div>
        {isLoading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-8">
            {Array.from({ length: 6 }).map((_, i) => <SkeletonCard key={i} />)}
          </div>
        )}
        {isError && (
          <div className="text-center text-red-400 font-bold py-10">Could not load teams. Please try again.</div>
        )}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {filteredTeams?.map((t: any) => (
            <div className="animate-fadein" key={t.id}>
              <TeamCard team={t} />
            </div>
          ))}
        </div>
        {filteredTeams && filteredTeams.length === 0 && (
          <div className="text-center text-gray-400 py-8 animate-fadein">
            <div className="inline-block px-8 py-6 bg-gray-900 rounded-xl border-2 border-gray-700 flex flex-col items-center gap-3" style={{clipPath: 'polygon(0 0, 96% 0, 100% 12%, 100% 100%, 4% 100%, 0 88%)'}}>
              <svg width="40" height="40" fill="none" viewBox="0 0 40 40"><circle cx="20" cy="20" r="18" stroke="#888" strokeWidth="2" fill="#222" /><path d="M13 20h14M20 13v14" stroke="#888" strokeWidth="2" strokeLinecap="round"/></svg>
              <div>No teams found for these filters.</div>
              <button onClick={() => { setGame(''); setCountry(''); setRanking(''); setName(''); }} className="mt-2 px-4 py-1 rounded bg-gray-800 text-gray-200 border border-gray-600 hover:bg-gray-700 transition">Clear Filters</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 