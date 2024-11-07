import { getDatabase } from "$lib/db/db";
import { getUserFromToken } from "$lib/db/token";
import { log } from "$lib/logs";
import { json, type RequestHandler } from "@sveltejs/kit";

export const POST: RequestHandler = async ({ cookies }) => {
  const database = await getDatabase();

  const token = cookies.get('token');
  if (!token) return json({message: 'Not authenticated'}, { status: 403 });

  const user = await getUserFromToken(token, false);
  if (!user) return json({message: 'Not authenticated'}, { status: 403 });

  await database.update(({ tokens }) => {
    const placement = tokens.findIndex(t => t.content == token);
    if (placement !== -1) tokens.splice(placement, 1);
  });
  
  cookies.delete('token', { path: '/' });

  log(`User ${user.username} logged out`, 'INFO');

  return json({ message: 'User logged out' }, { status: 200 });
}