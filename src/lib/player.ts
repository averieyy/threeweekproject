import type { Level } from "./level";
import type { Point } from "./point";

export class Player {
  name : string;
  onGround: boolean = true;
  velocity: {
    x: number,
    y: number
  } = { x: 0, y: 0 };
  position: Point;
  level: Level;
  
  constructor (name: string, level: Level) {
    this.name = name;
    this.level = level;

    this.position = level.startPos;
  }
}