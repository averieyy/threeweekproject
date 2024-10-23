import { Camera } from "./camera";
import { Level } from "./level";
import { Platform } from "./platform";
import { Player } from "./player";

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

    this.mainloop();
  }

  keybinds () {
    document.addEventListener('keydown', (ev) => {
      switch(ev.key) {
        case ' ':
        case 'ArrowUp': this.directions.up = true; break;
        case 'ArrowDown': this.directions.down = true; break;
        case 'ArrowLeft': this.directions.left = true; break;
        case 'ArrowRight': this.directions.right = true; break;
      }
    });

    document.addEventListener('keyup', (ev) => {
      switch(ev.key) {
        case ' ':
        case 'ArrowUp': this.directions.up = false; break;
        case 'ArrowDown': this.directions.down = false; break;
        case 'ArrowLeft': this.directions.left = false; break;
        case 'ArrowRight': this.directions.right = false; break;
      }
    });
  }

  render() {
    this.bufferctx.clearRect(0,0,this.canvaswidth, this.canvasheight);

    for (let platform of this.player.level.platforms) {
      platform.render(this.bufferctx, this.camera);
    }
    
    this.player.render(this.bufferctx, this.camera);


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
      this.player.move(this.directions);
      // Tick

      this.player.position.x += this.player.velocity.x;
      this.player.position.y += this.player.velocity.y;

      console.log(!!this.player.ground);

      this.player.gravitate();
      this.player.doFriction();

      const ground = this.player.getGround();
      this.player.ground = ground;

      this.player.updatePosition();
      
      if (this.player.ground && this.player.velocity.y !== 0) {
        this.player.velocity.y = 0;
      }

      this.player.centercamera(this.camera);

      // Render
      this.resize();
      this.render();
    }, 1000 / Game.FPS);

  }
}