import { Platform } from "./platform";
import type { Vector2 } from "./vector2";

import level0 from '$lib/levels/0.json';
import { InfoPlaque } from "./infoplaque";
import { BouncePad } from "./bouncepad";

interface jsonLevel {
  name: string,
  platforms: {height: number, width: number, pos: number[]}[],
  startpos: number[],
  plaques: {id: string, x: number, y: number}[],
  bouncepads?: {x: number, y: number}[]
}

export class Level {
  static levels: Level[] = [];
  
  name: string;
  platforms: Platform[];
  plaques: InfoPlaque[];
  bouncepads: BouncePad[];

  startPos: Vector2;

  gravity: number = .175;

  constructor (name: string, platforms: Platform[], startPos: Vector2, plaques: InfoPlaque[] = [], bouncepads: BouncePad[]) {
    this.name = name;
    this.platforms = platforms;
    this.startPos = startPos;
    this.plaques = plaques;
    this.bouncepads = bouncepads;
  }

  static fromJSON (json: jsonLevel) : Level {
    return new Level(
      json.name, // Name
      json.platforms.map(p =>  // Platforms
        new Platform({x: p.pos[0], y: p.pos[1]}, p.width, p.height)
      ),
      { // Start position
        x: json.startpos[0],
        y: json.startpos[1]
      },
      json.plaques.map(p => // Plaques
        new InfoPlaque(InfoPlaque.plaquePaths[p.id],
          { x: p.x, y: p.y }
        )
      ),
      (json.bouncepads || []).map(b => new BouncePad({x: b.x, y: b.y}))
    );
  }
}

Level.levels = [
  Level.fromJSON(level0)
]