import { numbers } from "./assets";
import { Camera } from "./camera";
import { Level } from "./level";
import { Player } from "./player";
import { deadsplash, winsplash } from "./splash";
import { toTimeString } from "../time";
import { LevelAnimation } from "./levelanimation";

Level.loadLevels();

const numbersInNumbers = '0123456789.:';

export class Game {
  static readonly FPS = 60;
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  buffer: OffscreenCanvas;
  bufferctx: OffscreenCanvasRenderingContext2D;

  canvaswidth: number;
  canvasheight: number;

  player: Player;
  camera: Camera;

  starttime : number;
  currenttime: number = 0;

  updatedHighscore: boolean = false;

  currentlevel: Level;

  directions: { up: boolean, down: boolean, left: boolean, right: boolean } = {up: false, down: false, left: false, right: false };

  levelAnimation?: LevelAnimation;

  constructor (canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw Error('Could not get canvas context buffer');
    this.ctx = context;

    this.canvasheight = canvas.height;
    this.canvaswidth = canvas.width;

    this.buffer = new OffscreenCanvas(canvas.width, canvas.height);
    const ctxbuffer =this.buffer.getContext('2d'); 
    if (!ctxbuffer) throw Error('Could not get offscreen context buffer');
    this.bufferctx = ctxbuffer;

    this.currentlevel = Level.levels[0];
    
    this.player = new Player('test', this.currentlevel.startPos);
    this.camera = new Camera(this.player.position, 200, 150);
    this.player.centercamera(this.camera);
    
    this.keybinds();
    this.resize();

    this.starttime = Date.now();

    this.mainloop();

    // Record this play to the database
    fetch('/api/play', { method: 'POST', body: '{"gameid": 0}' });
  }

  keybinds () {
    document.addEventListener('keydown', (ev) => {
      if (this.player.dead && [' ', 'Enter'].includes(ev.key)) {
        this.player.ressurect(this.currentlevel);
        return;
      }

      switch(ev.key) {
        case ' ':
        case 'w':
        case 'ArrowUp': this.directions.up = true; break;
        case 's':
        case 'ArrowDown': this.directions.down = true; break;
        case 'a':
        case 'ArrowLeft': this.directions.left = true; break;
        case 'd':
        case 'ArrowRight': this.directions.right = true; break;
      }
    });

    document.addEventListener('keyup', (ev) => {
      switch(ev.key) {
        case ' ':
        case 'w':
        case 'ArrowUp': this.directions.up = false; break;
        case 's':
        case 'ArrowDown': this.directions.down = false; break;
        case 'a':
        case 'ArrowLeft': this.directions.left = false; break;
        case 'd':
        case 'ArrowRight': this.directions.right = false; break;
      }
    });
  }

  render() {
    this.bufferctx.clearRect(0,0,this.canvaswidth, this.canvasheight);

    this.currentlevel.parallax.render(this.bufferctx, this.camera);

    for (let spike of this.currentlevel.spikes) {
      spike.render(this.bufferctx, this.camera);
    }

    for (let platform of this.currentlevel.visiblePlatforms) {
      platform.render(this.bufferctx, this.camera);
    }

    for (let bouncepad of this.currentlevel.bouncepads) {
      bouncepad.render(this.bufferctx, this.camera);
    }

    for (let infoplaque of this.currentlevel.plaques) {
      infoplaque.render(this.bufferctx, this.camera);
    }
    
    this.player.render(this.bufferctx, this.camera);

    this.currentlevel.coffee.render(this.bufferctx, this.camera);

    deadsplash.render(this.bufferctx);
    winsplash.render(this.bufferctx);

    this.levelAnimation?.render(this.bufferctx)

    // Render time
    const textTime = toTimeString(this.currenttime);

    for (let i = 0; i < textTime.length; i++) {
      const image = numbers[numbersInNumbers.indexOf(textTime[i])];
      if (!image) break;
      this.bufferctx.drawImage(image, 2 + i * 4, 2);
    }

    // Switch buffers
    this.ctx.putImageData(this.bufferctx.getImageData(0, 0, this.canvaswidth, this.canvasheight), 0, 0);
  }

  resize () {
    const idealWidth = 200
    const idealHeight = 150;

    this.canvas.width = idealWidth;
    this.canvas.height = idealHeight;
  }

  mainloop () {
    setInterval(() => {
      if (this.player.won) {
        if (!this.updatedHighscore) {
          fetch('/api/leaderboard', {method: 'POST', body: JSON.stringify({gameid: 0, points: this.currenttime})});
          
          this.updatedHighscore = true;
        }

        if (!winsplash.showing) winsplash.show();
        
        winsplash.update();
      }
      else {

        this.currentlevel.updateVisiblePlatforms(this.camera);

        this.currenttime = Date.now() - this.starttime;

        if (!this.levelAnimation)
          this.player.tick(this.directions, this.currentlevel, this.camera);
        else this.levelAnimation.update();

        if (!this.player.dead) deadsplash.hide();
  
        if (this.player.dead) {
          if (!deadsplash.showing) deadsplash.show();
        }

        if (this.player.hitbox.overlaps(this.currentlevel.coffee.hitbox) && !this.levelAnimation) {
          const newlevel = this.currentlevel.coffee.getNewLevel();

          if (!newlevel) {
            this.player.won = true;
          }
          else {
            this.levelAnimation = new LevelAnimation(this.camera, () => {
              // Halfway
              this.currentlevel = newlevel;
              this.player.position = newlevel.startPos;
              this.player.sliding = false;
              this.player.direction = 0;
              this.player.velocity = { x: 0, y: 0 };
              this.player.animationframe = 0;
            }, () => {
              // Done
              this.levelAnimation = undefined;
            }, this.currentlevel, newlevel);
          }
        }
  
        deadsplash.update();
      }

      // Render
      this.resize();
      this.render();
    }, 1000 / Game.FPS);

  }
}