import { getDatabase } from "$lib/db/db";
import { getUserFromToken } from "$lib/db/token";
import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ cookies, request }) => {
  const respond = (response: object, status:number) => new Response(JSON.stringify(response), { status });
  
  const token = cookies.get('token');
  if (!token) return respond({ message: 'Unauthorized' }, 403);

  const database = await getDatabase();
  
  const user = await getUserFromToken(token);

  if (!user) return respond({message: 'Unauthorized'}, 403);
  
  const { games } = database.data;

  const { gameid, points } = await request.json();

  const game = games.find(g => g.id == gameid);

  if (!game) return respond({message: 'Game not found'}, 404);

  database.update(({ leaderboard }) => {
    const entry = leaderboard.find(l => l.gameid == gameid && l.userid == user.id);
    if (entry) {
      if (
        game.speedrunning && entry.points > points || // Speedrunning game, less time spent
        !game.speedrunning && entry.points < points   // Non-speedrunning game, more points gained
      )
        entry.points = points;
    }
    else leaderboard.push({ gameid, points, userid: user.id });
  });

  return respond({message: 'Changed entry'}, 200);
}