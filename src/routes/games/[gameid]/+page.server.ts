import { getDatabase } from '$lib/db/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const ssr = true;

export const load: PageServerLoad = async ({ cookies, params }) => {
  const database = await getDatabase();
  
  const gameid = parseInt(params.gameid);

  const { games, leaderboard, users, tokens } = database.data;
  
  const game = games.find(g => g.id == gameid);

  if (!game) error(404);

  const gameleaderboard = leaderboard
    .filter(e => e.gameid == gameid)
    .map(e => {return { points: e.points, user: users.find(u => u.id == e.userid) }})
    .sort((l1, l2) => l2.points - l1.points);
  
  // Get if the user is logged in
  let loggedin = false;
  const token = cookies.get('token');

  if (token) {
    const tokenobj = tokens.find(t => t.content == token);

    if (tokenobj) {
      const user = users.find(u => u.id == tokenobj.userid);
      if (user) loggedin = true;
    }
  }

  return {
    name: game.name,
    leaderboard: gameleaderboard,
    url: game.url,
    loggedin
  };
};