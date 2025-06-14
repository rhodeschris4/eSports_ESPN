"use client";
import React from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import NavigationBar from "../../../components/NavigationBar";
import { motion } from "framer-motion";
import Tooltip from '../../../components/Tooltip';
import Modal from '../../../components/Modal';
import ReactDOM from 'react-dom';

async function fetchPlayer(id: string) {
  const res = await fetch(`/api/players/${id}`);
  if (!res.ok) throw new Error("Failed to fetch player");
  return res.json();
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

const STAT_TOOLTIPS: Record<string, string> = {
  'K/D Ratio': 'Kills per Death',
  'ADR': 'Average Damage per Round',
  'ACS': 'Average Combat Score',
  'KAST %': 'Kill, Assist, Survive, Trade %',
  'KDA': 'Kill/Death/Assist Ratio',
  'CS/Min': 'Creep Score per Minute',
  'Gold/Min': 'Gold per Minute',
  'Damage/Min': 'Damage per Minute',
};

const GAME_ACCENTS: Record<string, string> = {
  'CS2': '#ff7a00',
  'VALORANT': '#e10600',
  'LOL': '#a259ff',
};

export default function PlayerDetailPage() {
  const { id } = useParams();
  const { data: player, isLoading, isError } = useQuery({
    queryKey: ["player", id],
    queryFn: () => fetchPlayer(id as string),
    enabled: !!id,
  });

  const [compareOpen, setCompareOpen] = React.useState(false);
  const [players, setPlayers] = React.useState<any[]>([]);
  const [search, setSearch] = React.useState('');
  const [filteredPlayers, setFilteredPlayers] = React.useState<any[]>([]);
  const [selectedPlayer, setSelectedPlayer] = React.useState<any>(null);
  const [loadingCompare, setLoadingCompare] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const [dropdownPos, setDropdownPos] = React.useState<{left: number, top: number, width: number}>({left: 0, top: 0, width: 0});

  React.useEffect(() => {
    if (compareOpen && players.length === 0 && player) {
      fetch('/api/teams').then(res => res.json()).then(teams => {
        const allPlayers: any[] = [];
        teams.forEach((team: any) => {
          team.players.forEach((p: any) => allPlayers.push({ ...p, team }));
        });
        setPlayers(allPlayers.filter(p => p.id !== player.id));
      });
    }
  }, [compareOpen, players.length, player]);

  React.useEffect(() => {
    if (!search) {
      setFilteredPlayers(players);
    } else {
      setFilteredPlayers(players.filter(p =>
        p.nickname.toLowerCase().includes(search.toLowerCase()) ||
        p.team?.name?.toLowerCase().includes(search.toLowerCase())
      ));
    }
  }, [search, players]);

  React.useEffect(() => {
    if (compareOpen && inputRef.current) {
      const rect = inputRef.current.getBoundingClientRect();
      setDropdownPos({
        left: rect.left,
        top: rect.bottom + window.scrollY,
        width: rect.width,
      });
    }
  }, [compareOpen, search, filteredPlayers.length]);

  async function handleSelectPlayer(p: any) {
    setLoadingCompare(true);
    const res = await fetch(`/api/players/${p.id}`);
    const fullPlayer = await res.json();
    setSelectedPlayer(fullPlayer);
    setLoadingCompare(false);
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white">
        <NavigationBar />
        <div className="max-w-2xl mx-auto py-8 px-4">
          <div className="animate-pulse h-8 w-1/3 bg-gray-700 rounded mb-4" />
          <div className="animate-pulse h-32 w-32 bg-gray-800 rounded-full mb-4" />
          <div className="animate-pulse h-6 w-1/2 bg-gray-700 rounded mb-2" />
          <div className="animate-pulse h-4 w-1/4 bg-gray-700 rounded mb-2" />
        </div>
      </div>
    );
  }
  if (isError || !player) {
    return (
      <div className="min-h-screen bg-black text-white">
        <NavigationBar />
        <div className="max-w-2xl mx-auto py-8 px-4">
          <Link href="/teams" className="text-orange-600 font-bold mb-4 inline-block">&larr; Teams</Link>
          <div className="text-red-500 font-bold">Player not found.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      <NavigationBar />
      <div className="max-w-2xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-4">
          <Link href={`/teams/${player.teamId}`} className="text-orange-600 font-bold inline-block">&larr; Back to Team</Link>
          <button
            className="px-4 py-2 rounded-lg bg-yellow-400 text-black font-bold shadow hover:bg-yellow-300 transition"
            onClick={() => setCompareOpen(true)}
          >
            Compare
          </button>
        </div>
        <div className="flex items-center mb-6">
          {player.photoUrl ? (
            <img src={player.photoUrl} alt={player.nickname} className="w-32 h-32 rounded-full mr-6 border-4 border-gray-700" />
          ) : (
            <div className="w-32 h-32 rounded-full mr-6 bg-gray-800 flex items-center justify-center text-4xl font-bold">
              {player.nickname?.[0]}
            </div>
          )}
          <div>
            <h1 className="text-3xl font-bold text-secondary">{player.nickname}</h1>
            {player.realName && <div className="text-gray-400 text-lg">{player.realName}</div>}
            <div className="text-gray-400 text-sm mb-1">{getFlagEmoji(player.country)} {player.country}</div>
            {player.role && <div className="text-xs text-primary">Role: {player.role}</div>}
            <div className="text-xs mt-2">
              Team: <Link href={`/teams/${player.teamId}`} className="text-orange-400 underline hover:text-orange-300">{player.team?.name || "View Team"}</Link>
            </div>
          </div>
        </div>
        <div className="mb-8">
          <h2 className="text-xl font-bold mb-2 text-primary">Player Stats</h2>
          {player.stats ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Object.entries(player.stats as Record<string, any>).map(([key, value]) => (
                <div key={key} className="bg-surface rounded p-3 text-center group relative">
                  <div className="font-bold text-white text-lg">{value}</div>
                  <div className="text-xs text-gray-400 mt-1 flex items-center justify-center gap-1">
                    <span>{key.replace(/([A-Z])/g, ' $1')}</span>
                    {STAT_TOOLTIPS[key] && (
                      <Tooltip content={STAT_TOOLTIPS[key]}>
                        <span>?</span>
                      </Tooltip>
                    )}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-gray-500 italic">No stats available yet.</div>
          )}
        </div>
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.04, y: -4, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.18)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="bg-surface p-4 relative shadow-none geometric-card overflow-visible"
            style={{ clipPath: 'polygon(0 0, 92% 0, 100% 12%, 100% 100%, 8% 100%, 0 88%)', borderColor: GAME_ACCENTS[player.team?.tournaments?.[0]?.game || player.team?.game || 'CS2'] }}
          >
            {/* SVG Outline */}
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ zIndex: 1 }}
              preserveAspectRatio="none"
            >
              <line x1="0" y1="0" x2="92" y2="0" stroke={GAME_ACCENTS[player.team?.tournaments?.[0]?.game || player.team?.game || 'CS2']} strokeWidth="3" />
              <line x1="92" y1="0" x2="100" y2="12" stroke={GAME_ACCENTS[player.team?.tournaments?.[0]?.game || player.team?.game || 'CS2']} strokeWidth="3" />
              <line x1="100" y1="12" x2="100" y2="100" stroke={GAME_ACCENTS[player.team?.tournaments?.[0]?.game || player.team?.game || 'CS2']} strokeWidth="1.5" />
              <line x1="100" y1="100" x2="8" y2="100" stroke={GAME_ACCENTS[player.team?.tournaments?.[0]?.game || player.team?.game || 'CS2']} strokeWidth="3" />
              <line x1="8" y1="100" x2="0" y2="88" stroke={GAME_ACCENTS[player.team?.tournaments?.[0]?.game || player.team?.game || 'CS2']} strokeWidth="3" />
              <line x1="0" y1="88" x2="0" y2="0" stroke={GAME_ACCENTS[player.team?.tournaments?.[0]?.game || player.team?.game || 'CS2']} strokeWidth="1.5" />
            </svg>
            <div className="relative z-10">
              <h3 className="text-md font-bold mb-2 text-primary">Recent Matches</h3>
              {player.recentMatches && player.recentMatches.length > 0 ? (
                <table className="w-full text-sm">
                  <thead>
                    <tr className="text-gray-400">
                      <th className="text-left font-semibold pb-1">Opponent</th>
                      <th className="text-left font-semibold pb-1">Date</th>
                      <th className="text-left font-semibold pb-1">Score</th>
                      <th className="text-left font-semibold pb-1">Result</th>
                      <th className="text-left font-semibold pb-1">Tournament</th>
                    </tr>
                  </thead>
                  <tbody>
                    {player.recentMatches.map((m: any) => (
                      <tr key={m.id} className="border-b border-gray-800 last:border-0 hover:bg-gray-800 cursor-pointer transition" onClick={() => window.location.href = `/matches/${m.id}` }>
                        <td className="py-1 font-bold text-white">{m.opponent}</td>
                        <td className="py-1 text-gray-400">{new Date(m.date).toLocaleDateString()}</td>
                        <td className="py-1 text-gray-200">{m.score}</td>
                        <td className={`py-1 font-bold ${m.result === 'W' ? 'text-green-400' : 'text-red-400'}`}>{m.result}</td>
                        <td className="py-1 text-gray-400">{m.tournament}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <div className="text-gray-500 italic">No recent matches found.</div>
              )}
            </div>
          </motion.div>
        </div>
        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.04, y: -4, boxShadow: '0 4px 24px 0 rgba(0,0,0,0.18)' }}
            transition={{ type: 'spring', stiffness: 300, damping: 24 }}
            className="bg-surface p-4 relative shadow-none geometric-card overflow-visible"
            style={{ clipPath: 'polygon(0 0, 92% 0, 100% 12%, 100% 100%, 8% 100%, 0 88%)', borderColor: GAME_ACCENTS[player.team?.tournaments?.[0]?.game || player.team?.game || 'CS2'] }}
          >
            <svg
              viewBox="0 0 100 100"
              className="absolute inset-0 w-full h-full pointer-events-none"
              style={{ zIndex: 1 }}
              preserveAspectRatio="none"
            >
              <line x1="0" y1="0" x2="92" y2="0" stroke={GAME_ACCENTS[player.team?.tournaments?.[0]?.game || player.team?.game || 'CS2']} strokeWidth="3" />
              <line x1="92" y1="0" x2="100" y2="12" stroke={GAME_ACCENTS[player.team?.tournaments?.[0]?.game || player.team?.game || 'CS2']} strokeWidth="3" />
              <line x1="100" y1="12" x2="100" y2="100" stroke={GAME_ACCENTS[player.team?.tournaments?.[0]?.game || player.team?.game || 'CS2']} strokeWidth="1.5" />
              <line x1="100" y1="100" x2="8" y2="100" stroke={GAME_ACCENTS[player.team?.tournaments?.[0]?.game || player.team?.game || 'CS2']} strokeWidth="3" />
              <line x1="8" y1="100" x2="0" y2="88" stroke={GAME_ACCENTS[player.team?.tournaments?.[0]?.game || player.team?.game || 'CS2']} strokeWidth="3" />
              <line x1="0" y1="88" x2="0" y2="0" stroke={GAME_ACCENTS[player.team?.tournaments?.[0]?.game || player.team?.game || 'CS2']} strokeWidth="1.5" />
            </svg>
            <div className="relative z-10">
              <h3 className="text-md font-bold mb-2 text-primary">Achievements</h3>
              <ul className="list-disc ml-6 text-white text-sm space-y-1">
                <li>2024 MVP - {player.team?.name || 'Team'}</li>
                <li>3x Tournament Winner</li>
                <li>Most Kills in a Match: {player.stats?.Kills || 0}</li>
                <li>Fan Favorite Award</li>
              </ul>
            </div>
          </motion.div>
        </div>
        <Modal open={compareOpen} onClose={() => { setCompareOpen(false); setSelectedPlayer(null); setSearch(''); }}>
          <h2 className="text-xl font-bold mb-4 text-primary">Compare Players</h2>
          <div className="mb-4 relative min-h-[120px] pb-4">
            <input
              ref={inputRef}
              className="w-full bg-gray-900 text-white font-semibold px-4 py-2 rounded-lg border-2 border-gray-700 focus:outline-none focus:ring-2 focus:ring-yellow-400"
              placeholder="Search for a player..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />
            {typeof window !== 'undefined' && search && filteredPlayers.length > 0 && inputRef.current && ReactDOM.createPortal(
              <div
                className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-[9999] max-h-60 overflow-y-auto"
                style={{
                  position: 'absolute',
                  left: dropdownPos.left,
                  top: dropdownPos.top,
                  width: dropdownPos.width,
                }}
              >
                {filteredPlayers.map(p => (
                  <div
                    key={p.id}
                    className="px-4 py-2 cursor-pointer hover:bg-gray-800 text-white flex items-center gap-2"
                    onClick={() => { handleSelectPlayer(p); setSearch(''); }}
                  >
                    <span className="font-bold">{p.nickname}</span>
                    <span className="text-xs text-gray-400">({p.team?.name})</span>
                  </div>
                ))}
              </div>,
              document.body
            )}
            {typeof window !== 'undefined' && search && filteredPlayers.length === 0 && inputRef.current && ReactDOM.createPortal(
              <div
                className="bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-[9999] px-4 py-2 text-gray-400"
                style={{
                  position: 'absolute',
                  left: dropdownPos.left,
                  top: dropdownPos.top,
                  width: dropdownPos.width,
                }}
              >No players found.</div>,
              document.body
            )}
          </div>
          {loadingCompare && <div className="text-center text-gray-400 py-4">Loading player...</div>}
          {selectedPlayer && !loadingCompare && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Player 1 */}
              <div className="bg-surface rounded-xl p-4 border border-gray-700">
                <div className="font-bold text-lg mb-2 text-yellow-400">{player.nickname}</div>
                <div className="text-xs text-gray-400 mb-2">{player.team?.name}</div>
                <div className="mb-2">{(Object.entries(player.stats || {}) as [string, any][]).map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm"><span>{k}</span><span className="font-bold">{v}</span></div>
                ))}</div>
                <div className="text-xs text-gray-500 mt-2">Achievements:</div>
                <ul className="list-disc ml-5 text-xs text-white">
                  <li>2024 MVP</li>
                  <li>Most Kills: {player.stats?.Kills}</li>
                </ul>
              </div>
              {/* Player 2 */}
              <div className="bg-surface rounded-xl p-4 border border-gray-700">
                <div className="font-bold text-lg mb-2 text-yellow-400">{selectedPlayer.nickname}</div>
                <div className="text-xs text-gray-400 mb-2">{selectedPlayer.team?.name}</div>
                <div className="mb-2">{(Object.entries(selectedPlayer.stats || {}) as [string, any][]).map(([k, v]) => (
                  <div key={k} className="flex justify-between text-sm"><span>{k}</span><span className="font-bold">{v}</span></div>
                ))}</div>
                <div className="text-xs text-gray-500 mt-2">Achievements:</div>
                <ul className="list-disc ml-5 text-xs text-white">
                  <li>2024 MVP</li>
                  <li>Most Kills: {selectedPlayer.stats?.Kills}</li>
                </ul>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
} 