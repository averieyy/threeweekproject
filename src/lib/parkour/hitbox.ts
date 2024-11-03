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
    const { ur, ll } = h.corners;
  
    const cropped : { left: number, top: number, right: number, down: number } = { left: 0, top: 0, right: 0, down: 0 };
    cropped.left = Math.max(this.corners.ll.x, ll.x);
    cropped.top = Math.max(this.corners.ur.y, ur.y);
    cropped.right = Math.min(this.corners.ur.x, ur.x);
    cropped.down = Math.min(this.corners.ll.y, ll.y);

    const width = cropped.right - cropped.left;
    const height = cropped.down - cropped.top;
    
    return width > 0 && height > 0;
  }

  render (ctx: OffscreenCanvasRenderingContext2D, camera: Camera): void {
    ctx.fillStyle = 'red';
    
    ctx.fillRect(Math.floor(this.position.x - camera.center.x + camera.width / 2), Math.floor(this.position.y - camera.center.y + camera.height / 2), this.width, this.height);
  };
}