import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
  try {
    const tournaments = await prisma.tournament.findMany({
      include: {
        teams: true,
        matches: {
          include: {
            team1: true,
            team2: true,
            streamLinks: true,
          },
        },
        streamLinks: true,
      },
    });
    return NextResponse.json(tournaments);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch tournaments' }, { status: 500 });
  }
} 