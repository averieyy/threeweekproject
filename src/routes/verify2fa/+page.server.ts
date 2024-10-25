import { getDatabase } from "$lib/db/db";
import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies }) => {
  const database = await getDatabase();

  const token = cookies.get('token');
  if (!token) redirect(302, '/signin');

  const { users, tokens } = database.data;
  
  const tokenobj = tokens.find(t => t.content == token);

  if (!tokenobj) redirect(302, '/signin');

  const user = users.find(u => u.id == tokenobj.userid);

  if (!user) redirect(302, '/signin');
  
  console.log('ran', user.totpsecret);

  return {
    totpsecret: user.totpsecret,
  }
};