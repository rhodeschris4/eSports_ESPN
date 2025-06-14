"use client";
import React from 'react';
import { useParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import TournamentCard from '../../../components/TournamentCard';
import TeamCard from '../../../components/TeamCard';
import MatchCard from '../../../components/MatchCard';
import NavigationBar from '../../../components/NavigationBar';
import Link from 'next/link';

async function fetchTournaments() {
  const res = await fetch('/api/tournaments');
  return res.json();
}
async function fetchTeams() {
  const res = await fetch('/api/teams');
  return res.json();
}
async function fetchMatches() {
  const res = await fetch('/api/matches');
  return res.json();
}

export default function GamePage() {
  const { game } = useParams();
  const gameStr = Array.isArray(game) ? game[0] : game;
  const { data: tournaments } = useQuery({ queryKey: ['tournaments'], queryFn: fetchTournaments });
  const { data: teams } = useQuery({ queryKey: ['teams'], queryFn: fetchTeams });
  const { data: matches } = useQuery({ queryKey: ['matches'], queryFn: fetchMatches });

  const filteredTournaments = tournaments?.filter((t: any) => t.game === gameStr);
  const filteredTeams = teams?.filter((team: any) => team.tournaments.some((t: any) => t.game === gameStr));
  const filteredMatches = matches?.filter((m: any) => m.tournament?.game === gameStr);

  return (
    <div className="min-h-screen bg-black text-white">
      <NavigationBar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <Link href="/" className="text-orange-600 font-bold mb-4 inline-block">&larr; Home</Link>
        <h1 className="text-3xl font-extrabold mb-6">{gameStr} Dashboard</h1>
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Upcoming Tournaments</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredTournaments?.filter((t: any) => t.status === 'upcoming').map((t: any) => (
              <TournamentCard key={t.id} tournament={t} />
            ))}
          </div>
        </section>
        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">Teams</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredTeams?.map((team: any) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        </section>
        <section>
          <h2 className="text-2xl font-bold mb-4">Matches</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredMatches?.map((match: any) => (
              <MatchCard key={match.id} match={match} game={gameStr as 'CS2' | 'VALORANT' | 'LOL'} />
            ))}
          </div>
        </section>
      </div>
    </div>
  );
} 