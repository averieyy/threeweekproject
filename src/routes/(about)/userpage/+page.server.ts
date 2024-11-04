import { redirect } from "@sveltejs/kit";
import type { PageServerLoad } from "./$types";
import { getUserFromToken } from "$lib/db/token";

export const load: PageServerLoad = async ({ cookies }) => {
  const token = cookies.get('token');
  if (!token) redirect(302, '/login?redirect=/userpage');

  const user = await getUserFromToken(token);
  if (!user) redirect(302, '/login?redirect=/userpage');

  return {
    user: {
      username: user.username,
      email: user.email
    }
  }
};