import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getUserFromToken } from "$lib/db/token";

export const load: PageServerLoad = async ({ cookies }) => {
  const token = cookies.get('token');
  if (!token) redirect(302, '/signup');

  const user = await getUserFromToken(token, true);

  if (!user) redirect(302, '/signup');
  
  return {
    totpsecret: user.totpsecret,
  }
};