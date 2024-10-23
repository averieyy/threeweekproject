import type { HitBox } from "./hitbox";
import type { Vector2 } from "./vector2";

export class Camera {
  center: Vector2;
  width: number;
  height: number;

  constructor (center: Vector2, width: number = 200, height: number = 150) {
    this.center = center;
    this.width = width;
    this.height = height;
  }

  move (target: HitBox) {
    this.center = { x: target.position.x + target.width / 2, y: target.position.y + target.height / 2 };
  }
}