import { getDatabase } from "$lib/db/db";
import { getUserFromToken } from "$lib/db/token";
import { log } from "$lib/logs";
import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ cookies, request }) => {
  const { gameid } = await request.json();

  if (gameid == undefined) return json({message: 'Not found'}, {status: 404});
  
  const token = cookies.get('token');
  
  const db = await getDatabase();

  const user = await getUserFromToken(token);

  if (!user) {
    log(`User tried to play game ${gameid} without loggin in`, 'WARN');
    return json({message: 'Unauthorized'}, {status: 403});
  }

  db.update(({ games }) => {
    const game = games.find(g => g.id == gameid);
    if (game)
      game.plays ++;
  });
  
  return new Response();
}