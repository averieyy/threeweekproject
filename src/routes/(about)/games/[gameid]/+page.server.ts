import { getDatabase } from '$lib/db/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import { getUserFromToken } from '$lib/db/token';

export const ssr = true;

export const load: PageServerLoad = async ({ cookies, params }) => {
  const database = await getDatabase();
  
  const gameid = parseInt(params.gameid);

  const { games, leaderboard, users } = database.data;
  
  const game = games.find(g => g.id == gameid);

  if (!game) error(404);

  let gameleaderboard: {gameid: number, points: number, user: string}[] = [];

  for (const entry of leaderboard) {
    const user = users.find(u => u.id == entry.userid);

    if (entry.gameid == game.id) {
      gameleaderboard.push({
        gameid: entry.gameid,
        points: entry.points,
        user: user?.username || 'BlondePterodactyl_1997', // Random name
      });
    }
  }
  
  // Get if the user is logged in
  let loggedin = false;

  const token = cookies.get('token');

  const user = await getUserFromToken(token);
  if (user) loggedin = true;

  return {
    game: {
      id: game.id,
      name: game.name,
      speedrunning: game.speedrunning,
      description: game.description,
      url: game.url
    },
    leaderboard: gameleaderboard,
    loggedin
  };
};