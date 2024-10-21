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

  move (center: Vector2) {
    this.center = center;
  }
}