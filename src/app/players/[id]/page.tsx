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
  const [showAllNews, setShowAllNews] = React.useState(false);

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
        {/* Player Stats at the Top */}
        {player.stats && Object.keys(player.stats).length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-2 text-primary">Stats</h2>
            <div className="bg-surface rounded-xl p-4 border border-gray-700 grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Object.entries(player.stats).map(([key, value]) => (
                <div key={key} className="flex flex-col items-center">
                  <span className="text-sm text-gray-400 font-semibold mb-1">
                    <Tooltip content={STAT_TOOLTIPS[key] || key}>{String(key)}</Tooltip>
                  </span>
                  <span className="text-lg font-bold text-white">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
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
            <h1 className="text-3xl font-bold text-secondary flex items-center gap-2">
              {player.nickname}
              {player.hltvId && (
                <span className="text-xs text-gray-400 ml-2">HLTV #{player.hltvId}</span>
              )}
            </h1>
            {player.realName && <div className="text-gray-400 text-lg">{player.realName}</div>}
            <div className="text-gray-400 text-sm mb-1 flex items-center gap-2">
              {getFlagEmoji(player.countryCode || player.country)} {player.country}
              {player.age && <span className="ml-2">Age: <span className="text-white font-bold">{player.age}</span></span>}
            </div>
            {player.role && <div className="text-xs text-primary">Role: {player.role}</div>}
            <div className="text-xs mt-2">
              Team: <Link href={`/teams/${player.teamId}`} className="text-orange-400 underline hover:text-orange-300">{player.team?.name || "View Team"}</Link>
            </div>
            {/* Social Links */}
            <div className="flex gap-3 mt-2">
              {player.twitter && <a href={player.twitter} target="_blank" rel="noopener noreferrer" title="Twitter" className="text-blue-400 hover:text-blue-300"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M24 4.557a9.93 9.93 0 0 1-2.828.775 4.932 4.932 0 0 0 2.165-2.724c-.951.564-2.005.974-3.127 1.195A4.92 4.92 0 0 0 16.616 3c-2.73 0-4.942 2.21-4.942 4.932 0 .386.045.762.127 1.124C7.728 8.807 4.1 6.884 1.671 3.965c-.423.722-.666 1.561-.666 2.475 0 1.708.87 3.216 2.188 4.099a4.904 4.904 0 0 1-2.237-.616c-.054 2.281 1.581 4.415 3.949 4.89-.386.104-.793.16-1.213.16-.297 0-.583-.028-.862-.08.584 1.822 2.28 3.15 4.29 3.187A9.868 9.868 0 0 1 0 19.54a13.94 13.94 0 0 0 7.548 2.209c9.057 0 14.009-7.496 14.009-13.986 0-.213-.005-.425-.014-.636A9.936 9.936 0 0 0 24 4.557z"/></svg></a>}
              {player.twitch && <a href={player.twitch} target="_blank" rel="noopener noreferrer" title="Twitch" className="text-purple-400 hover:text-purple-300"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M4.285 0L.857 4.286v15.428h5.143V24h3.429l3.429-4.286h4.286L23.143 15.43V0H4.285zm16.285 14.571l-2.571 2.572h-4.286l-3.429 4.285v-4.285H2.857V1.714h17.714v12.857z"/><path d="M15.429 6.857h1.714v5.143h-1.714zm-4.286 0h1.714v5.143h-1.714z"/></svg></a>}
              {player.facebook && <a href={player.facebook} target="_blank" rel="noopener noreferrer" title="Facebook" className="text-blue-600 hover:text-blue-500"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M22.675 0h-21.35C.595 0 0 .592 0 1.326v21.348C0 23.408.595 24 1.325 24h11.495v-9.294H9.692v-3.622h3.128V8.413c0-3.1 1.893-4.788 4.659-4.788 1.325 0 2.463.099 2.797.143v3.24l-1.918.001c-1.504 0-1.797.715-1.797 1.763v2.313h3.587l-.467 3.622h-3.12V24h6.116C23.406 24 24 23.408 24 22.674V1.326C24 .592 23.406 0 22.675 0"/></svg></a>}
              {player.instagram && <a href={player.instagram} target="_blank" rel="noopener noreferrer" title="Instagram" className="text-pink-400 hover:text-pink-300"><svg width="20" height="20" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 1.366.062 2.633.334 3.608 1.308.974.974 1.246 2.241 1.308 3.608.058 1.266.069 1.646.069 4.85s-.012 3.584-.07 4.85c-.062 1.366-.334 2.633-1.308 3.608-.974.974-2.241 1.246-3.608 1.308-1.266.058-1.646.069-4.85.069s-3.584-.012-4.85-.07c-1.366-.062-2.633-.334-3.608-1.308-.974-.974-1.246-2.241-1.308-3.608C2.175 15.647 2.163 15.267 2.163 12s.012-3.584.07-4.85c.062-1.366.334-2.633 1.308-3.608C4.515 2.497 5.782 2.225 7.148 2.163 8.414 2.105 8.794 2.163 12 2.163zm0-2.163C8.741 0 8.332.012 7.052.07 5.771.128 4.635.4 3.661 1.374c-.974.974-1.246 2.241-1.308 3.608C2.175 8.414 2.163 8.794 2.163 12c0 3.206.012 3.586.07 4.85.062 1.366.334 2.633 1.308 3.608.974.974 2.241 1.246 3.608 1.308 1.266.058 1.646.069 4.85.069s3.584-.012 4.85-.07c1.366-.062 2.633-.334 3.608-1.308.974-.974 1.246-2.241 1.308-3.608.058-1.266.069-1.646.069-4.85s-.012-3.584-.07-4.85c-.062-1.366-.334-2.633-1.308-3.608-.974-.974-2.241-1.246-3.608-1.308C15.647 2.175 15.267 2.163 12 2.163z"/><path d="M12 5.838A6.162 6.162 0 0 0 5.838 12 6.162 6.162 0 0 0 12 18.162 6.162 6.162 0 0 0 18.162 12 6.162 6.162 0 0 0 12 5.838zm0 10.162A3.999 3.999 0 1 1 12 8a3.999 3.999 0 0 1 0 7.999zm6.406-11.845a1.44 1.44 0 1 1-2.88 0 1.44 1.44 0 0 1 2.88 0z"/></svg></a>}
            </div>
          </div>
        </div>
        {/* HLTV Team History */}
        {player.hltvTeams && Array.isArray(player.hltvTeams) && player.hltvTeams.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-2 text-primary">HLTV Team History</h2>
            <div className="bg-surface rounded-xl p-4 border border-gray-700">
              <ul className="list-disc ml-6 text-white text-sm space-y-1">
                {player.hltvTeams.map((team: any, idx: number) => (
                  <li key={idx}>
                    <span className="font-bold text-yellow-400">{team.name}</span>
                    {team.startDate && (
                      <span className="text-xs text-gray-400 ml-2">{new Date(team.startDate).getFullYear()}</span>
                    )}
                    {team.leaveDate && (
                      <span className="text-xs text-gray-400 ml-2">- {new Date(team.leaveDate).getFullYear()}</span>
                    )}
                    {team.trophies && Array.isArray(team.trophies) && team.trophies.length > 0 && (
                      <span className="ml-2 text-xs text-green-400">🏆 {team.trophies.map((t: any) => t.name).join(', ')}</span>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        {/* HLTV Achievements */}
        {player.hltvAchievements && Array.isArray(player.hltvAchievements) && player.hltvAchievements.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-2 text-primary">HLTV Achievements</h2>
            <div className="bg-surface rounded-xl p-4 border border-gray-700">
              <ul className="list-disc ml-6 text-white text-sm space-y-1">
                {player.hltvAchievements.map((ach: any, idx: number) => (
                  <li key={idx}>
                    <span className="font-bold text-yellow-400">{ach.event?.name}</span>
                    {ach.place && <span className="ml-2 text-xs text-gray-400">{ach.place}</span>}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
        {/* HLTV News */}
        {player.hltvNews && Array.isArray(player.hltvNews) && player.hltvNews.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-bold mb-2 text-primary">HLTV News</h2>
            <div className="bg-surface rounded-xl p-4 border border-gray-700">
              <ul className="list-disc ml-6 text-white text-sm space-y-1">
                {(showAllNews ? player.hltvNews : player.hltvNews.slice(0, 10)).map((news: any, idx: number) => (
                  <li key={idx}>
                    <a href={news.link} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline hover:text-blue-300">{news.name}</a>
                  </li>
                ))}
              </ul>
              {player.hltvNews.length > 10 && (
                <button
                  className="mt-2 px-4 py-1 rounded bg-gray-800 text-gray-200 border border-gray-600 hover:bg-gray-700 transition text-xs"
                  onClick={() => setShowAllNews(v => !v)}
                >
                  {showAllNews ? 'Show less' : `Show all (${player.hltvNews.length})`}
                </button>
              )}
            </div>
          </div>
        )}
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
        {/* DEBUG: Show raw player object */}
        {/*
        <pre className="bg-black text-green-400 text-xs p-2 rounded mb-4 overflow-x-auto max-w-full whitespace-pre-wrap">{JSON.stringify(player, null, 2)}</pre>
        */}
      </div>
    </div>
  );
} 