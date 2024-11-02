import { getDatabase } from "$lib/db/db";
import type { PageServerLoad } from "./$types";

const SVGSIZE = 200;

export const ssr = true;

function arc(start: number, end: number, colour: string) : string {
  const radius = SVGSIZE * .7 / 2;

  const startx = (Math.cos(start)) * radius + SVGSIZE / 2;
  const starty = (Math.sin(start)) * radius + SVGSIZE / 2;
  const endx = (Math.cos(end)) * radius + SVGSIZE / 2;
  const endy = (Math.sin(end)) * radius + SVGSIZE / 2;

  const large = end - start <= Math.PI;

  return `<path d="M ${SVGSIZE / 2} ${SVGSIZE / 2} L ${startx} ${starty} A ${radius} ${radius} 0 ${large ? '0' : '1'} 1 ${endx} ${endy} Z" fill="${colour}"></path>`;
}

export const load: PageServerLoad = async () => {
  const database = await getDatabase();

  const { games, leaderboard, users } = database.data;

  const fullcircle = Math.PI * 2;

  const totalplays = games.reduce((total, n) => total + n.plays, 0); // || 1 to avoid divide-by-zero.

  let arcs = '';
  let prevstart = 0;

  for (let game of games.sort((g1, g2) => g2.plays - g1.plays)) {
    const end = prevstart + ((game.plays || 0.01) / totalplays) * fullcircle;
    
    arcs += arc(prevstart, end, game.colour);
    prevstart = end;
  }

  let svgContent = `<svg width="${SVGSIZE}" height="${SVGSIZE}">${arcs}</svg>`;

  const leaderboards : {[key: number] : {gameid: number, points: number, user: string}[]} = {};

  for (const entry of leaderboard) {
    if (!leaderboards[entry.gameid]) leaderboards[entry.gameid] = [];

    const user = users.find(u => u.id == entry.userid);

    leaderboards[entry.gameid].push({
      gameid: entry.gameid,
      points: entry.points,
      user: user?.username || 'BlondePterodactyl_1997', // Random name
    });
  }

  for (const game of games) {
    leaderboards[game.id]?.sort((a, b) => (game.speedrunning ? a.points - b.points : b.points - a.points));
  }

  return {
    svgContent,
    games: games.map(g => { return { id: g.id, speedrunning: g.speedrunning, name: g.name, colour: g.colour } }),
    leaderboards: leaderboards
  }
};