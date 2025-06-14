import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const player = await prisma.player.findUnique({
      where: { id: params.id },
      include: { team: { include: { tournaments: true } } },
    });
    if (!player) {
      return NextResponse.json({ error: 'Player not found' }, { status: 404 });
    }
    // Robust game detection
    let game = null;
    if (player.team?.tournaments && player.team.tournaments.length > 0) {
      // Use the most recent tournament's game
      const sortedTournaments = [...player.team.tournaments].sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
      game = sortedTournaments[0]?.game;
      if (!game) {
        // Fallback: use most common game
        const gameCounts = player.team.tournaments.reduce((acc: Record<string, number>, t: any) => {
          acc[t.game] = (acc[t.game] || 0) + 1;
          return acc;
        }, {});
        game = Object.entries(gameCounts as any).sort((a, b) => (b[1] as number) - (a[1] as number))[0]?.[0];
      }
    }
    if (!game && player.team?.game) game = player.team.game;
    // Game-specific stats
    if (game === 'CS2') {
      player.stats = {
        "Kills": Math.floor(Math.random() * 2000),
        "Deaths": Math.floor(Math.random() * 1800),
        "Assists": Math.floor(Math.random() * 800),
        "K/D Ratio": (1.0 + Math.random()).toFixed(2),
        "Headshot %": (40 + Math.random() * 30).toFixed(1) + '%',
        "ADR": (60 + Math.random() * 40).toFixed(1),
        "Clutches": Math.floor(Math.random() * 30),
        "Entry Kills": Math.floor(Math.random() * 100),
        "Maps Played": Math.floor(30 + Math.random() * 40),
      };
    } else if (game === 'VALORANT') {
      player.stats = {
        "Kills": Math.floor(Math.random() * 2000),
        "Deaths": Math.floor(Math.random() * 1800),
        "Assists": Math.floor(Math.random() * 900),
        "K/D Ratio": (1.0 + Math.random()).toFixed(2),
        "ACS": Math.floor(150 + Math.random() * 100),
        "KAST %": (60 + Math.random() * 30).toFixed(1) + '%',
        "Headshot %": (30 + Math.random() * 30).toFixed(1) + '%',
        "First Bloods": Math.floor(Math.random() * 80),
        "Maps Played": Math.floor(30 + Math.random() * 40),
      };
    } else if (game === 'LOL') {
      player.stats = {
        "Kills": Math.floor(Math.random() * 400),
        "Deaths": Math.floor(Math.random() * 300),
        "Assists": Math.floor(Math.random() * 700),
        "KDA": (2.0 + Math.random() * 4).toFixed(2),
        "CS/Min": (5 + Math.random() * 4).toFixed(2),
        "Gold/Min": (300 + Math.random() * 100).toFixed(0),
        "Damage/Min": (400 + Math.random() * 200).toFixed(0),
        "Wards Placed": Math.floor(Math.random() * 200),
        "Games Played": Math.floor(20 + Math.random() * 30),
      };
    } else {
      player.stats = player.stats || {
        Kills: Math.floor(Math.random() * 100),
        Deaths: Math.floor(Math.random() * 100),
        Assists: Math.floor(Math.random() * 100),
        "K/D Ratio": (Math.random() * 2).toFixed(2),
        "Headshot %": (Math.random() * 100).toFixed(1) + '%',
      };
    }
    // Find recent matches for this player (up to 5, most recent, completed)
    const recentMatches = await prisma.match.findMany({
      where: {
        status: 'completed',
        OR: [
          { team1Id: player.teamId },
          { team2Id: player.teamId },
        ],
      },
      orderBy: { scheduledTime: 'desc' },
      take: 10, // get more in case player switched teams
      include: { team1: true, team2: true, tournament: true },
    });
    // Filter to matches where player was on the team at the time (simple version: current team)
    const filteredMatches = recentMatches.filter((m: any) => m.team1Id === player.teamId || m.team2Id === player.teamId).slice(0, 5);
    // Map to display info
    player.recentMatches = filteredMatches.map((m: any) => {
      const isTeam1 = m.team1Id === player.teamId;
      const teamScore = isTeam1 ? m.team1Score : m.team2Score;
      const oppScore = isTeam1 ? m.team2Score : m.team1Score;
      const opponent = isTeam1 ? m.team2.name : m.team1.name;
      const result = teamScore > oppScore ? 'W' : 'L';
      return {
        id: m.id,
        opponent,
        date: m.scheduledTime,
        score: `${teamScore} - ${oppScore}`,
        result,
        tournament: m.tournament?.name,
      };
    });
    return NextResponse.json(player);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch player' }, { status: 500 });
  }
} 