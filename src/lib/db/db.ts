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
  {id: 0, name: 'Parkour', plays: 0, url: '/play/parkour', colour: '#bf616a', speedrunning: true, description: 'Get through all levels as fast as possible to get a perfect time. Includes a healthy dose of slipping, sliding and sunsets'},
  {id: 1, name: 'Snake', plays: 0, url: '/play/snake', colour: '#b48ead', speedrunning: false, description: 'A twist on the classic, survive an ever-expanding garden while trying to eat apples'},
  {id: 2, name: 'Neoclicker', plays: 0, url: '/play/neoclicker', colour: '#5e81ac', speedrunning: false, description: 'A basic clicker game. Buy autoclickers to generate the most points out of thin air!'},
], tokens: [] };

const db = await JSONFilePreset<dataBaseStructure>('db.json', defaultDatabase);

export async function getDatabase() : Promise<Low<dataBaseStructure>> {
  return db;
}