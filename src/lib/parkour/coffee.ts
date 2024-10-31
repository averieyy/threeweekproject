import type { Camera } from "./camera";
import type { Renderable } from "./renderable";

import Cup from '$lib/assets/parkour/cup.png';
import { loadImages } from "./assets";
import type { Vector2 } from "./vector2";
import { HitBox } from "./hitbox";
import type { Player } from "./player";
import { Level } from "./level";

const cupImages = loadImages(Cup, 16, 16);

export class Coffee implements Renderable {
  animationframe: number = 0;
  
  pos: Vector2;
  hitbox: HitBox;

  redirectTo: number;
  
  constructor (pos: Vector2, redirect: number) {
    this.pos = pos;
    this.hitbox = new HitBox(pos, 16, 16);
    
    this.redirectTo = redirect;
  }

  collide (player: Player) {
    const level = Level.levels.find(l => l.id == this.redirectTo);
    if (level) {
      player.level = level;
      player.position = level.startPos;
      player.velocity = { x: 0, y: 0 }
      player.direction = 0;
      player.sliding = false;
    }
  }

  render (ctx: OffscreenCanvasRenderingContext2D, camera: Camera) {
    this.animationframe += 1 / 30;
    this.animationframe %= 4;

    const image = cupImages[Math.floor(this.animationframe)];
    ctx.drawImage(
      image,
      Math.floor(this.pos.x - camera.center.x + camera.width / 2),
      Math.floor(this.pos.y - camera.center.y + camera.height / 2)
    )
  }
}