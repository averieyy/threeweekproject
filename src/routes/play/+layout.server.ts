import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getUserFromToken } from '$lib/db/token';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
  
  const redir = () => { redirect(302, `/login?redirect=${url.pathname}`) };
  
  const token = cookies.get('token');

  if (!token) return redir();
  
  const user = await getUserFromToken(token);
  
  if (!user) return redir();
};