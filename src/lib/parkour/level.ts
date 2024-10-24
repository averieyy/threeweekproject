import { Platform } from "./platform";
import type { Vector2 } from "./vector2";

export class Level {
  static levels: Level[] = [new Level('testlevel', [new Platform({ x: -20, y: 20 }, 100, 10, .5),new Platform({ x: -100, y: 10 }, 80, 10, .5),new Platform({ x: 20, y: 10 }, 100, 10), new Platform({ x: -20, y: -20 }, 100, 10, .5), new Platform({ x: -100, y: -25 }, 100, 10, 0)], { x: 0, y: 0 })];
  
  name: string;
  platforms: Platform[];

  startPos: Vector2;

  gravity: number = .175;

  constructor (name: string, platforms: Platform[], startPos: Vector2) {
    this.name = name;
    this.platforms = platforms;
    this.startPos = startPos;
  }
}