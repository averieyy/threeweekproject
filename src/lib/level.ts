import type { Platform } from "./platform";
import type { Point } from "./point";

export class Level {
  static levels: Level[];
  
  name: string;
  platforms: Platform[];

  startPos: Point;

  constructor (name: string, platforms: Platform[], startPos: Point) {
    Level.levels.push(this);

    this.name = name;
    this.platforms = platforms;
    this.startPos = startPos;
  }
}