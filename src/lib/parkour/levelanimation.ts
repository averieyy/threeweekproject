import type { Camera } from "./camera";

import BetweenImage from '$lib/assets/parkour/betweenlevels.png';
import type { Renderable } from "./renderable";
import type { Level } from "./level";

const image = new Image();
image.src = BetweenImage;


export class LevelAnimation implements Renderable {

  camera: Camera;
  yoffset: number = 0;
  progress: number = 0;

  halfway: () => void;
  done: () => void;

  tolevel: Level;
  fromlevel: Level;

  called_halfway: boolean = false;

  constructor (camera : Camera, halfway: () => void, done: () => void, fromlevel: Level, tolevel: Level) {

    this.camera = camera;

    this.halfway = halfway;
    this.done = done;

    this.tolevel = tolevel;
    this.fromlevel = fromlevel;
  }

  update () {
    if (this.progress >= 0.5 && !this.called_halfway) {
      this.halfway();
      
      this.camera.center.x = this.tolevel.startPos.x + 5;
      this.camera.center.y = this.tolevel.startPos.y + 100 + 8;

      this.called_halfway = true;
    }
    if (this.progress >= 1) this.done();

    this.progress += 0.01;

    const sineProgress = this.progress * Math.PI + Math.PI

    // Smooth animation curve
    // f(x) = cos(x), pi < x < 2pi
    this.yoffset = Math.cos(sineProgress) * 200;

    console.log(this.yoffset);

    // Shift camera upwards
    this.camera.center.y += Math.sin(sineProgress) * Math.PI;
  }

  render (ctx: OffscreenCanvasRenderingContext2D) {
    // Draw image
    ctx.drawImage(image, 0, this.yoffset);
  }
}