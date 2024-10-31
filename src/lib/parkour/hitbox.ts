import type { Camera } from "./camera";
import type { Renderable } from "./renderable";
import type { Vector2 } from "./vector2";

export class HitBox implements Renderable {
  position: Vector2;
  width: number;
  height: number;

  centerpos: Vector2;

  corners: { ul: Vector2, ur: Vector2, ll: Vector2, lr: Vector2 };

  constructor (position: Vector2, w: number, h: number) {
    this.position = position;

    this.width = w;
    this.height = h;

    // Upper left, Upper right, Lower left, Lower right
    this.corners = {
      ul: position,
      ur: { x: position.x + w, y: position.y },
      ll: { x: position.x, y: position.y + h },
      lr: { x: position.x + w, y: position.y + h },
    }

    this.centerpos = { x: this.position.x + this.width / 2, y: this.position.y + this.height / 2 }
  }

  overlaps(h: HitBox) : boolean {
    // Load to variable to minimise code wastage
    const { ur, ul, lr, ll } = h.corners;

    // The hitbox's four corners.
    for (let c of [ this.corners.ul, this.corners.ur, this.corners.ll, this.corners.lr ]) {
      // Only return true if one of the corners is in the other hitbox
      if (c.x <= ll.x) continue;
      if (c.x >= ur.x) continue;
      if (c.y < ur.y) continue;
      if (c.y > ll.y) continue;

      return true;
    }

    // Dont need to write "this.corners" everywhere
    const c = this.corners;

    for (let h of [ ul, ur, lr, ll ]) {
      if (h.x <= c.ll.x) continue;
      if (h.x >= c.ur.x) continue;
      if (h.y < c.ur.y) continue;
      if (h.y > c.ll.y) continue;

      return true;
    }

    return false;
  }

  render (ctx: OffscreenCanvasRenderingContext2D, camera: Camera): void {
    ctx.fillStyle = 'red';
    
    ctx.fillRect(Math.floor(this.position.x - camera.center.x + camera.width / 2), Math.floor(this.position.y - camera.center.y + camera.height / 2), this.width, this.height);
  };
}