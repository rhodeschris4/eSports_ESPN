import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const teams = await prisma.team.findMany({
      include: {
        players: true,
        tournaments: true,
        matchesAsTeam1: {
          include: {
            team1: true,
            team2: true,
            streamLinks: true,
          },
        },
        matchesAsTeam2: {
          include: {
            team1: true,
            team2: true,
            streamLinks: true,
          },
        },
      },
    });
    return NextResponse.json(teams);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch teams' }, { status: 500 });
  }
} 