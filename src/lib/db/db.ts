import type { Low } from 'lowdb';
import { JSONFilePreset } from 'lowdb/node';
import type { User } from './user';
import type { LeaderboardEntry } from './leaderboardentry';
import type { Game } from './game';

interface dataBaseStructure {
  users: User[],
  leaderboard: LeaderboardEntry[],
  games: Game[]
}

const defaultDatabase: dataBaseStructure = { users: [], leaderboard: [], games: [{id: 0, name: 'Parkour'}, {id: 1, name: 'Snake'}] };

export async function getDatabase() : Promise<Low<dataBaseStructure>> {
  return await JSONFilePreset<dataBaseStructure>('db.json', defaultDatabase);
}