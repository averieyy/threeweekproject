import { HitBox } from "./hitbox";
import type { Player } from "./player";
import type { Renderable } from "./renderable";
import type { Vector2 } from "./vector2";

import BouncePadSrc from '$lib/assets/parkour/bouncepads.png';
import { loadImages } from "./assets";
import type { Camera } from "./camera";

export const bouncepadimgs = loadImages(BouncePadSrc, 8, 8);

export class BouncePad implements Renderable {
  hitbox: HitBox;
  pos: Vector2;
  animationframe: number = 0;

  constructor (position: Vector2) {
    this.pos = position;
    this.hitbox = new HitBox({ x: position.x, y: position.y + 4 }, 8, 4);
  }

  collide(player: Player) {
    player.velocity.y = -4.75;
    player.hitbouncepad = true;
    player.ground = undefined;
  }

  render (ctx: OffscreenCanvasRenderingContext2D, camera: Camera) {
    this.animationframe += 1 / 30;

    const image = bouncepadimgs[Math.floor(this.animationframe) % 4];
    if (!image) return;
    ctx.drawImage(
      image,
      Math.floor(this.pos.x - camera.center.x + camera.width / 2),
      Math.floor(this.pos.y - camera.center.y + camera.height / 2)
    );
  }
}