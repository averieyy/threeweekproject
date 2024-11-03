export interface Game {
  name: string;
  id: number;
  url: string;
  plays: number;
  colour: string;
  speedrunning: boolean; // Whether the leaderboard should be time-based (lowest score to highest)
  description: string;
}