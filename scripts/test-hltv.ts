import { HLTV } from 'hltv';

HLTV.getTeamRanking()
  .then((ranking) => {
    console.log('Team ranking fetched successfully. Example:', ranking.slice(0, 3));
  })
  .catch((err) => {
    console.error('Error fetching team ranking:', err);
  }); 