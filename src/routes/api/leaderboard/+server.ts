import { getDatabase } from "$lib/db/db";
import { getUserFromToken } from "$lib/db/token";
import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ cookies, request }) => {
  const token = cookies.get('token');
  if (!token) return json({ message: 'Unauthorized' }, { status: 403 });

  const database = await getDatabase();
  
  const user = await getUserFromToken(token);

  if (!user) return json({message: 'Unauthorized'}, { status: 403 });
  
  const { games } = database.data;

  const { gameid, points } = await request.json();

  const game = games.find(g => g.id == gameid);

  if (!game) return json({message: 'Game not found'}, { status: 404 });

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

  return json({message: 'Changed entry'}, { status: 200 });
}