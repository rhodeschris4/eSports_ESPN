import { PrismaClient } from '@prisma/client';
import { HLTV } from 'hltv';
import type { TeamRanking } from 'hltv';

const prisma = new PrismaClient();

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  let imported = 0;
  let failed = 0;
  // Cleanup: delete all data in correct order
  try {
    console.log('Deleting all existing data (StreamLink, Match, Tournament, Player, Team)...');
    await prisma.streamLink.deleteMany();
    await prisma.match.deleteMany();
    await prisma.tournament.deleteMany();
    await prisma.player.deleteMany();
    await prisma.team.deleteMany();
    console.log('Cleanup complete.');
  } catch (err) {
    console.error('Error during cleanup:', err);
    process.exit(1);
  }

  let ranking: TeamRanking[] = [];
  try {
    ranking = await HLTV.getTeamRanking();
    console.log(`Fetched ${ranking.length} ranked teams.`);
  } catch (err) {
    console.error('Failed to fetch team ranking. Error details:', err);
    process.exit(1);
  }

  for (const [i, teamRank] of ranking.slice(0, 20).entries()) {
    try {
      console.log(`Fetching details for team [${i + 1}/20]: ${teamRank.team.name} (ID: ${teamRank.team.id ?? 0})`);
      const details = await HLTV.getTeam({ id: teamRank.team.id ?? 0 });
      // Try to get country as a string from details.country or details.country.name
      let country = 'Unknown';
      if (typeof details.country === 'string') country = details.country;
      else if (details.country && typeof details.country === 'object' && 'name' in details.country) country = details.country.name;
      else {
        console.warn('No country for team:', details.name, Object.keys(details));
      }
      const teamData = {
        name: details.name,
        logoUrl: details.logo,
        ranking: teamRank.place ?? 0,
        country,
        players: {
          create: (details.players || []).map((p: any, idx: number) => {
            if (i === 0) {
              // Log the player object for the first team for inspection
              console.log('Player object:', p);
            }
            let playerCountry = p.nationality || p.country || (p.country && p.country.name) || 'Unknown';
            if (typeof playerCountry === 'object' && playerCountry.name) playerCountry = playerCountry.name;
            return {
              nickname: p.name,
              realName: p.realName || '',
              country: playerCountry,
              photoUrl: p.image || '',
              // TODO: Fetch and store player stats here in the next step
            };
          }),
        },
      };
      const createdTeam = await prisma.team.create({ data: teamData, include: { players: true } });
      // Fetch and update player country and stats for each player
      for (const p of details.players || []) {
        try {
          // Find the created player by nickname and teamId
          const createdPlayer = createdTeam.players.find((pl: any) => pl.nickname === p.name);
          if (!createdPlayer) {
            console.warn(`[WARN] Could not find created player for nickname: ${p.name}`);
            continue;
          }
          const playerDetails = await HLTV.getPlayer({ id: p.id ?? 0 });
          let playerCountry = 'Unknown';
          if (typeof playerDetails.country === 'string') playerCountry = playerDetails.country;
          else if (playerDetails.country && typeof playerDetails.country === 'object' && 'name' in playerDetails.country) playerCountry = playerDetails.country.name;
          // Update player with all HLTV fields
          await prisma.player.update({
            where: { id: createdPlayer.id },
            data: {
              country: playerCountry,
              stats: playerDetails.statistics || {},
              hltvId: playerDetails.id,
              age: playerDetails.age,
              countryCode: playerDetails.country?.code,
              twitter: playerDetails.twitter,
              twitch: playerDetails.twitch,
              facebook: playerDetails.facebook,
              instagram: playerDetails.instagram,
              hltvTeamId: playerDetails.team?.id,
              hltvTeamName: playerDetails.team?.name,
              hltvTeams: playerDetails.teams as any,
              hltvAchievements: playerDetails.achievements as any,
              hltvNews: playerDetails.news as any,
            },
          });
          console.log(`[STATS] Updated player: ${p.name}`);
        } catch (err) {
          console.error(`[FAIL] Error updating player ${p.name}:`, err);
        }
        await sleep(1000); // 1s delay to avoid HLTV rate limits
      }
      imported++;
      console.log(`[SUCCESS] Imported team: ${teamData.name}`);
    } catch (err) {
      failed++;
      console.error(`[FAIL] Error importing team ${teamRank.team.name}:`, err);
    }
    await sleep(1000); // 1s delay to avoid HLTV rate limits
  }
  await prisma.$disconnect();
  console.log('Import complete.');
  console.log(`Teams imported: ${imported}`);
  console.log(`Teams failed: ${failed}`);
}

main().catch((e) => {
  console.error('Fatal error:', e);
  process.exit(1);
}); 