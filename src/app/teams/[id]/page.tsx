"use client";

import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import MatchCard from '../../../components/MatchCard';
import NavigationBar from '../../../components/NavigationBar';
import Link from 'next/link';
import { motion } from "framer-motion";
import Modal from '../../../components/Modal';
import ReactDOM from 'react-dom';

export default function TeamDetailPage() {
  const { id } = useParams();
  const [team, setTeam] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [compareOpen, setCompareOpen] = useState(false);
  const [teams, setTeams] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [filteredTeams, setFilteredTeams] = useState<any[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<any>(null);
  const [loadingCompare, setLoadingCompare] = useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dropdownPos, setDropdownPos] = useState<{left: number, top: number, width: number}>({left: 0, top: 0, width: 0});

  useEffect(() => {
    async function fetchTeam() {
      const res = await fetch(`/api/teams`);
      const data = await res.json();
      setTeam(data.find((t: any) => t.id === id));
      setLoading(false);
    }
    fetchTeam();
  }, [id]);

  useEffect(() => {
    if (compareOpen && teams.length === 0 && team) {
      fetch('/api/teams').then(res => res.json()).then(allTeams => {
        setTeams(allTeams.filter((t: any) => t.id !== team.id));
      });
    }
  }, [compareOpen, teams.length, team]);

  useEffect(() => {
    if (!search) {
      setFilteredTeams(teams);
    } else {
      setFilteredTeams(teams.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.country?.toLowerCase().includes(search.toLowerCase())
      ));
    }
  }, [search, teams]);

  useEffect(() => {
    if (compareOpen && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPos({
        left: rect.left,
        top: rect.bottom + window.scrollY,
        width: rect.width,
      });
    }
  }, [compareOpen, search, filteredTeams.length]);

  async function handleSelectTeam(t: any) {
    setLoadingCompare(true);
    // For now, just use the team object from /api/teams; could fetch /api/teams/[id] if needed
    setSelectedTeam(t);
    setLoadingCompare(false);
  }

  if (loading) return <div className="text-center py-10">Loading...</div>;
  if (!team) return <div className="text-center py-10 text-red-500">Team not found.</div>;

  // Combine matches as team1 and team2
  const matches = [...(team.matchesAsTeam1 || []), ...(team.matchesAsTeam2 || [])];

  // Calculate stats
  const completedMatches = matches.filter((m: any) => m.status === 'completed' && typeof m.team1Score === 'number' && typeof m.team2Score === 'number');
  const isTeam1 = (m: any) => m.team1.id === team.id;
  let wins = 0, losses = 0;
  completedMatches.forEach((m: any) => {
    const teamScore = isTeam1(m) ? m.team1Score : m.team2Score;
    const oppScore = isTeam1(m) ? m.team2Score : m.team1Score;
    if (teamScore > oppScore) wins++;
    else losses++;
  });
  const total = completedMatches.length;
  const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;
  // Recent form (last 5)
  const recentForm = completedMatches.slice(-5).map((m: any) => {
    const teamScore = isTeam1(m) ? m.team1Score : m.team2Score;
    const oppScore = isTeam1(m) ? m.team2Score : m.team1Score;
    return teamScore > oppScore ? 'W' : 'L';
  });
  // Recent matches (last 5)
  const recentMatches = completedMatches.slice(-5).reverse();

  // Compute stats for selectedTeam if present
  let selectedStats = null;
  if (selectedTeam) {
    const matches = [...(selectedTeam.matchesAsTeam1 || []), ...(selectedTeam.matchesAsTeam2 || [])];
    const completed = matches.filter((m: any) => m.status === 'completed' && typeof m.team1Score === 'number' && typeof m.team2Score === 'number');
    const isTeam1 = (m: any) => m.team1.id === selectedTeam.id;
    let wins = 0, losses = 0;
    completed.forEach((m: any) => {
      const teamScore = isTeam1(m) ? m.team1Score : m.team2Score;
      const oppScore = isTeam1(m) ? m.team2Score : m.team1Score;
      if (teamScore > oppScore) wins++;
      else losses++;
    });
    const total = completed.length;
    const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;
    const recentForm = completed.slice(-5).map((m: any) => {
      const teamScore = isTeam1(m) ? m.team1Score : m.team2Score;
      const oppScore = isTeam1(m) ? m.team2Score : m.team1Score;
      return teamScore > oppScore ? 'W' : 'L';
    });
    selectedStats = { total, wins, losses, winRate, recentForm };
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <NavigationBar />
      <div className="max-w-3xl mx-auto py-8 px-4">
        <Link href="/" className="text-orange-600 font-bold mb-4 inline-block">&larr; Home</Link>
        <div className="flex items-center mb-4 justify-between">
          <div className="flex items-center">
            {team.logoUrl && (
              <img src={team.logoUrl} alt={team.name} className="w-16 h-16 mr-4 rounded-full" />
            )}
            <div>
              <h1 className="text-3xl font-bold text-secondary">{team.name}</h1>
              <div className="text-gray-400 text-sm">{team.country}</div>
              {team.ranking && <div className="text-xs text-green-400">World Ranking: #{team.ranking}</div>}
            </div>
          </div>
          <button
            className="px-4 py-2 rounded-lg bg-yellow-400 text-black font-bold shadow hover:bg-yellow-300 transition"
            onClick={() => setCompareOpen(true)}
          >
            Compare
          </button>
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2 text-primary">Players</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {team.players?.map((player: any) => (
              <Link key={player.id} href={`/players/${player.id}`} className="bg-surface rounded p-3 text-center block hover:ring-2 hover:ring-primary transition">
                <div className="font-bold text-white">{player.nickname}</div>
                <div className="text-xs text-gray-400">{player.country}</div>
              </Link>
            ))}
          </div>
        </div>
        <div className="mb-8">
          <div className="relative mb-4">
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
                <line x1="0" y1="0" x2="92" y2="0" stroke="#ffe600" strokeWidth="3" />
                <line x1="92" y1="0" x2="100" y2="12" stroke="#ffe600" strokeWidth="3" />
                <line x1="100" y1="12" x2="100" y2="100" stroke="#ffe600" strokeWidth="1.5" />
                <line x1="100" y1="100" x2="8" y2="100" stroke="#ffe600" strokeWidth="3" />
                <line x1="8" y1="100" x2="0" y2="88" stroke="#ffe600" strokeWidth="3" />
                <line x1="0" y1="88" x2="0" y2="0" stroke="#ffe600" strokeWidth="1.5" />
              </svg>
              <div className="relative z-10">
                <h2 className="text-lg font-bold mb-2 text-accent">Team Stats</h2>
                <div className="flex flex-wrap gap-8 items-center mb-2">
                  <div><span className="font-bold text-white text-xl">{total}</span> <span className="text-gray-400">Matches</span></div>
                  <div><span className="font-bold text-green-400 text-xl">{wins}</span> <span className="text-gray-400">Wins</span></div>
                  <div><span className="font-bold text-red-400 text-xl">{losses}</span> <span className="text-gray-400">Losses</span></div>
                  <div><span className="font-bold text-accent text-xl">{winRate}%</span> <span className="text-gray-400">Win Rate</span></div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-xs text-gray-400">Recent Form:</span>
                  {recentForm.length === 0 && <span className="text-gray-500 text-xs ml-2">No recent results</span>}
                  {recentForm.map((r, i) => (
                    <span key={i} className={`w-6 h-6 flex items-center justify-center rounded font-bold text-sm ${r === 'W' ? 'bg-green-700 text-green-200' : 'bg-red-800 text-red-200'}`}>{r}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.04, y: -4, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.18)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="bg-surface p-4 relative shadow-none geometric-card overflow-visible mb-8"
            style={{ clipPath: 'polygon(0 0, 92% 0, 100% 12%, 100% 100%, 8% 100%, 0 88%)' }}
          >
            {/* SVG Outline */}
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ zIndex: 1 }}
              preserveAspectRatio="none"
            >
              <line x1="0" y1="0" x2="92" y2="0" stroke="#ffe600" strokeWidth="3" />
              <line x1="92" y1="0" x2="100" y2="12" stroke="#ffe600" strokeWidth="3" />
              <line x1="100" y1="12" x2="100" y2="100" stroke="#ffe600" strokeWidth="1.5" />
              <line x1="100" y1="100" x2="8" y2="100" stroke="#ffe600" strokeWidth="3" />
              <line x1="8" y1="100" x2="0" y2="88" stroke="#ffe600" strokeWidth="3" />
              <line x1="0" y1="88" x2="0" y2="0" stroke="#ffe600" strokeWidth="1.5" />
            </svg>
            <div className="relative z-10">
              <h3 className="text-md font-bold mb-2 text-primary">Recent Matches</h3>
              {recentMatches.length === 0 ? (
                <div className="text-gray-500 text-sm">No completed matches yet.</div>
              ) : (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-400">
                      <th className="text-left font-semibold pb-1">Opponent</th>
                      <th className="text-left font-semibold pb-1">Date</th>
                      <th className="text-left font-semibold pb-1">Score</th>
                      <th className="text-left font-semibold pb-1">Result</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentMatches.map((m: any) => {
                      const teamIs1 = isTeam1(m);
                      const teamScore = teamIs1 ? m.team1Score : m.team2Score;
                      const oppScore = teamIs1 ? m.team2Score : m.team1Score;
                      const opponent = teamIs1 ? m.team2.name : m.team1.name;
                      const result = teamScore > oppScore ? 'W' : 'L';
                      return (
                        <tr key={m.id} className="border-b border-gray-800 last:border-0">
                          <td className="py-1 font-bold text-white">{opponent}</td>
                          <td className="py-1 text-gray-400">{new Date(m.scheduledTime).toLocaleDateString()}</td>
                          <td className="py-1 text-gray-200">{teamScore} - {oppScore}</td>
                          <td className={`py-1 font-bold ${result === 'W' ? 'text-green-400' : 'text-red-400'}`}>{result}</td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              )}
            </div>
          </motion.div>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2 text-accent">Matches</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {matches.map((match: any) => (
              <MatchCard key={match.id} match={match} game={match.tournament?.game} />
            ))}
          </div>
        </div>
        <Modal open={compareOpen} onClose={() => { setCompareOpen(false); setSelectedTeam(null); setSearch(''); }}>
          <h2 className="text-xl font-bold mb-4 text-primary">Compare Teams</h2>
          <div className="mb-4 relative min-h-[120px] pb-4">
            <input
              ref={inputRef}
              className="w-full bg-gray-900 text-white font-semibold px-4 py-2 rounded-lg border-2 border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Search for a team..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />
            {typeof window !== 'undefined' && search && filteredTeams.length > 0 && inputRef.current && ReactDOM.createPortal(
              <div
                className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-[9999] max-h-60 overflow-y-auto"
                style={{
                  position: 'absolute',
                  left: dropdownPos.left,
                  top: dropdownPos.top,
                  width: dropdownPos.width,
                }}
              >
                {filteredTeams.map(t => (
                  <div
                    key={t.id}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-800 text-white flex items-center gap-2"
                    onClick={() => { handleSelectTeam(t); setSearch(''); }}
                  >
                    <span className="font-bold">{t.name}</span>
                    <span className="text-xs text-gray-400">({t.country})</span>
                  </div>
                ))}
              </div>,
              document.body
            )}
            {typeof window !== 'undefined' && search && filteredTeams.length === 0 && inputRef.current && ReactDOM.createPortal(
              <div
                className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-[9999] px-4 py-2 text-gray-400"
                style={{
                  position: 'absolute',
                  left: dropdownPos.left,
                  top: dropdownPos.top,
                  width: dropdownPos.width,
                }}
              >No teams found.</div>,
              document.body
            )}
          </div>
          {loadingCompare && <div className="text-center text-gray-400 py-4">Loading team...</div>}
          {selectedTeam && !loadingCompare && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Team 1 */}
              <div className="bg-surface rounded-xl p-4 border border-gray-700">
                <div className="font-bold text-lg mb-2 text-yellow-400">{team.name}</div>
                <div className="text-xs text-gray-400 mb-2">{team.country}</div>
                <div className="mb-2 flex flex-col gap-1">
                  <span><span className="font-bold">{completedMatches.length}</span> Matches</span>
                  <span><span className="font-bold text-green-400">{wins}</span> Wins</span>
                  <span><span className="font-bold text-red-400">{losses}</span> Losses</span>
                  <span><span className="font-bold text-accent">{winRate}%</span> Win Rate</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">Recent Form:</div>
                <div className="flex items-center gap-1 mt-1">
                  {recentForm.map((r, i) => (
                    <span key={i} className={`w-6 h-6 flex items-center justify-center rounded font-bold text-sm ${r === 'W' ? 'bg-green-700 text-green-200' : 'bg-red-800 text-red-200'}`}>{r}</span>
                  ))}
                </div>
              </div>
              {/* Team 2 */}
              <div className="bg-surface rounded-xl p-4 border border-gray-700">
                <div className="font-bold text-lg mb-2 text-yellow-400">{selectedTeam.name}</div>
                <div className="text-xs text-gray-400 mb-2">{selectedTeam.country}</div>
                <div className="mb-2 flex flex-col gap-1">
                  <span><span className="font-bold">{selectedStats?.total ?? 0}</span> Matches</span>
                  <span><span className="font-bold text-green-400">{selectedStats?.wins ?? 0}</span> Wins</span>
                  <span><span className="font-bold text-red-400">{selectedStats?.losses ?? 0}</span> Losses</span>
                  <span><span className="font-bold text-accent">{selectedStats?.winRate ?? 0}%</span> Win Rate</span>
                </div>
                <div className="text-xs text-gray-500 mt-2">Recent Form:</div>
                <div className="flex items-center gap-1 mt-1">
                  {(selectedStats?.recentForm || []).map((r: string, i: number) => (
                    <span key={i} className={`w-6 h-6 flex items-center justify-center rounded font-bold text-sm ${r === 'W' ? 'bg-green-700 text-green-200' : 'bg-red-800 text-red-200'}`}>{r}</span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
} 