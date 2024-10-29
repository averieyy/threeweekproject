import { Platform } from "./platform";
import type { Vector2 } from "./vector2";

import level0 from '$lib/levels/0.json';
import { InfoPlaque } from "./infoplaque";

export class Level {
  static levels: Level[] = [];
  
  name: string;
  platforms: Platform[];
  plaques: InfoPlaque[];

  startPos: Vector2;

  gravity: number = .175;

  constructor (name: string, platforms: Platform[], startPos: Vector2, plaques: InfoPlaque[] = []) {
    this.name = name;
    this.platforms = platforms;
    this.startPos = startPos;
    this.plaques = plaques;
  }

  static fromJSON (json: {name: string, platforms: {height: number, width: number, pos: number[]}[], startpos: number[], plaques: {id: string, x: number, y: number}[]}) : Level {
    return new Level(json.name, json.platforms.map(p => new Platform({x: p.pos[0], y: p.pos[1]}, p.width, p.height)), {x: json.startpos[0], y: json.startpos[1]}, json.plaques.map(p => new InfoPlaque(InfoPlaque.plaquePaths[p.id], { x: p.x, y: p.y })));
  }
}

Level.levels = [
  Level.fromJSON(level0)
]