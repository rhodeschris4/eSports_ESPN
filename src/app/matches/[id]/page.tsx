"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from 'next/link';
import LiveIndicator from '../../../components/LiveIndicator';
import CountdownTimer from '../../../components/CountdownTimer';
import StreamButton from '../../../components/StreamButton';
import ScoreDisplay from '../../../components/ScoreDisplay';
import NavigationBar from '../../../components/NavigationBar';

export default function MatchDetailPage() {
  const { id } = useParams();
  const [match, setMatch] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMatch() {
      const res = await fetch(`/api/matches`);
      const data = await res.json();
      setMatch(data.find((m: any) => m.id === id));
      setLoading(false);
    }
    fetchMatch();
  }, [id]);

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!match) return <div className="text-center py-10 text-red-500">Match not found.</div>;

  return (
    <div className="min-h-screen bg-black text-white">
      <NavigationBar />
      <div className="max-w-2xl mx-auto py-8 px-4">
        <Link href="/" className="text-orange-600 font-bold mb-4 inline-block">&larr; Home</Link>
        <div className="mb-4">
          <h1 className="text-2xl font-bold text-primary flex items-center">
            {match.team1.name} vs {match.team2.name}
            {match.status === 'live' && <span className="ml-3"><LiveIndicator /></span>}
          </h1>
          <div className="text-gray-400 text-sm mb-1">{match.matchType.toUpperCase()} &bull; {match.round}</div>
          <div className="text-xs text-gray-500 mb-2">
            {new Date(match.scheduledTime).toLocaleString()}
          </div>
          <div>
            {match.status === 'scheduled' && <CountdownTimer targetDate={new Date(match.scheduledTime)} />}
          </div>
        </div>
        <div className="mb-6">
          <ScoreDisplay
            team1={match.team1.name}
            team2={match.team2.name}
            team1Score={match.team1Score}
            team2Score={match.team2Score}
          />
        </div>
        <div className="mb-6">
          <span className="font-semibold text-accent">Streams:</span>
          <div className="flex gap-3 mt-2 flex-wrap">
            {match.streamLinks?.map((s: any) => (
              <StreamButton key={s.id} stream={s} />
            ))}
          </div>
        </div>
        <div>
          <span className="font-semibold text-secondary">Status:</span> {match.status.toUpperCase()}
        </div>
      </div>
    </div>
  );
} 