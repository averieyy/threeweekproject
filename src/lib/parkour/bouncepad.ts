import { HitBox } from "./hitbox";
import type { Player } from "./player";
import type { Renderable } from "./renderable";
import type { Vector2 } from "./vector2";

import BouncePadSrc from '$lib/assets/parkour/bouncepads.png';
import { loadImages } from "./assets";
import type { Camera } from "./camera";

const bouncepads = loadImages(BouncePadSrc, 8, 8);

export class BouncePad implements Renderable {
  hitbox: HitBox;
  pos: Vector2;

  constructor (position: Vector2) {
    this.pos = position;
    this.hitbox = new HitBox(position, 8, 2);
  }

  collide(player: Player) {
    player.velocity.y = -5;
    player.hitbouncepad = true;
    player.ground = undefined;
  }

  render (ctx: OffscreenCanvasRenderingContext2D, camera: Camera) {
    if (!bouncepads[0]) return;
    ctx.drawImage(
      bouncepads[0],
      Math.floor(this.pos.x - camera.center.x + camera.width / 2),
      Math.floor(this.pos.y - camera.center.y + camera.height / 2)
    );
  }
}