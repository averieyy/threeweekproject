import { Board } from "./board";

export class Game {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  buffercanvas: OffscreenCanvas;
  bufferctx: OffscreenCanvasRenderingContext2D;
  board: Board;
  size: number = 6;
  maininterval: NodeJS.Timeout | undefined;

  score: number = 0;

  constructor (canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    canvas.width = this.size;
    canvas.height = this.size;

    this.board = new Board(this.size);

    const context = canvas.getContext('2d');
    if (!context) throw new Error('no context lol :/');
    this.ctx = context;

    this.buffercanvas = new OffscreenCanvas(this.size, this.size);

    const buffercontext = this.buffercanvas.getContext('2d');
    if (!buffercontext) throw new Error('no buffer context lol :/');
    this.bufferctx = buffercontext;

    this.keybind();
  }

  resize () {
    this.canvas.width = this.board.size;
    this.canvas.height = this.board.size;
    this.buffercanvas.width = this.board.size;
    this.buffercanvas.height = this.board.size;
  }

  restart () {
    this.size = 6;
    this.score = 0;
    this.board = new Board(this.size);
    this.resize();
    this.mainloop();
  }

  keybind () {
    document.addEventListener('keydown', (ev) => {
      switch(ev.key) {
        case 'ArrowUp': this.board.bufferHeading = 0; break;
        case 'ArrowRight': this.board.bufferHeading = 1; break;
        case 'ArrowDown': this.board.bufferHeading = 2; break;
        case 'ArrowLeft': this.board.bufferHeading = 3; break;
      }
    });
  }

  mainloop () {
    // Record play to the database
    fetch('/api/play', { method: 'POST', body: '{"gameid": 1}' });

    this.maininterval = setInterval(() => {
      if (this.board.finished) {
        this.size += 2;
        this.board = new Board(this.size);
        clearInterval(this.maininterval);
        this.resize();
        this.mainloop();
        return;
      }
      this.tick();
      this.board.render(this.bufferctx);

      this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
      this.ctx.putImageData(this.bufferctx.getImageData(0,0,this.buffercanvas.width,this.buffercanvas.height), 0, 0);
      this.bufferctx.clearRect(0,0,this.buffercanvas.width, this.buffercanvas.height);
    }, 1000 / this.size * 2.5);
  }

  die() {
    clearInterval(this.maininterval);

    // Update leaderboards
    fetch('/api/leaderboard', { method: 'POST', body: JSON.stringify({ gameid: 1, points: this.score }) })
  
    this.restart();
  }

  tick() {
    this.board.movehead();
    this.board.movebody();
    if (this.board.head[0] == this.board.applepos[0] && this.board.head[1] == this.board.applepos[1]) {
      this.board.snake.unshift(this.board.snake[0]);
      const newpos = this.board.getApplePos();
      if (!newpos)
        this.board.finished = true;
      else
        this.board.applepos = newpos;

      this.score ++;
    }

    if (this.board.checkCollision()) {
      this.die();
    }
  }

  stop () {
    clearInterval(this.maininterval);
  }
}