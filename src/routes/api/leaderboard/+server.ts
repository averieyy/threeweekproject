import { getDatabase } from "$lib/db/db";
import type { RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ cookies, request }) => {
  const respond = (response: object, status:number) => new Response(JSON.stringify(response), { status });
  
  const token = cookies.get('token');
  if (!token) return respond({ message: 'Unauthorized' }, 403);

  const database = await getDatabase();
  const { tokens, users } = database.data;

  const tokenobj = tokens.find(t => t.content == token);
  const user = users.find(u => u.id == tokenobj?.userid);

  if (!user) return respond({message: 'Unauthorized'}, 403);
  
  const { gameid, points } = await request.json();

  database.update(({ leaderboard }) => {
    const entry = leaderboard.find(l => l.gameid == gameid && l.userid == user.id);
    if (entry && entry.points < points) entry.points = points;
    if (!entry) leaderboard.push({ gameid, points, userid: user.id });
  });

  return respond({message: 'Changed entry'}, 200);
}