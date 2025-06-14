"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from 'next/link';
import TeamCard from '../../../components/TeamCard';
import MatchCard from '../../../components/MatchCard';
import StreamButton from '../../../components/StreamButton';
import LiveIndicator from '../../../components/LiveIndicator';
import NavigationBar from '../../../components/NavigationBar';

export default function TournamentDetailPage() {
  const { id } = useParams();
  const [tournament, setTournament] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTournament() {
      const res = await fetch(`/api/tournaments`);
      const data = await res.json();
      setTournament(data.find((t: any) => t.id === id));
      setLoading(false);
    }
    fetchTournament();
  }, [id]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!tournament) return <div className="text-center py-10 text-red-500">Tournament not found.</div>;

  return (
    <div className="min-h-screen bg-black text-white">
      <NavigationBar />
      <div className="max-w-4xl mx-auto py-8 px-4">
        <Link href="/" className="text-orange-600 font-bold mb-4 inline-block">&larr; Home</Link>
        <div className="flex items-center mb-4">
          {tournament.logoUrl && (
            <img src={tournament.logoUrl} alt={tournament.name} className="w-16 h-16 mr-4 rounded" />
          )}
          <div>
            <h1 className="text-3xl font-bold text-primary flex items-center">
              {tournament.name}
              {tournament.status === 'live' && <span className="ml-3"><LiveIndicator /></span>}
            </h1>
            <div className="text-gray-400 text-sm">{tournament.game} &bull; {tournament.location}</div>
            <div className="text-xs text-gray-500">
              {new Date(tournament.startDate).toLocaleDateString()} - {new Date(tournament.endDate).toLocaleDateString()}
            </div>
          </div>
        </div>
        <div className="mb-4">
          <span className="font-semibold text-accent">Prize Pool:</span> ${tournament.prizePool?.toLocaleString()}
        </div>
        <div className="mb-6">
          <span className="font-semibold text-accent">Streams:</span>
          <div className="flex gap-3 mt-2 flex-wrap">
            {tournament.streamLinks?.map((s: any) => (
              <StreamButton key={s.id} stream={s} />
            ))}
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2 text-secondary">Teams</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tournament.teams?.map((team: any) => (
              <TeamCard key={team.id} team={team} />
            ))}
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2 text-primary">Matches</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {tournament.matches?.map((match: any) => (
              <MatchCard key={match.id} match={match} game={tournament.game} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
} 