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

  const gameleaderboard = leaderboard
    .filter(e => e.gameid == gameid)
    .map(e => {return { points: e.points, user: users.find(u => u.id == e.userid)?.username }})
    .sort((l1, l2) => l2.points - l1.points);
  
  // Get if the user is logged in
  let loggedin = false;
  const token = cookies.get('token');
  if (!token) return;

  const user = await getUserFromToken(token);
  if (user) loggedin = true;

  return {
    name: game.name,
    leaderboard: gameleaderboard,
    url: game.url,
    loggedin
  };
};