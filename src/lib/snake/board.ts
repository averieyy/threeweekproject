export class Board {
  size: number;
  snake: [x:number, y:number][] = [[0,0], [0,0], [0,0]];
  head: [x:number, y:number] = [0,0];

  /*
 Snake heading. (clockwise from up)

  0: Up
  1: Right
  2: Down
  3: Left
  */
  direction: 0 | 1 | 2 | 3 = 1;
  bufferHeading: 0 | 1 | 2 | 3 = this.direction;

  applepos: [x:number, y:number];
  finished: boolean = false;
  dead: boolean = false;

  constructor (size: number) {
    this.size = size;

    let newapplepos = this.getApplePos();
    this.applepos = newapplepos || [size-1, size-1];
  }

  getApplePos() : [x:number, y:number] | null {
    let emptySpaces: [x:number, y:number][] = [];
    for (let x = 0; x < this.size; x++) {

      for (let y = 0; y < this.size; y++) {
        emptySpaces.push([x,y]);
      }
    }

    for (let node of this.snake) {
      
      emptySpaces.splice(emptySpaces.findIndex(p => p[0] == node[0] && p[1] == node[1]), 1);
    }

    if (emptySpaces.length == 0) return null;
    return emptySpaces[Math.floor(Math.random() * emptySpaces.length)];
  }

  movehead () {
    let newhead: [x: number, y: number];
    switch (this.bufferHeading) {
      case 0: newhead = [this.head[0], this.head[1] - 1]; break;
      case 1: newhead = [this.head[0] + 1, this.head[1]]; break;
      case 2: newhead = [this.head[0], this.head[1] + 1]; break;
      case 3: newhead = [this.head[0] - 1, this.head[1]]; break;
    }
    this.snake.push(newhead);
    this.head = newhead;
  }

  movebody() {
    this.snake.shift();
  }

  checkCollision () : boolean {
    for (let body of this.snake.slice(0,-1)) {
      if (this.head[0] == body[0] && this.head[1] == body[1]) return true;
    }

    if (this.head[0] >= this.size) return true;
    if (this.head[1] >= this.size) return true;
    if (this.head[0] < 0) return true;
    if (this.head[1] < 0) return true;

    return false;
  }

  render(ctx: OffscreenCanvasRenderingContext2D) {

    ctx.fillStyle = '#666';
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if ((x + y) % 2 == 0) ctx.fillRect(x,y,1,1);
      }
    }

    ctx.fillStyle = '#888';
    for (let y = 0; y < this.size; y++) {
      for (let x = 0; x < this.size; x++) {
        if ((x + y) % 2 == 1) ctx.fillRect(x,y,1,1);
      }
    }

    ctx.fillStyle = '#474';
    for (let s of this.snake) {
      ctx.fillRect(...s, 1, 1);
    }

    ctx.fillStyle = '#4e4';
    ctx.fillRect(...this.head, 1, 1);

    ctx.fillStyle = '#e44';
    ctx.fillRect(...this.applepos, 1, 1);
  }
}