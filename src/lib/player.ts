import { Camera } from "./camera";
import { HitBox } from "./hitbox";
import type { Level } from "./level";
import type { Renderable } from "./renderable";
import type { Vector2 } from "./vector2";

const normalWidth = 10;
const normalHeight = 16;
const slideWidth = 10;
const slideHeight = 12;

export class Player implements Renderable {
  name : string;
  onGround: boolean = true;
  velocity: Vector2 = { x: 0, y: 0 };
  position: Vector2;
  level: Level;
  sliding: boolean = false;

  hitbox: HitBox;
  
  constructor (name: string, level: Level) {
    this.name = name;
    this.level = level;

    this.position = level.startPos;

    this.hitbox = new HitBox(this.position, normalWidth, normalHeight);
  }

  updateHitBox () {
    this.hitbox = this.sliding
      ? new HitBox(this.position, slideWidth, slideHeight)
      : new HitBox(this.position, normalWidth, normalHeight);
  }

  checkIfOnGround () {
    return true;
  }

  centercamera (camera: Camera) {
    camera.move({ x: this.position.x + this.hitbox.width / 2, y: this.position.y + this.hitbox.height / 2 })
  }

  render (ctx: OffscreenCanvasRenderingContext2D, camera: Camera) {
    this.hitbox.render(ctx, camera);
  }
}