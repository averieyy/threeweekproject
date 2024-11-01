import { getDatabase } from "$lib/db/db";
import type { LayoutServerLoad } from "./$types";

export const ssr = true;

export const load: LayoutServerLoad = async ({ cookies }) => {
  const token = cookies.get('token');

  const database = await getDatabase();
  const { tokens, users } = database.data;

  const tokenobj = tokens.filter(t => t.authenticated).find(t => t.content == token);

  if (!tokenobj) return { user: null }

  const user = users.find(u => u.id == tokenobj.userid);

  if (!user) return { user: null }

  return { user: { name: user.username, id: user.id } }
};