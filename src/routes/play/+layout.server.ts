import { redirect } from '@sveltejs/kit';
import type { LayoutServerLoad } from './$types';
import { getDatabase } from '$lib/db/db';

export const load: LayoutServerLoad = async ({ cookies, url }) => {
  
  const redir = () => { redirect(302, `/login?redirect=${url.pathname}`) };
  
  const token = cookies.get('token');

  if (!token) redir();
  
  const database = await getDatabase();
  const { tokens, users } = database.data;
  
  const tokenobj = tokens.find(t => t.content == token);
  if (!tokenobj) redir();
  
  const user = users.find(u => u.id == tokenobj?.userid);
  if (!user) redir();
};