import { HitBox } from "./hitbox";
import type { Vector2 } from "./vector2";
import Bricks from '$lib/assets/parkour/bricks.png';
import type { Camera } from "./camera";

export const platformimg = new Image();
platformimg.src = Bricks;

export class Platform extends HitBox {
  friction: number;

  constructor (pos: Vector2, width: number, height: number, friction: number = .5) {
    super(pos, width, height);

    this.friction = friction;
  }

  override render(ctx: OffscreenCanvasRenderingContext2D, camera: Camera) {
    for (let x = 0; x < this.width; x += platformimg.width) {

      for (let y = 0; y < this.height; y += platformimg.height) {


        ctx.drawImage(platformimg,
          Math.floor(this.position.x + x - camera.center.x + camera.width / 2),
          Math.floor(this.position.y + y - camera.center.y + camera.height / 2));
      }
    }
  }
}