import { numbers } from "./assets";
import { Camera } from "./camera";
import { Level } from "./level";
import { Player } from "./player";
import { deadsplash } from "./splash";

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

  directions: { up: boolean, down: boolean, left: boolean, right: boolean } = {up: false, down: false, left: false, right: false };

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

    this.player = new Player('test', Level.levels[0]);
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
        this.player.ressurect();
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

    for (let spike of this.player.level.spikes) {
      spike.render(this.bufferctx, this.camera);
    }

    for (let platform of this.player.level.platforms) {
      platform.render(this.bufferctx, this.camera);
    }

    for (let bouncepad of this.player.level.bouncepads) {
      bouncepad.render(this.bufferctx, this.camera);
    }

    for (let infoplaque of this.player.level.plaques) {
      infoplaque.render(this.bufferctx, this.camera);
    }
    
    this.player.render(this.bufferctx, this.camera);

    this.player.level.coffee.render(this.bufferctx, this.camera);

    deadsplash.render(this.bufferctx);

    // Render time
    const hours = Math.floor(this.currenttime / 3600000);
    const minutes = Math.floor(this.currenttime / 60000) % 60;

    const hourstext = hours != 0 && hours.toString().padStart(2, '0') + ':';
    const minutestext = (hours != 0 || minutes != 0) && minutes.toString().padStart(2, '0') + ':';
    const secondstext = Math.floor((this.currenttime / 1000) % 60).toString().padStart(2, '0');
    const millisecondstext = (this.currenttime % 1000).toString().padStart(3, '0');

    const textTime = `${hourstext || ''}${minutestext || ''}${secondstext}.${millisecondstext}`;
    // (this.currenttime / 1000).toFixed(1)

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
      this.currenttime = Date.now() - this.starttime;
      this.player.move(this.directions);

      // Tick
      this.player.position.x += this.player.velocity.x;
      this.player.position.y += this.player.velocity.y;

      this.player.updatePosition();

      this.player.gravitate();
      this.player.doFriction();

      // For testing
      // if (this.directions.up) this.player.position.y --;
      // if (this.directions.down) this.player.position.y ++;
      // if (this.directions.left) this.player.position.x --;
      // if (this.directions.right) this.player.position.x ++;

      this.player.updatePosition()

      const overlapping = this.player.getOverlapping();
      
      this.player.collide(overlapping);
      this.player.adjustForGround(this.directions);
      this.player.updatePosition();
      
      // Chack for bouncepads
      for (let bouncepad of this.player.level.bouncepads) {
        if (this.player.hitbox.overlaps(bouncepad.hitbox)) bouncepad.collide(this.player);
      }

      for (let spike of this.player.level.spikes) {
        if (this.player.hitbox.overlaps(spike.hitbox)) spike.collide(this.player);
      }

      // Check for coffee
      if (this.player.hitbox.overlaps(this.player.level.coffee.hitbox))
        this.player.level.coffee.collide(this.player);
      
      if (this.player.position.y > 96) this.player.dead = true;
      if (!this.player.dead) deadsplash.hide();

      this.player.centercamera(this.camera);

      if (this.player.dead) {
        if (!deadsplash.showing) deadsplash.show();
      }

      deadsplash.update();

      // Render
      this.resize();
      this.render();
    }, 1000 / Game.FPS);

  }
}