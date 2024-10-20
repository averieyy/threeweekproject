import type { Point } from "./point";

export class Platform {
  pos: Point;
  w: number;
  h: number;

  constructor (x: number, y: number, width: number, height: number) {
    this.pos = {x, y};
    this.w = width;
    this.h = height;
  }
}