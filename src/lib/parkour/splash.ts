import DeadSplashImg from '$lib/assets/parkour/splashes/youdied.png';
import WinSplashImg from '$lib/assets/parkour/splashes/youwon.png';
import PauseSplashImg from '$lib/assets/parkour/splashes/paused.png';
import SkullIcon from '$lib/assets/parkour/skullicon.png';
import type { Renderable } from './renderable';
import { type Game, numbersInNumbers } from './game';
import { numbers } from './assets';

const skulliconimg = new Image();
skulliconimg.src = SkullIcon;

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
    if (!this.showing) return;
    ctx.drawImage(this.image, 0, Math.floor(this.y));
  }
}

export class PauseSplash extends Splash {
  game: Game;

  constructor(game: Game) {
    super(PauseSplashImg);

    this.game = game;
  }

  override render(ctx: OffscreenCanvasRenderingContext2D) {
    if (!this.showing) return;
    ctx.drawImage(this.image, 0, 0);
    ctx.drawImage(skulliconimg, 4, 75);

    const deathstring = this.game.deaths.toString()

    for (let i = 0; i < deathstring.length; i++) {
      const image = numbers[numbersInNumbers.indexOf(deathstring[i])];
      if (!image) break;
      ctx.drawImage(image, 23 + i * 4, 80);
    }
  }
}

export class WinSplash extends Splash {
  constructor() {
    super(WinSplashImg);
  }
}

export class DeadSplash extends Splash {
  constructor() {
    super(DeadSplashImg);
  }
}