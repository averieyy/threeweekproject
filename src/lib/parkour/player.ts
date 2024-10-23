import { Camera } from "./camera";
import { HitBox } from "./hitbox";
import type { Level } from "./level";
import type { Platform } from "./platform";
import type { Renderable } from "./renderable";
import type { Vector2 } from "./vector2";

const normalWidth = 10;
const normalHeight = 16;
const slideWidth = 10;
const slideHeight = 12;

export class Player implements Object {
  name : string;
  velocity: Vector2 = { x: 0, y: 0 };
  position: Vector2;
  level: Level;
  sliding: boolean = false;

  ground?: Platform;

  hitbox: HitBox;

  width: number = normalHeight;
  height: number = normalWidth;

  constructor (name: string, level: Level) {
    this.name = name;
    this.level = level;

    this.position = level.startPos;

    this.hitbox = new HitBox(this.position, normalWidth, normalHeight);
  }

  updatePosition () {
    if (this.ground) {
      this.position = {x: this.position.x, y: this.ground.position.y - (this.sliding ? slideHeight : normalHeight)};
    }
    this.width = normalWidth;
    this.height = this.sliding ? slideHeight : normalHeight;

    this.hitbox = new HitBox(this.position, this.width, this.height);
  }

  getGround () : Platform | undefined {
    const downhitbox = new HitBox({ x: this.position.x, y: this.position.y + .1 }, this.hitbox.width, this.hitbox.height);

    for (let platform of this.level.platforms) {
      if (downhitbox.overlaps(platform)) {
        return platform;
      };
    }
  }

  centercamera (camera: Camera) {
    camera.move(this.hitbox);
  }

  render (ctx: OffscreenCanvasRenderingContext2D, camera: Camera) {
    this.hitbox.render(ctx, camera);
  }

  move (directions: { up: boolean, down: boolean, left: boolean, right: boolean }) {
    const { up, down, left, right } = directions;

    if (down) {
      this.sliding = true;
    }
    else {
      this.sliding = false;
    }
    if (up && this.ground) {
      // Jump
      this.velocity.y = -3;
      this.ground = undefined;
    }

    if (!up) {
      // Cancel jump mid-air
      this.velocity.y = Math.max(this.velocity.y, 0);
    }

    if (!this.sliding) {
      if (left && this.velocity.x > -2) this.velocity.x = this.velocity.x - 1;
      if (right && this.velocity.x < 2) this.velocity.x = this.velocity.x + 1;
    }

  }

  gravitate () {
    if (!this.ground) {
      
      this.velocity.y += this.level.gravity;
      if (this.velocity.y > 4) this.velocity.y = 4;
    }
  }

  doFriction () {
    if (!this.sliding && this.ground) {
      this.velocity.x *= 1 - this.ground.friction;
    }
    if (this.sliding) {
      this.velocity.x;
    }
  }
}