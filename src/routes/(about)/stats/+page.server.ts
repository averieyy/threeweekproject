import { getDatabase } from "$lib/db/db";
import type { PageServerLoad } from "./$types";

const SVGSIZE = 200;

export const ssr = true;

function arc(start: number, end: number, colour: string) : string {
  const radius = SVGSIZE * .7;

  const startx = (Math.cos(start)) / 2 * radius + SVGSIZE / 2;
  const starty = (Math.sin(start)) / 2 * radius + SVGSIZE / 2;
  const endx = (Math.cos(end)) / 2 * radius + SVGSIZE / 2;
  const endy = (Math.sin(end)) / 2 * radius + SVGSIZE / 2;

  const large = end - start <= Math.PI;

  return `<path d="M ${SVGSIZE / 2} ${SVGSIZE / 2} L ${startx} ${starty} A ${radius / 2} ${radius / 2} 0 ${large ? '0' : '1'} 1 ${endx} ${endy} Z" fill="${colour}"></path>`
}

export const load: PageServerLoad = async () => {
  const database = await getDatabase();

  const { games, leaderboard, users } = database.data;

  const fullcircle = Math.PI * 2;

  const totalplays = games.reduce((total, n) => total + n.plays, 0) || 1; // || 1 to avoid divide-by-zero.

  let arcs = '';
  let prevstart = 0;
  for (let game of games.sort((g1, g2) => g2.plays - g1.plays)) {
    const start = prevstart + (game.plays / totalplays) * fullcircle
    arcs += arc(prevstart, start, game.colour);
    prevstart = start;
  }

  let svgContent = `<svg width="${SVGSIZE}" height="${SVGSIZE}">${arcs}</svg>`;

  return {
    svgContent,
    games,
    leaderboard: leaderboard.map(l => { return {
      gameid: l.gameid,
      points: l.points,
      user: users.find(u => u.id == l.userid)?.username 
    }})
  }
};