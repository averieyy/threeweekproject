import type { Low } from 'lowdb';
import { JSONFilePreset } from 'lowdb/node';
import type { User } from './user';
import type { LeaderboardEntry } from './leaderboardentry';

interface dataBaseStructure {
  users: User[],
  leaderboard: LeaderboardEntry[],
}

const defaultDatabase: dataBaseStructure = { users: [], leaderboard: [] };

export async function setupDatabase() : Promise<Low<dataBaseStructure>> {
  return await JSONFilePreset<dataBaseStructure>('db.json', defaultDatabase);
}