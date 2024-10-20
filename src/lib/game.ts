export class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  buffer: OffscreenCanvas;
  bufferctx: OffscreenCanvasRenderingContext2D;

  canvaswidth: number;
  canvasheight: number;

  constructor (canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const context = canvas.getContext('2d');
    if (!context) throw Error('Could not get context buffer');
    this.ctx = context;

    this.canvasheight = canvas.height;
    this.canvaswidth = canvas.width;

    this.buffer = new OffscreenCanvas(canvas.width, canvas.height);
    const ctxbuffer =this.buffer.getContext('2d'); 
    if (!ctxbuffer) throw Error('Could not get offscreen context buffer');
    this.bufferctx = ctxbuffer;
  }

  render() {


    // Switch buffers
    this.ctx.putImageData(this.bufferctx.getImageData(0, 0, this.canvaswidth, this.canvasheight), 0, 0);
  }
}