import Front from '$lib/assets/parkour/parallax/front.png';
import Mid from '$lib/assets/parkour/parallax/mid.png';
import Back from '$lib/assets/parkour/parallax/mountainsun.png';
import type { Camera } from './camera';
import type { Platform } from './platform';
import type { Player } from './player';
import type { Renderable } from './renderable';

const layers = [
  new Image(),
  new Image(),
  new Image(),
];

layers[0].src = Front;
layers[1].src = Mid;
layers[2].src = Back;

export class Parallax implements Renderable {
  minx: number;
  maxx: number;
  miny: number;
  maxy: number;

  levelwidth: number;
  levelheight: number;

  constructor (platforms: Platform[]) {
    if (platforms.length == 0) {
      this.minx = 0;
      this.miny = 0;
      this.maxx = 0;
      this.maxy = 0;

      this.levelwidth = 0;
      this.levelheight = 0;

      return;
    };

    this.minx = platforms.sort((a, b) => a.position.x - b.position.x)[0].position.x - 100;
    this.miny = platforms.sort((a, b) => a.position.y - b.position.y)[0].position.y - 100;
    this.maxx = platforms.sort((a, b) => b.corners.lr.x - a.corners.lr.x)[0].corners.lr.x + 100;
    this.maxy = platforms.sort((a, b) => b.corners.lr.y - a.corners.lr.y)[0].corners.lr.y + 100;

    this.levelwidth = this.maxx - this.minx;
    this.levelheight = this.maxy - this.miny;
  }

  render (ctx: OffscreenCanvasRenderingContext2D, camera: Camera) {
    // Legal rendering range (-100, -75) -> (300, 225)

    const playerx = (camera.center.x - this.minx) / this.levelwidth;
    const playery = (camera.center.y - this.miny) / this.levelheight;

    // console.log(Math.floor(playerx / this.levelwidth * 400 - 100),);

    ctx.drawImage(layers[2],
      Math.floor(playerx * -50 - 100),
      Math.floor(playery * -37.5 - 75)
    );

    ctx.drawImage(layers[1],
      Math.floor(playerx * -150),
      Math.floor(playery * -107.5)
    );

    ctx.drawImage(layers[0],
      Math.floor(playerx * -200),
      Math.floor(playery * -150)
    );
  }
}