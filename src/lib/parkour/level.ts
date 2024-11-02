import { Platform } from "./platform";
import type { Vector2 } from "./vector2";

import { InfoPlaque } from "./infoplaque";
import { BouncePad } from "./bouncepad";
import { Coffee } from "./coffee";
import { Spikes } from "./spikes";

import tutorial from '$lib/parkour/levels/tutorial.json';
import airbounce from '$lib/parkour/levels/airbounce.json';
import hops from '$lib/parkour/levels/hops.json';
import longslide from '$lib/parkour/levels/longslide.json';

interface jsonLevel {
  name: string,
  platforms: {height: number, width: number, pos: number[]}[],
  startpos: number[],
  plaques: {id: string, x: number, y: number}[],
  bouncepads?: {x: number, y: number}[],
  gravity: number,
  coffee: { pos: Vector2, redirect: number },
  spikes: {x: number, y: number, width: number}[],
}

export class Level {
  static levels: Level[] = [];
  
  name: string;
  id: number;
  platforms: Platform[];
  plaques: InfoPlaque[];
  bouncepads: BouncePad[];
  spikes: Spikes[];

  deathY: number;

  startPos: Vector2;

  gravity: number;

  coffee: Coffee;

  constructor (id: number, name: string, platforms: Platform[], startPos: Vector2, plaques: InfoPlaque[] = [], bouncepads: BouncePad[], coffee: Coffee, gravity: number, spikes: Spikes[]) {
    this.name = name;
    this.id = id;
    this.platforms = platforms;
    this.startPos = startPos;
    this.plaques = plaques;
    this.bouncepads = bouncepads;
    this.coffee = coffee;
    this.gravity = gravity;
    this.spikes = spikes;

    if (this.platforms.length > 0)
      this.deathY = this.platforms.sort((p1, p2) => p2.corners.ll.y - p1.corners.ll.y)[0].corners.ll.y;
    else this.deathY = 1;
  }

  static fromJSON (id: number, json: jsonLevel) : Level {
    return new Level(
      id,
      json.name, // Name
      json.platforms.map(p =>  // Platforms
        new Platform({x: p.pos[0], y: p.pos[1]}, p.width, p.height)
      ),
      { // Start position
        x: json.startpos[0],
        y: json.startpos[1]
      },
      json.plaques.map(p => // Plaques
        new InfoPlaque(
          p.id,
          { x: p.x, y: p.y }
        )
      ),
      (json.bouncepads || []).map(b => new BouncePad({x: b.x, y: b.y})),
      new Coffee(json.coffee.pos, json.coffee.redirect),
      json.gravity,
      json.spikes.map(s => new Spikes({ x: s.x, y: s.y }, s.width))
    );
  }

  toJSON(): jsonLevel {
    return {
      gravity: this.gravity,
      name: this.name,
      startpos: [this.startPos.x, this.startPos.y],
      coffee: {
        pos: {
          x: this.coffee.pos.x,
          y: this.coffee.pos.y
        },
        redirect: this.coffee.redirectTo
      },
      plaques: this.plaques.map(p => { return {
        id: p.id,
        x: p.pos.x,
        y: p.pos.y,
      }}),
      platforms: this.platforms.map(p => { return {
        pos: [p.position.x, p.position.y],
        width: p.width,
        height: p.height,
      }}),
      spikes: this.spikes.map(s => { return {
        width: s.width,
        x: s.position.x,
        y: s.position.y,
      }}),
      bouncepads: this.bouncepads.map(b => {return {
        x: b.pos.x,
        y: b.pos.y,
      }})
    };
  }

  static loadLevels () {
    Level.levels = [
      Level.fromJSON(3, longslide),
      Level.fromJSON(2, hops),
      Level.fromJSON(1, airbounce),
      Level.fromJSON(0, tutorial),
    ];
  }
}