"use client";

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import TournamentCard from '../components/TournamentCard';
import MatchCard from '../components/MatchCard';
import NavigationBar from '../components/NavigationBar';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const GAME_OPTIONS = [
  { label: 'CS2', value: 'CS2', color: 'bg-orange-600 border-orange-600', border: 'border-orange-600' },
  { label: 'Valorant', value: 'VALORANT', color: 'bg-red-700 border-red-700', border: 'border-red-700' },
  { label: 'LoL', value: 'LOL', color: 'bg-purple-700 border-purple-700', border: 'border-purple-700' },
];

async function fetchTournaments() {
  const res = await fetch('/api/tournaments');
  return res.json();
}

async function fetchMatches() {
  const res = await fetch('/api/matches');
  return res.json();
}

export default function HomePage() {
  const pathname = usePathname();
  const activeGame = GAME_OPTIONS.find(g => pathname.startsWith(`/games/${g.value}`))?.value || '';

  const { data: tournaments } = useQuery({
    queryKey: ['tournaments'],
    queryFn: fetchTournaments,
  });
  const { data: matches } = useQuery({
    queryKey: ['matches'],
    queryFn: fetchMatches,
  });

  // For each game, find the next upcoming tournament
  const nextTournaments = GAME_OPTIONS.map(game => {
    const filtered = tournaments?.filter((t: any) => t.game === game.value && t.status === 'upcoming');
    if (!filtered || filtered.length === 0) return null;
    return filtered.sort((a: any, b: any) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0];
  });

  // For each game, get live matches
  const liveMatches = GAME_OPTIONS.map(game =>
    matches?.filter((m: any) => m.tournament?.game === game.value && m.status === 'live') || []
  );

  return (
    <div className="min-h-screen bg-black text-white">
      <NavigationBar />
      <main className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-4xl font-extrabold mb-10 text-center">eSports Dashboard</h1>
        <section className="flex flex-col gap-10">
          {GAME_OPTIONS.map((game, idx) => (
            <div key={game.value} className="bg-surface rounded-xl p-6 shadow-lg flex flex-col gap-4 border border-gray-800">
              <div className="flex items-center gap-3 mb-2">
                <span className={`w-3 h-3 rounded-full inline-block ${game.color}`}></span>
                <h2 className="text-2xl font-bold tracking-tight">{game.label}</h2>
              </div>
              <div className="mb-2">
                <h3 className="text-lg font-semibold mb-1">Upcoming Tournament</h3>
                {nextTournaments[idx] ? (
                  <TournamentCard tournament={nextTournaments[idx]} />
                ) : (
                  <div className="text-gray-400">No upcoming tournaments</div>
                )}
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-1">Live Matches</h3>
                {liveMatches[idx].length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {liveMatches[idx].map((match: any) => (
                      <MatchCard key={match.id} match={match} game={game.value as 'CS2' | 'VALORANT' | 'LOL'} />
                    ))}
                  </div>
                ) : (
                  <div className="text-gray-400">No live matches</div>
                )}
              </div>
            </div>
          ))}
        </section>
      </main>
    </div>
  );
}
