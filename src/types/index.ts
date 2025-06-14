// Shared TypeScript types for eSports ESPN

export interface Tournament {
  id: string;
  name: string;
  game: 'CS2' | 'VALORANT' | 'LOL';
  startDate: Date;
  endDate: Date;
  prizePool?: number;
  location?: string;
  status: 'upcoming' | 'live' | 'completed';
  logoUrl?: string;
  streamUrls: StreamLink[];
  teams: Team[];
  matches: Match[];
}

export interface Match {
  id: string;
  tournamentId: string;
  team1: Team;
  team2: Team;
  scheduledTime: Date;
  status: 'scheduled' | 'live' | 'completed';
  score?: {
    team1Score: number;
    team2Score: number;
  };
  streamUrls: StreamLink[];
  matchType: 'bo1' | 'bo3' | 'bo5';
  round?: string;
}

export interface Team {
  id: string;
  name: string;
  logoUrl?: string;
  country: string;
  players: Player[];
  ranking?: number;
  recentForm?: MatchResult[];
}

export interface Player {
  id: string;
  nickname: string;
  realName?: string;
  country: string;
  teamId: string;
  photoUrl?: string;
  role?: string;
  stats?: PlayerStats;
}

export interface StreamLink {
  platform: 'twitch' | 'youtube' | 'other';
  url: string;
  language: string;
  viewerCount?: number;
  isOfficial: boolean;
}

// Additional types
export interface MatchResult {
  matchId: string;
  result: 'win' | 'loss' | 'draw';
}

export interface PlayerStats {
  [key: string]: any;
} 