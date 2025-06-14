"use client";
import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import NavigationBar from "../../components/NavigationBar";
import Link from "next/link";
import { motion } from "framer-motion";

const GAME_OPTIONS = [
  { label: "CS2", value: "CS2", color: "#ff7a00" },
  { label: "Valorant", value: "VALORANT", color: "#e10600" },
  { label: "LoL", value: "LOL", color: "#a259ff" },
];

async function fetchTeams() {
  const res = await fetch("/api/teams");
  return res.json();
}
async function fetchPlayers() {
  const res = await fetch("/api/teams");
  const teams = await res.json();
  // Flatten all players, attach team and tournaments
  let players: any[] = [];
  teams.forEach((team: any) => {
    team.players.forEach((player: any) => {
      players.push({ ...player, team, tournaments: team.tournaments });
    });
  });
  return players;
}

export default function LeaderboardsPage() {
  const [game, setGame] = useState("CS2");
  const { data: teams, isLoading: loadingTeams } = useQuery({ queryKey: ["teams"], queryFn: fetchTeams });
  const { data: players, isLoading: loadingPlayers } = useQuery({ queryKey: ["players"], queryFn: fetchPlayers });

  // Filter by game
  const filteredTeams = teams?.filter((t: any) => t.tournaments && t.tournaments.some((tour: any) => tour.game === game));
  const filteredPlayers = players?.filter((p: any) => p.tournaments && p.tournaments.some((tour: any) => tour.game === game));

  // Top Teams by win rate
  const topTeams = (filteredTeams || [])
    .map((team: any) => {
      const matches = [...(team.matchesAsTeam1 || []), ...(team.matchesAsTeam2 || [])];
      const completed = matches.filter((m: any) => m.status === "completed" && typeof m.team1Score === "number" && typeof m.team2Score === "number");
      const isTeam1 = (m: any) => m.team1.id === team.id;
      let wins = 0;
      completed.forEach((m: any) => {
        const teamScore = isTeam1(m) ? m.team1Score : m.team2Score;
        const oppScore = isTeam1(m) ? m.team2Score : m.team1Score;
        if (teamScore > oppScore) wins++;
      });
      const total = completed.length;
      const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;
      return { ...team, winRate, total };
    })
    .sort((a: any, b: any) => b.winRate - a.winRate || b.total - a.total)
    .slice(0, 10);

  // Top Players by KDA (LoL) or K/D Ratio (CS2/Valorant)
  const topPlayers = (filteredPlayers || [])
    .map((player: any) => {
      // Use stat from API if available, else fallback
      let kda = 0;
      if (player.stats) {
        if (game === "LOL" && player.stats.KDA) kda = parseFloat(player.stats.KDA);
        else if (player.stats["K/D Ratio"]) kda = parseFloat(player.stats["K/D Ratio"]);
      }
      return { ...player, kda };
    })
    .sort((a: any, b: any) => b.kda - a.kda)
    .slice(0, 10);

  const accent = GAME_OPTIONS.find((g) => g.value === game)?.color || "#ffe600";

  return (
    <div className="min-h-screen bg-black text-white">
      <NavigationBar />
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-extrabold mb-6">Leaderboards</h1>
        {/* Filter Bar */}
        <div className="flex gap-4 mb-8 items-center">
          <span className="text-lg font-bold">Game:</span>
          {GAME_OPTIONS.map((g) => (
            <button
              key={g.value}
              className={`px-4 py-2 rounded-lg font-bold border-2 transition-all duration-150 ${game === g.value ? "bg-gray-900 text-white border-yellow-400" : "bg-gray-800 text-gray-300 border-gray-700"}`}
              style={{ borderColor: game === g.value ? accent : undefined, color: game === g.value ? accent : undefined }}
              onClick={() => setGame(g.value)}
            >
              {g.label}
            </button>
          ))}
        </div>
        {/* Top Players */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface p-4 mb-8 relative shadow-none geometric-card overflow-visible"
          style={{ clipPath: 'polygon(0 0, 92% 0, 100% 12%, 100% 100%, 8% 100%, 0 88%)', borderColor: accent }}
        >
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 1 }}
            preserveAspectRatio="none"
          >
            <line x1="0" y1="0" x2="92" y2="0" stroke={accent} strokeWidth="3" />
            <line x1="92" y1="0" x2="100" y2="12" stroke={accent} strokeWidth="3" />
            <line x1="100" y1="12" x2="100" y2="100" stroke={accent} strokeWidth="1.5" />
            <line x1="100" y1="100" x2="8" y2="100" stroke={accent} strokeWidth="3" />
            <line x1="8" y1="100" x2="0" y2="88" stroke={accent} strokeWidth="3" />
            <line x1="0" y1="88" x2="0" y2="0" stroke={accent} strokeWidth="1.5" />
          </svg>
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-4 text-primary">Top Players ({game === "LOL" ? "KDA" : "K/D Ratio"})</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400">
                  <th className="text-left font-semibold pb-1">#</th>
                  <th className="text-left font-semibold pb-1">Player</th>
                  <th className="text-left font-semibold pb-1">Team</th>
                  <th className="text-left font-semibold pb-1">{game === "LOL" ? "KDA" : "K/D Ratio"}</th>
                </tr>
              </thead>
              <tbody>
                {topPlayers.map((p: any, i: number) => (
                  <tr key={p.id} className="border-b border-gray-800 last:border-0 hover:bg-gray-800 cursor-pointer transition" onClick={() => window.location.href = `/players/${p.id}` }>
                    <td className="py-1 font-bold text-white">{i + 1}</td>
                    <td className="py-1 text-white font-bold">{p.nickname}</td>
                    <td className="py-1 text-gray-400">{p.team?.name}</td>
                    <td className="py-1 text-yellow-400 font-bold">{p.kda}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
        {/* Top Teams */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-surface p-4 mb-8 relative shadow-none geometric-card overflow-visible"
          style={{ clipPath: 'polygon(0 0, 92% 0, 100% 12%, 100% 100%, 8% 100%, 0 88%)', borderColor: accent }}
        >
          <svg
            viewBox="0 0 100 100"
            className="absolute inset-0 w-full h-full pointer-events-none"
            style={{ zIndex: 1 }}
            preserveAspectRatio="none"
          >
            <line x1="0" y1="0" x2="92" y2="0" stroke={accent} strokeWidth="3" />
            <line x1="92" y1="0" x2="100" y2="12" stroke={accent} strokeWidth="3" />
            <line x1="100" y1="12" x2="100" y2="100" stroke={accent} strokeWidth="1.5" />
            <line x1="100" y1="100" x2="8" y2="100" stroke={accent} strokeWidth="3" />
            <line x1="8" y1="100" x2="0" y2="88" stroke={accent} strokeWidth="3" />
            <line x1="0" y1="88" x2="0" y2="0" stroke={accent} strokeWidth="1.5" />
          </svg>
          <div className="relative z-10">
            <h2 className="text-xl font-bold mb-4 text-primary">Top Teams (Win Rate)</h2>
            <table className="w-full text-sm">
              <thead>
                <tr className="text-gray-400">
                  <th className="text-left font-semibold pb-1">#</th>
                  <th className="text-left font-semibold pb-1">Team</th>
                  <th className="text-left font-semibold pb-1">Country</th>
                  <th className="text-left font-semibold pb-1">Win Rate</th>
                  <th className="text-left font-semibold pb-1">Matches</th>
                </tr>
              </thead>
              <tbody>
                {topTeams.map((t: any, i: number) => (
                  <tr key={t.id} className="border-b border-gray-800 last:border-0 hover:bg-gray-800 cursor-pointer transition" onClick={() => window.location.href = `/teams/${t.id}` }>
                    <td className="py-1 font-bold text-white">{i + 1}</td>
                    <td className="py-1 text-white font-bold">{t.name}</td>
                    <td className="py-1 text-gray-400">{t.country}</td>
                    <td className="py-1 text-yellow-400 font-bold">{t.winRate}%</td>
                    <td className="py-1 text-gray-400">{t.total}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
} 