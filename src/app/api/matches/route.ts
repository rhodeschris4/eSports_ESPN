import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const teamId = searchParams.get('teamId');

    const where: any = {};
    if (status) {
      where.status = status;
    }
    if (teamId) {
      where.OR = [
        { team1Id: teamId },
        { team2Id: teamId },
      ];
    }

    const matches = await prisma.match.findMany({
      where,
      include: {
        tournament: true,
        team1: true,
        team2: true,
        streamLinks: true,
      },
    });
    return NextResponse.json(matches);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch matches' }, { status: 500 });
  }
} 