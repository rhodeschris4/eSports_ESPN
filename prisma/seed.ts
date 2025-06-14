import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  // Delete existing data for a clean seed
  await prisma.streamLink.deleteMany();
  await prisma.match.deleteMany();
  await prisma.tournament.deleteMany();
  await prisma.player.deleteMany();
  await prisma.team.deleteMany();

  // --- CS2 TEAMS ---
  const cs2TeamA = await prisma.team.create({
    data: {
      name: 'CS2 Alpha',
      country: 'USA',
      logoUrl: 'https://placehold.co/64x64/00D4FF/FFF?text=CA',
      ranking: 1,
      players: { create: [
        { nickname: 'Alpha1', country: 'USA' },
        { nickname: 'Alpha2', country: 'USA' },
        { nickname: 'Alpha3', country: 'USA' },
        { nickname: 'Alpha4', country: 'USA' },
        { nickname: 'Alpha5', country: 'USA' },
      ] },
    }, include: { players: true },
  });
  const cs2TeamB = await prisma.team.create({
    data: {
      name: 'CS2 Bravo',
      country: 'Sweden',
      logoUrl: 'https://placehold.co/64x64/39FF14/FFF?text=CB',
      ranking: 2,
      players: { create: [
        { nickname: 'Bravo1', country: 'Sweden' },
        { nickname: 'Bravo2', country: 'Sweden' },
        { nickname: 'Bravo3', country: 'Sweden' },
        { nickname: 'Bravo4', country: 'Sweden' },
        { nickname: 'Bravo5', country: 'Sweden' },
      ] },
    }, include: { players: true },
  });
  const cs2TeamC = await prisma.team.create({
    data: {
      name: 'CS2 Cyclone',
      country: 'Brazil',
      logoUrl: 'https://placehold.co/64x64/F59E0B/FFF?text=CC',
      ranking: 3,
      players: { create: [
        { nickname: 'Cyclone1', country: 'Brazil' },
        { nickname: 'Cyclone2', country: 'Brazil' },
        { nickname: 'Cyclone3', country: 'Brazil' },
        { nickname: 'Cyclone4', country: 'Brazil' },
        { nickname: 'Cyclone5', country: 'Brazil' },
      ] },
    }, include: { players: true },
  });
  const cs2TeamD = await prisma.team.create({
    data: {
      name: 'CS2 Delta',
      country: 'Germany',
      logoUrl: 'https://placehold.co/64x64/8B5CF6/FFF?text=CD',
      ranking: 4,
      players: { create: [
        { nickname: 'Delta1', country: 'Germany' },
        { nickname: 'Delta2', country: 'Germany' },
        { nickname: 'Delta3', country: 'Germany' },
        { nickname: 'Delta4', country: 'Germany' },
        { nickname: 'Delta5', country: 'Germany' },
      ] },
    }, include: { players: true },
  });

  // --- VALORANT TEAMS ---
  const valTeamA = await prisma.team.create({
    data: {
      name: 'Valiant',
      country: 'Japan',
      logoUrl: 'https://placehold.co/64x64/00D4FF/FFF?text=VA',
      ranking: 1,
      players: { create: [
        { nickname: 'Val1', country: 'Japan' },
        { nickname: 'Val2', country: 'Japan' },
        { nickname: 'Val3', country: 'Japan' },
        { nickname: 'Val4', country: 'Japan' },
        { nickname: 'Val5', country: 'Japan' },
      ] },
    }, include: { players: true },
  });
  const valTeamB = await prisma.team.create({
    data: {
      name: 'Phoenix',
      country: 'UK',
      logoUrl: 'https://placehold.co/64x64/39FF14/FFF?text=VB',
      ranking: 2,
      players: { create: [
        { nickname: 'Phe1', country: 'UK' },
        { nickname: 'Phe2', country: 'UK' },
        { nickname: 'Phe3', country: 'UK' },
        { nickname: 'Phe4', country: 'UK' },
        { nickname: 'Phe5', country: 'UK' },
      ] },
    }, include: { players: true },
  });
  const valTeamC = await prisma.team.create({
    data: {
      name: 'Sentinels',
      country: 'USA',
      logoUrl: 'https://placehold.co/64x64/F59E0B/FFF?text=VC',
      ranking: 3,
      players: { create: [
        { nickname: 'Sen1', country: 'USA' },
        { nickname: 'Sen2', country: 'USA' },
        { nickname: 'Sen3', country: 'USA' },
        { nickname: 'Sen4', country: 'USA' },
        { nickname: 'Sen5', country: 'USA' },
      ] },
    }, include: { players: true },
  });
  const valTeamD = await prisma.team.create({
    data: {
      name: 'Astra',
      country: 'France',
      logoUrl: 'https://placehold.co/64x64/8B5CF6/FFF?text=VD',
      ranking: 4,
      players: { create: [
        { nickname: 'Ast1', country: 'France' },
        { nickname: 'Ast2', country: 'France' },
        { nickname: 'Ast3', country: 'France' },
        { nickname: 'Ast4', country: 'France' },
        { nickname: 'Ast5', country: 'France' },
      ] },
    }, include: { players: true },
  });

  // --- LOL TEAMS ---
  const lolTeamA = await prisma.team.create({
    data: {
      name: 'LoL Legends',
      country: 'South Korea',
      logoUrl: 'https://placehold.co/64x64/00D4FF/FFF?text=LA',
      ranking: 1,
      players: { create: [
        { nickname: 'Legend1', country: 'South Korea' },
        { nickname: 'Legend2', country: 'South Korea' },
        { nickname: 'Legend3', country: 'South Korea' },
        { nickname: 'Legend4', country: 'South Korea' },
        { nickname: 'Legend5', country: 'South Korea' },
      ] },
    }, include: { players: true },
  });
  const lolTeamB = await prisma.team.create({
    data: {
      name: 'LoL Titans',
      country: 'China',
      logoUrl: 'https://placehold.co/64x64/39FF14/FFF?text=LB',
      ranking: 2,
      players: { create: [
        { nickname: 'Titan1', country: 'China' },
        { nickname: 'Titan2', country: 'China' },
        { nickname: 'Titan3', country: 'China' },
        { nickname: 'Titan4', country: 'China' },
        { nickname: 'Titan5', country: 'China' },
      ] },
    }, include: { players: true },
  });
  const lolTeamC = await prisma.team.create({
    data: {
      name: 'LoL Phoenix',
      country: 'USA',
      logoUrl: 'https://placehold.co/64x64/F59E0B/FFF?text=LC',
      ranking: 3,
      players: { create: [
        { nickname: 'LP1', country: 'USA' },
        { nickname: 'LP2', country: 'USA' },
        { nickname: 'LP3', country: 'USA' },
        { nickname: 'LP4', country: 'USA' },
        { nickname: 'LP5', country: 'USA' },
      ] },
    }, include: { players: true },
  });
  const lolTeamD = await prisma.team.create({
    data: {
      name: 'LoL Dragons',
      country: 'Vietnam',
      logoUrl: 'https://placehold.co/64x64/8B5CF6/FFF?text=LD',
      ranking: 4,
      players: { create: [
        { nickname: 'Dragon1', country: 'Vietnam' },
        { nickname: 'Dragon2', country: 'Vietnam' },
        { nickname: 'Dragon3', country: 'Vietnam' },
        { nickname: 'Dragon4', country: 'Vietnam' },
        { nickname: 'Dragon5', country: 'Vietnam' },
      ] },
    }, include: { players: true },
  });

  // Helper to determine status
  function getTournamentStatus(startDate: Date, endDate: Date) {
    const now = new Date();
    if (now < startDate) return 'upcoming';
    if (now >= startDate && now <= endDate) return 'live';
    return 'completed';
  }

  // CS2 Tournaments
  const cs2T1Start = new Date(Date.now() + 86400000 * 2);
  const cs2T1End = new Date(Date.now() + 86400000 * 5);
  const cs2T1 = await prisma.tournament.create({
    data: {
      name: 'CS2 Spring Invitational',
      game: 'CS2',
      startDate: cs2T1Start,
      endDate: cs2T1End,
      prizePool: 50000,
      location: 'Los Angeles',
      status: getTournamentStatus(cs2T1Start, cs2T1End),
      logoUrl: 'https://placehold.co/128x128/8B5CF6/FFF?text=CS2',
      teams: { connect: [{ id: cs2TeamA.id }, { id: cs2TeamB.id }] },
    },
  });
  const cs2T2Start = new Date(Date.now() - 86400000 * 2);
  const cs2T2End = new Date(Date.now() + 86400000 * 1);
  const cs2T2 = await prisma.tournament.create({
    data: {
      name: 'CS2 World Cup',
      game: 'CS2',
      startDate: cs2T2Start,
      endDate: cs2T2End,
      prizePool: 100000,
      location: 'Berlin',
      status: getTournamentStatus(cs2T2Start, cs2T2End),
      logoUrl: 'https://placehold.co/128x128/00D4FF/FFF?text=CS2',
      teams: { connect: [{ id: cs2TeamC.id }, { id: cs2TeamD.id }] },
    },
  });
  // CS2 Matches
  const cs2M1 = await prisma.match.create({
    data: {
      tournamentId: cs2T1.id,
      team1Id: cs2TeamA.id,
      team2Id: cs2TeamB.id,
      scheduledTime: new Date(Date.now() + 86400000 * 2 + 3600000),
      status: 'scheduled',
      matchType: 'bo3',
      round: 'Quarter-Final',
    },
  });
  const cs2M2 = await prisma.match.create({
    data: {
      tournamentId: cs2T2.id,
      team1Id: cs2TeamC.id,
      team2Id: cs2TeamD.id,
      scheduledTime: new Date(Date.now() - 3600000),
      status: 'live',
      matchType: 'bo1',
      round: 'Semi-Final',
      team1Score: 8,
      team2Score: 12,
    },
  });

  // Valorant Tournaments
  const valT1Start = new Date(Date.now() + 86400000 * 3);
  const valT1End = new Date(Date.now() + 86400000 * 6);
  const valT1 = await prisma.tournament.create({
    data: {
      name: 'Valorant Masters',
      game: 'VALORANT',
      startDate: valT1Start,
      endDate: valT1End,
      prizePool: 75000,
      location: 'Tokyo',
      status: getTournamentStatus(valT1Start, valT1End),
      logoUrl: 'https://placehold.co/128x128/00D4FF/FFF?text=VAL',
      teams: { connect: [{ id: valTeamA.id }, { id: valTeamB.id }] },
    },
  });
  const valT2Start = new Date(Date.now() - 86400000 * 1);
  const valT2End = new Date(Date.now() + 86400000 * 2);
  const valT2 = await prisma.tournament.create({
    data: {
      name: 'Valorant Champions',
      game: 'VALORANT',
      startDate: valT2Start,
      endDate: valT2End,
      prizePool: 120000,
      location: 'London',
      status: getTournamentStatus(valT2Start, valT2End),
      logoUrl: 'https://placehold.co/128x128/39FF14/FFF?text=VAL',
      teams: { connect: [{ id: valTeamC.id }, { id: valTeamD.id }] },
    },
  });
  // Valorant Matches
  const valM1 = await prisma.match.create({
    data: {
      tournamentId: valT1.id,
      team1Id: valTeamA.id,
      team2Id: valTeamB.id,
      scheduledTime: new Date(Date.now() + 86400000 * 3 + 3600000),
      status: 'scheduled',
      matchType: 'bo3',
      round: 'Quarter-Final',
    },
  });
  const valM2 = await prisma.match.create({
    data: {
      tournamentId: valT2.id,
      team1Id: valTeamC.id,
      team2Id: valTeamD.id,
      scheduledTime: new Date(Date.now() - 3600000),
      status: 'live',
      matchType: 'bo1',
      round: 'Semi-Final',
      team1Score: 10,
      team2Score: 13,
    },
  });

  // LoL Tournaments
  const lolT1Start = new Date(Date.now() + 86400000 * 4);
  const lolT1End = new Date(Date.now() + 86400000 * 7);
  const lolT1 = await prisma.tournament.create({
    data: {
      name: 'LoL World Finals',
      game: 'LOL',
      startDate: lolT1Start,
      endDate: lolT1End,
      prizePool: 200000,
      location: 'Seoul',
      status: getTournamentStatus(lolT1Start, lolT1End),
      logoUrl: 'https://placehold.co/128x128/39FF14/FFF?text=LOL',
      teams: { connect: [{ id: lolTeamA.id }, { id: lolTeamB.id }] },
    },
  });
  const lolT2Start = new Date(Date.now() - 86400000 * 5);
  const lolT2End = new Date(Date.now() - 86400000 * 2);
  const lolT2 = await prisma.tournament.create({
    data: {
      name: 'LoL Invitational',
      game: 'LOL',
      startDate: lolT2Start,
      endDate: lolT2End,
      prizePool: 150000,
      location: 'Hanoi',
      status: getTournamentStatus(lolT2Start, lolT2End),
      logoUrl: 'https://placehold.co/128x128/8B5CF6/FFF?text=LOL',
      teams: { connect: [{ id: lolTeamC.id }, { id: lolTeamD.id }] },
    },
  });
  // LoL Matches
  const lolM1 = await prisma.match.create({
    data: {
      tournamentId: lolT1.id,
      team1Id: lolTeamA.id,
      team2Id: lolTeamB.id,
      scheduledTime: new Date(Date.now() + 86400000 * 4 + 3600000),
      status: 'scheduled',
      matchType: 'bo5',
      round: 'Final',
    },
  });
  const lolM2 = await prisma.match.create({
    data: {
      tournamentId: lolT2.id,
      team1Id: lolTeamC.id,
      team2Id: lolTeamD.id,
      scheduledTime: new Date(Date.now() - 86400000 * 4),
      status: 'completed',
      matchType: 'bo3',
      round: 'Semi-Final',
      team1Score: 2,
      team2Score: 1,
    },
  });

  // --- STREAM LINKS ---
  await prisma.streamLink.createMany({
    data: [
      // CS2
      { platform: 'twitch', url: 'https://twitch.tv/cs2_alpha', language: 'en', isOfficial: true, matchId: cs2M1.id, tournamentId: cs2T1.id },
      { platform: 'youtube', url: 'https://youtube.com/cs2_bravo', language: 'en', isOfficial: true, matchId: cs2M2.id, tournamentId: cs2T2.id },
      // Valorant
      { platform: 'twitch', url: 'https://twitch.tv/valiant', language: 'en', isOfficial: true, matchId: valM1.id, tournamentId: valT1.id },
      { platform: 'youtube', url: 'https://youtube.com/valorant_champions', language: 'en', isOfficial: true, matchId: valM2.id, tournamentId: valT2.id },
      // LoL
      { platform: 'twitch', url: 'https://twitch.tv/lol_legends', language: 'ko', isOfficial: true, matchId: lolM1.id, tournamentId: lolT1.id },
      { platform: 'youtube', url: 'https://youtube.com/lol_dragons', language: 'vi', isOfficial: true, matchId: lolM2.id, tournamentId: lolT2.id },
    ],
  });

  console.log('Expanded seed data for all games created!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 