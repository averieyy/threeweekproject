import { Camera } from "./camera";
import { Level } from "./level";
import type { Platform } from "./platform";
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

    this.resize();

    this.mainloop();
  }

  render() {
    for (let platform of this.player.level.platforms) {
      platform.render(this.bufferctx, this.camera);
    }
    
    this.player.render(this.bufferctx, this.camera);

    // Switch buffers
    const image = 
    this.ctx.putImageData(this.bufferctx.getImageData(0, 0, this.canvaswidth, this.canvasheight), 0, 0);
  }

  resize () {
    const idealWidth = 200
    const idealHeight = 150;

    const visualw = this.canvas.clientWidth;
    const visualh = this.canvas.clientHeight;

    let scalefactor: number;

    if (visualh / idealHeight < visualw / idealWidth) {
      scalefactor = visualh / idealHeight;
    }
    else {
      scalefactor = visualw / idealWidth;
    }

    this.canvas.width = visualw / scalefactor;
    this.canvas.height = visualh / scalefactor;
  }

  mainloop () {

    setInterval(() => {


      // Render
      this.resize();
      this.render();
    }, 1000 / Game.FPS);

  }
}