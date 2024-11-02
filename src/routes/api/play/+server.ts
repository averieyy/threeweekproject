import { getDatabase } from "$lib/db/db";
import { getUserFromToken } from "$lib/db/token";
import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ cookies, request }) => {
  const respond = (content: object, status: number = 200) => new Response(JSON.stringify(content), { status, headers: {'Content-Type': 'application/json'} });

  const { gameid } = await request.json();

  if (gameid == undefined) return respond({message: 'Not found'}, 404);
  
  const token = cookies.get('token');
  if (!token) return respond({message: 'Unauthorized'}, 403);
  
  const db = await getDatabase();

  const user = await getUserFromToken(token);

  if (!user) return respond({message: 'Unauthorized'}, 403);

  db.update(({ games }) => {
    const game = games.find(g => g.id == gameid);
    if (game)
      game.plays ++;
  });
  
  return new Response();
}