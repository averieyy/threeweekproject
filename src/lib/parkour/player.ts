import { crouching, running } from "./assets";
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
  velocity: Vector2 = { x: 0, y: 0 };
  position: Vector2;
  level: Level;
  sliding: boolean = false;

  ground?: Platform;

  hitbox: HitBox;

  width: number = normalHeight;
  height: number = normalWidth;

  // 0: right, 1: left
  direction: number = 0;
  animationframe: number = 0;

  dead: boolean = false;

  hitbouncepad: boolean = false;

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

  getOverlapping () : Platform[] {
    return this.level.platforms.filter(p => this.hitbox.overlaps(p));
  }

  getGround (possibleGround: Platform[]) : Platform | undefined {
    if (possibleGround.length < 1) {
      let straightBeneath = possibleGround.filter(p => p.corners.ll.x < this.hitbox.centerpos.x && p.corners.ll.x < this.hitbox.centerpos.x);
      if (straightBeneath.length == 1) return straightBeneath[0];
      else return possibleGround.sort((a,b) => b.position.y - a.position.y)[0];
    };
    return possibleGround[0];
  }

  adjustForGround(directionkeys: { left: boolean, right: boolean }) {
    if (this.ground && this.velocity.y > 1 && this.sliding) {
      if (directionkeys.left && !directionkeys.right) this.velocity.x -= this.velocity.y;
      if (directionkeys.right && !directionkeys.left) this.velocity.x += this.velocity.y;
    }

    if (this.ground) {
      this.velocity.y = 0;
      // this.position.y = this.ground.position.y - this.height;
    }

    this.updatePosition();
  }

  collide(overlapping: Platform[]) {
    let possiblegrounds = [];
    
    for (let p of overlapping) {
      let sides = { up: false, down: false, left: false, right: false };

      if (p.corners.ll.y >= this.position.y && this.position.y >= p.position.y) sides.down = true;
      if (p.position.y <= this.hitbox.corners.ll.y && p.corners.ll.y >= this.hitbox.corners.ll.y) sides.up = true;
      if (p.corners.lr.x >= this.position.x && this.position.x >= p.position.x) sides.right = true;
      if (p.position.x <= this.hitbox.corners.lr.x && p.corners.lr.x >= this.hitbox.corners.lr.x) sides.left = true;
      
      const ydiff = Math.min(p.corners.ll.y - this.position.y, this.hitbox.corners.ll.y - p.position.y);
      const xdiff = Math.min(p.corners.lr.x - this.position.x, this.hitbox.corners.lr.x - p.position.x);
      
      if (xdiff < ydiff) {
        if (sides.left || sides.right) this.animationframe = 0;
        if (sides.right)
          this.position.x = p.corners.lr.x;
        if (sides.left)
          this.position.x = p.position.x - this.hitbox.width;
      }
      else {
        if (sides.down) {
          this.position.y = p.corners.ll.y;
          this.velocity.y = Math.max(0, this.velocity.y);
        }
        if (sides.up) {
          this.position.y = p.position.y - this.hitbox.height;
          possiblegrounds.push(p);
        }
      }
    }
    this.ground = this.getGround(possiblegrounds);
  }

  centercamera (camera: Camera) {
    if (!this.dead)
      camera.move(this.hitbox);
  }

  render (ctx: OffscreenCanvasRenderingContext2D, camera: Camera) {
    const image = this.sliding || this.dead
      ? crouching[0 + this.direction]
      : running[0 + Math.floor(this.animationframe) + this.direction * 8]
    if (!image) return;
    ctx.drawImage(image, Math.floor(this.position.x - camera.center.x + camera.width / 2), Math.floor(this.position.y - camera.center.y + camera.height / 2));
    // this.hitbox.render(ctx, camera);
  }

  move (directions: { up: boolean, down: boolean, left: boolean, right: boolean }) {
    const { up, down, left, right } = directions;

    if (this.dead) return;

    if (down) {
      this.sliding = true;
    }
    else {
      this.sliding = false;
    }
    if (up && this.ground && !this.sliding) {
      // Jump
      this.velocity.y = -2.5;
      this.ground = undefined;
    }

    if (!up) {
      // Cancel jump mid-air
      this.hitbouncepad = this.hitbouncepad && this.velocity.y < 0;
      if (!this.hitbouncepad)
        this.velocity.y = Math.max(this.velocity.y, 0);
    }

    if (!this.sliding) {
      if (left && this.velocity.x > -1.5) this.velocity.x = this.velocity.x - .75;
      if (right && this.velocity.x < 1.5) this.velocity.x = this.velocity.x + .75;
    }

    if (this.velocity.x < 0) this.direction = 1;
    if (this.velocity.x > 0) this.direction = 0;

    if (Math.abs(this.velocity.x) > 0.5 && (directions.left || directions.right)) this.animationframe += Math.abs(this.velocity.x) / 10;
    this.animationframe %= 8;

    if (!(directions.left || directions.right)) this.animationframe = 0;
    if (!this.ground) this.animationframe = 2;
  }

  gravitate () {
    this.velocity.y += this.level.gravity * (this.sliding && Math.abs(this.velocity.x) > 1.5 ? 1.5 : 1);
    if (this.sliding && this.velocity.y > 5) this.velocity.y = 5;
    else if (this.velocity.y > 4) this.velocity.y = 4;
  }

  doFriction () {
    // console.log(!!this.ground);
    
    if (!this.sliding && this.ground) {
      this.velocity.x *= 1 - this.ground.friction;
    }
    else if (!this.ground) {
      if (this.sliding) this.velocity.x *= .99;
      else this.velocity.x *= .95
    }
    else {
      this.velocity.x *= .98;
    }
  }
  
  ressurect () {
    this.dead = false;

    // Reset everything
    this.position = this.level.startPos;
    this.velocity = { x: 0, y: 0 }

    this.direction = 0;
    this.ground = undefined;
    this.sliding = false;

    this.updatePosition();
  }
}