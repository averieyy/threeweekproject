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
  {id: 0, name: 'Parkour', plays: 0, url: '/play/parkour', colour: '#bf616a'},
  {id: 1, name: 'Snake', plays: 0, url: '/play/snake', colour: '#b48ead'},
  {id: 2, name: 'Neoclicker', plays: 0, url: '/play/neoclicker', colour: '#5e81ac'},
], tokens: [] };

const db = await JSONFilePreset<dataBaseStructure>('db.json', defaultDatabase);

export async function getDatabase() : Promise<Low<dataBaseStructure>> {
  return db;
}