import { Platform } from "./platform";
import type { Vector2 } from "./vector2";

import level0 from '$lib/levels/0.json';

export class Level {
  static levels: Level[] = [];
  
  name: string;
  platforms: Platform[];

  startPos: Vector2;

  gravity: number = .175;

  constructor (name: string, platforms: Platform[], startPos: Vector2) {
    this.name = name;
    this.platforms = platforms;
    this.startPos = startPos;
  }

  static fromJSON (json: {name: string, platforms: {height: number, width: number, pos: number[]}[], startpos: number[]}) : Level {
    return new Level(json.name, json.platforms.map(p => new Platform({x: p.pos[0], y: p.pos[1]}, p.width, p.height)), {x: json.startpos[0], y: json.startpos[1]});
  }
}

Level.levels = [
  Level.fromJSON(level0)
]