import { Platform } from "./platform";
import type { Vector2 } from "./vector2";

export class Level {
  static levels: Level[] = [new Level('testlevel', [new Platform({ x: -5, y: 20 }, 30, 10, 1)], { x: 0, y: 0 })];
  
  name: string;
  platforms: Platform[];

  startPos: Vector2;

  constructor (name: string, platforms: Platform[], startPos: Vector2) {
    this.name = name;
    this.platforms = platforms;
    this.startPos = startPos;
  }
}