import { HitBox } from "./hitbox";
import type { Vector2 } from "./vector2";

export class Platform extends HitBox {
  friction: number;

  constructor (pos: Vector2, width: number, height: number, friction: number) {
    super(pos, width, height);

    this.friction = friction;
  }
}