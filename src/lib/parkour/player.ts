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

export class Player implements Renderable {
  name : string;
  onGround: boolean = true;
  velocity: Vector2 = { x: 0, y: 0 };
  position: Vector2;
  level: Level;
  sliding: boolean = false;

  ground?: Platform;

  hitbox: HitBox;
  
  constructor (name: string, level: Level) {
    this.name = name;
    this.level = level;

    this.position = level.startPos;

    this.hitbox = new HitBox(this.position, normalWidth, normalHeight);
  }

  updateHitBox () {
    if (!this.ground) {
      this.hitbox = this.sliding
        ? new HitBox(this.position, slideWidth, slideHeight)
        : new HitBox(this.position, normalWidth, normalHeight);
    }
    else {
      this.hitbox = this.sliding
        ? new HitBox({ x: this.position.x, y: this.ground.position.y - slideHeight }, slideWidth, slideHeight)
        : new HitBox({ x: this.position.x, y: this.ground.position.y - normalHeight }, normalWidth, normalHeight);
    }
  }

  checkIfOnGround () {
    const downhitbox = new HitBox({ x: this.position.x, y: this.position.y + .1 }, this.hitbox.width, this.hitbox.height);

    for (let platform of this.level.platforms) {
      if (downhitbox.corners.ll.y < platform.centerpos.y) continue;
      if (downhitbox.overlaps(platform)) {
        this.ground = platform;
        if (this.velocity.x < -.5) {
          this.velocity.x -= this.velocity.y
        }
        else if (this.velocity.x > .5) {
          this.velocity.x += this.velocity.y
        }
        return true;
      };
    }

    this.ground = undefined;
    return false;
  }

  centercamera (camera: Camera) {
    camera.move(this.hitbox);
  }

  render (ctx: OffscreenCanvasRenderingContext2D, camera: Camera) {
    this.hitbox.render(ctx, camera);

    ctx.fillStyle = "blue";
    ctx.fillRect(this.position.x - camera.center.x + camera.width / 2, this.position.y - camera.center.y + camera.height / 2, this.hitbox.width, this.hitbox.height);
  }

  move (directions: { up: boolean, down: boolean, left: boolean, right: boolean }) {
    const { up, down, left, right } = directions;

    if (down) {
      this.sliding = true;
    }
    else {
      this.sliding = false;
    }
    if (up && this.onGround) {
      console.log('Jumping');
      
      // Jump
      this.velocity.y = -3;
      this.onGround = false;
    }

    if (!up) {
      // Cancel jump mid-air
      this.velocity.y = Math.max(this.velocity.y, 0);
    }

    if (this.onGround && !this.sliding) {
      if (left && this.velocity.x > -2) this.velocity.x = this.velocity.x - 1;
      if (right && this.velocity.x < 2) this.velocity.x = this.velocity.x + 1;
    }

  }

  gravitate () {
    if (!this.onGround) {
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