import DeadSplash from '$lib/assets/parkour/splashes/youdied.png';
import type { Camera } from './camera';
import type { Renderable } from './renderable';

export class Splash implements Renderable {
  image: CanvasImageSource;
  
  y: number = 200;
  showing : boolean = false;

  constructor (path: string) {
    this.image = new Image();
    this.image.src = path;
  }

  update (){
    if (this.showing) {
      this.y *= .97;
      if (this.y > 0) this.y -= .125;
      if (this.y < 0) this.y = 0;
    }
  }

  show() {
    this.showing = true;
    this.y = 200;
  }

  hide () {
    this.showing = false;
    this.y = 200;
  }

  render(ctx: OffscreenCanvasRenderingContext2D) {
    ctx.drawImage(this.image, 0, Math.floor(this.y));
  }
}

export const deadsplash = new Splash(DeadSplash);