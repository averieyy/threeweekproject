import { getDatabase } from "$lib/db/db";
import type { PageServerLoad } from "./$types";

export const ssr = true;

export const load: PageServerLoad = async () => {
  const database = await getDatabase();

  const { games } = database.data;

  return {
    games
  }
};