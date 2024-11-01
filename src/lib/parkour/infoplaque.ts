import type { Camera } from "./camera";
import type { Vector2 } from "./vector2";
import type { Renderable } from "./renderable";

import Movement from '$lib/assets/parkour/info/movement.png';
import Zoomies from '$lib/assets/parkour/info/zoomies.png';
import Hop from '$lib/assets/parkour/info/hop.png';

export class InfoPlaque implements Renderable {
  static plaquePaths: {[key: string] : string} = {
    movement: Movement,
    zoomies: Zoomies,
    hop: Hop,
  };

  image: HTMLImageElement;
  pos: Vector2;
  id: string;

  constructor (id: string, position: Vector2) {
    this.image = new Image();
    this.image.src = InfoPlaque.plaquePaths[id];

    this.pos = position;

    this.id = id;
  }

  render (ctx: OffscreenCanvasRenderingContext2D, camera: Camera) {
    ctx.drawImage(this.image,
      Math.floor(this.pos.x - camera.center.x + camera.width / 2),
      Math.floor(this.pos.y - camera.center.y + camera.height / 2));
  }
}