"use client";
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';

const games = [
  { label: 'CS2', value: 'CS2', color: '#ff7a00' },
  { label: 'Valorant', value: 'VALORANT', color: '#e10600' },
  { label: 'LoL', value: 'LOL', color: '#a259ff' },
];

export default function NavigationBar() {
  const pathname = usePathname();
  const activeGame = games.find(g => pathname.startsWith(`/games/${g.value}`))?.value || '';
  const underlineColor = 'border-gray-500';

  // Global search state
  const [search, setSearch] = useState('');
  const [results, setResults] = useState<any>({ teams: [], tournaments: [], matches: [] });
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const [selectedIdx, setSelectedIdx] = useState<number>(-1);

  // Flattened results for keyboard nav
  const flatResults = [
    ...results.teams.map((t: any) => ({ type: 'team', id: t.id, name: t.name })),
    ...results.tournaments.map((t: any) => ({ type: 'tournament', id: t.id, name: t.name })),
    ...results.matches.map((m: any) => ({ type: 'match', id: m.id, name: `${m.team1?.name} vs ${m.team2?.name}` })),
  ];

  function handleResultClick(res: any) {
    setShowDropdown(false);
    setSearch('');
    setSelectedIdx(-1);
    if (res.type === 'team') router.push(`/teams/${res.id}`);
    if (res.type === 'tournament') router.push(`/tournaments/${res.id}`);
    if (res.type === 'match') router.push(`/matches/${res.id}`);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!showDropdown || flatResults.length === 0) return;
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIdx(idx => Math.min(idx + 1, flatResults.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIdx(idx => Math.max(idx - 1, 0));
    } else if (e.key === 'Enter' && selectedIdx >= 0) {
      handleResultClick(flatResults[selectedIdx]);
    }
  }

  // Reset selectedIdx when results or search changes
  useEffect(() => { setSelectedIdx(-1); }, [search, results]);

  useEffect(() => {
    if (!search) {
      setResults({ teams: [], tournaments: [], matches: [] });
      return;
    }
    let ignore = false;
    async function fetchResults() {
      const [teams, tournaments, matches] = await Promise.all([
        fetch('/api/teams').then(r => r.json()),
        fetch('/api/tournaments').then(r => r.json()),
        fetch('/api/matches').then(r => r.json()),
      ]);
      if (ignore) return;
      setResults({
        teams: teams.filter((t: any) => t.name.toLowerCase().includes(search.toLowerCase())),
        tournaments: tournaments.filter((t: any) => t.name.toLowerCase().includes(search.toLowerCase())),
        matches: matches.filter((m: any) =>
          m.team1?.name?.toLowerCase().includes(search.toLowerCase()) ||
          m.team2?.name?.toLowerCase().includes(search.toLowerCase())
        ),
      });
    }
    fetchResults();
    return () => { ignore = true; };
  }, [search]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showDropdown]);

  return (
    <nav className={`flex items-center justify-between bg-gray-950 px-6 py-3 shadow-lg sticky top-0 z-50 border-b-4 ${underlineColor}`}>
      <div className="flex items-center gap-8">
        <span className="text-white font-extrabold text-2xl tracking-tight">
          <Link href="/">eSports ESPN</Link>
        </span>
        <div className="flex gap-2">
          {games.map((game) => {
            const isActive = activeGame === game.value;
            return (
              <Link
                key={game.value}
                href={`/games/${game.value}`}
                className={`relative flex items-center justify-center px-5 py-2 font-bold rounded-lg transition-all duration-200 text-lg bg-gray-900 text-white hover:bg-opacity-80`}
                style={{ clipPath: 'polygon(0 0, 92% 0, 100% 12%, 100% 100%, 8% 100%, 0 88%)', minWidth: 80 }}
              >
                {/* SVG Outline */}
                <svg
                  viewBox="0 0 100 100"
                  className="absolute inset-0 w-full h-full pointer-events-none"
                  style={{ zIndex: 1 }}
                  preserveAspectRatio="none"
                >
                  {/* Top edge */}
                  <line x1="0" y1="0" x2="92" y2="0" stroke={game.color} strokeWidth="3" />
                  {/* Top right diagonal */}
                  <line x1="92" y1="0" x2="100" y2="12" stroke={game.color} strokeWidth="3" />
                  {/* Right edge (thin) */}
                  <line x1="100" y1="12" x2="100" y2="100" stroke={game.color} strokeWidth="1.5" />
                  {/* Bottom edge */}
                  <line x1="100" y1="100" x2="8" y2="100" stroke={game.color} strokeWidth="3" />
                  {/* Bottom left diagonal */}
                  <line x1="8" y1="100" x2="0" y2="88" stroke={game.color} strokeWidth="3" />
                  {/* Left edge (thin) */}
                  <line x1="0" y1="88" x2="0" y2="0" stroke={game.color} strokeWidth="1.5" />
                </svg>
                {/* Button Content */}
                <span className="relative z-10 flex items-center justify-center w-full h-full" style={{ color: isActive ? game.color : '#fff' }}>{game.label}</span>
              </Link>
            );
          })}
          <Link
            href="/leaderboards"
            className={`relative flex items-center justify-center px-5 py-2 font-bold rounded-lg transition-all duration-200 text-lg bg-gray-900 text-white hover:bg-opacity-80`}
            style={{ clipPath: 'polygon(0 0, 92% 0, 100% 12%, 100% 100%, 8% 100%, 0 88%)', minWidth: 120 }}
          >
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
            <span className="relative z-10">Leaderboards</span>
          </Link>
        </div>
      </div>
      <div className="flex gap-6 items-center relative">
        <Link href="/" className="text-white hover:text-orange-600 font-semibold">Home</Link>
        <Link href="/tournaments" className="text-white hover:text-orange-600 font-semibold">Tournaments</Link>
        <Link href="/teams" className="text-white hover:text-orange-600 font-semibold">Teams</Link>
        <Link href="/live" className="text-white hover:text-orange-600 font-semibold">Live</Link>
        {/* Global Search */}
        <div className="relative" ref={dropdownRef}>
          <input
            type="text"
            className="bg-surface text-white rounded px-3 py-1 border border-gray-700 ml-4 w-48 focus:outline-none focus:ring-2 focus:ring-orange-600"
            placeholder="Search..."
            value={search}
            onChange={e => { setSearch(e.target.value); setShowDropdown(true); }}
            onFocus={() => setShowDropdown(true)}
            onKeyDown={handleKeyDown}
          />
          {showDropdown && search && (
            <div className="absolute right-0 mt-2 w-80 bg-gray-900 border border-gray-700 rounded-lg shadow-lg z-50 p-3 max-h-96 overflow-y-auto">
              {results.teams.length > 0 && (
                <div className="mb-2">
                  <div className="text-xs text-orange-400 font-bold mb-1">Teams</div>
                  {results.teams.map((t: any, i: number) => {
                    const idx = i;
                    const isSelected = selectedIdx === idx;
                    return (
                      <div
                        key={t.id}
                        className={`px-2 py-1 hover:bg-gray-800 rounded cursor-pointer ${isSelected ? 'bg-orange-900' : ''}`}
                        onClick={() => handleResultClick({ type: 'team', id: t.id, name: t.name })}
                        onMouseEnter={() => setSelectedIdx(idx)}
                      >
                        {t.name}
                      </div>
                    );
                  })}
                </div>
              )}
              {results.tournaments.length > 0 && (
                <div className="mb-2">
                  <div className="text-xs text-red-400 font-bold mb-1">Tournaments</div>
                  {results.tournaments.map((t: any, i: number) => {
                    const idx = results.teams.length + i;
                    const isSelected = selectedIdx === idx;
                    return (
                      <div
                        key={t.id}
                        className={`px-2 py-1 hover:bg-gray-800 rounded cursor-pointer ${isSelected ? 'bg-red-900' : ''}`}
                        onClick={() => handleResultClick({ type: 'tournament', id: t.id, name: t.name })}
                        onMouseEnter={() => setSelectedIdx(idx)}
                      >
                        {t.name}
                      </div>
                    );
                  })}
                </div>
              )}
              {results.matches.length > 0 && (
                <div className="mb-2">
                  <div className="text-xs text-purple-400 font-bold mb-1">Matches</div>
                  {results.matches.map((m: any, i: number) => {
                    const idx = results.teams.length + results.tournaments.length + i;
                    const isSelected = selectedIdx === idx;
                    return (
                      <div
                        key={m.id}
                        className={`px-2 py-1 hover:bg-gray-800 rounded cursor-pointer ${isSelected ? 'bg-purple-900' : ''}`}
                        onClick={() => handleResultClick({ type: 'match', id: m.id, name: `${m.team1?.name} vs ${m.team2?.name}` })}
                        onMouseEnter={() => setSelectedIdx(idx)}
                      >
                        {m.team1?.name} vs {m.team2?.name}
                      </div>
                    );
                  })}
                </div>
              )}
              {results.teams.length === 0 && results.tournaments.length === 0 && results.matches.length === 0 && (
                <div className="text-gray-400 text-sm">No results found.</div>
              )}
            </div>
          )}
        </div>
      </div>
    </nav>
  );
} 