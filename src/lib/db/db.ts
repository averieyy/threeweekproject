import type { Low } from 'lowdb';
import { JSONFilePreset } from 'lowdb/node';
import type { User } from './user';
import type { LeaderboardEntry } from './leaderboardentry';
import type { Game } from './game';
import type { token } from './token';

interface dataBaseStructure {
  users: User[],
  leaderboard: LeaderboardEntry[],
  games: Game[],
  tokens: token[],
}

const defaultDatabase: dataBaseStructure = { users: [], leaderboard: [], games: [
  {id: 0, name: 'Parkour', plays: 0, url: '/parkour'},
  {id: 1, name: 'Snake', plays: 0, url: '/snake'},
  {id: 2, name: 'Neoclicker', plays: 0, url: '/biscuitclicker'},
], tokens: [] };

export async function getDatabase() : Promise<Low<dataBaseStructure>> {
  return await JSONFilePreset<dataBaseStructure>('db.json', defaultDatabase);
}