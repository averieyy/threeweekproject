import { loadImages } from "./assets";
import type { Camera } from "./camera";
import { HitBox } from "./hitbox";
import type { Renderable } from "./renderable";
import type { Vector2 } from "./vector2";
import type { Player } from "./player";

import Spike from '$lib/assets/parkour/spikes.png';
const image = new Image();
image.src = Spike;

const SPIKEWIDTH = 8;
const SPIKEHEIGHT = 4;

export class Spikes implements Renderable {
  position: Vector2;
  width: number;
  height: number = SPIKEHEIGHT;

  hitbox: HitBox;

  constructor (pos: Vector2, width: number) {
    this.position = pos;
    this.width = width;
    
    this.hitbox = new HitBox(pos, width, this.height);
  }

  collide(player: Player) {
    player.dead = true;
  }

  render(ctx: OffscreenCanvasRenderingContext2D, camera: Camera) {
    if (!image) return;
    for (let x = 0; x < this.width; x += SPIKEWIDTH) {
      ctx.drawImage(
        image,
        Math.floor(this.position.x + x - camera.center.x + camera.width / 2),
        Math.floor(this.position.y - camera.center.y + camera.height / 2)
      );
    } 
  }
}