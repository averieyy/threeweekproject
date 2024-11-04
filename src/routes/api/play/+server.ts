import { getDatabase } from "$lib/db/db";
import { getUserFromToken } from "$lib/db/token";
import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ cookies, request }) => {
  const { gameid } = await request.json();

  if (gameid == undefined) return json({message: 'Not found'}, {status: 404});
  
  const token = cookies.get('token');
  if (!token) return json({message: 'Unauthorized'}, {status: 403});
  
  const db = await getDatabase();

  const user = await getUserFromToken(token);

  if (!user) return json({message: 'Unauthorized'}, {status: 403});

  db.update(({ games }) => {
    const game = games.find(g => g.id == gameid);
    if (game)
      game.plays ++;
  });
  
  return new Response();
}