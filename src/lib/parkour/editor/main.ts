import { BouncePad, bouncepadimgs } from "../bouncepad";
import { Camera } from "../camera";
import { Coffee } from "../coffee";
import { Level } from "../level";
import { Platform, platformimg } from "../platform";
import { Spikes, spikesimg } from "../spikes";
import type { Vector2 } from "../vector2";

const EDITORHEIGHT = 150;
const EDITORWIDTH = 200;

import Trash from '$lib/assets/parkour/trash.png';
import { HitBox } from "../hitbox";
import { Player } from "../player";

const trash = new Image();
trash.src = Trash;

export class Editor {
  canvas: HTMLCanvasElement;
  ctx: CanvasRenderingContext2D;
  buffercanv: OffscreenCanvas;
  bufferctx: OffscreenCanvasRenderingContext2D;

  canvaswidth: number;
  canvasheight: number;

  camera: Camera;

  player: Player;

  level: Level;

  directions: { up: boolean, down: boolean, left: boolean, right: boolean } = {up: false, down: false, left: false, right: false };

  dragstart: Vector2 | undefined;
  dragend: Vector2 | undefined;

  drawing: boolean = false;
  playing: boolean = false;

  mode: 'spike' | 'platform' | 'bouncepad' | 'delete' = 'platform';

  constructor (canvas: HTMLCanvasElement) {
    this.canvas = canvas;

    this.canvaswidth = EDITORWIDTH;
    this.canvasheight = EDITORHEIGHT;

    this.canvas.width = this.canvaswidth;
    this.canvas.height = this.canvasheight;

    const ctx = canvas.getContext('2d');

    if (!ctx) throw Error('Could not get canvas context');
    this.ctx = ctx;

    this.buffercanv = new OffscreenCanvas(this.canvaswidth, this.canvasheight);
    const bctx = this.buffercanv.getContext('2d');
    if (!bctx) throw Error('Could not get buffer canvas context');
    this.bufferctx = bctx;

    const level = this.loadFromLocalStorage();
    this.level = level || new Level(-1,'EDITING LEVEL', [], { x: 0, y: 0 }, [], [], new Coffee({ x: 20, y: 0 }, -1), 0.175, []);

    this.camera = new Camera({ ...this.level.startPos }, this.canvaswidth, this.canvasheight);
    this.player = new Player('Editing', this.level.startPos);

    this.keybinds();
    this.mainloop();
  }

  updateLocalStorage() {
    localStorage.setItem('level', JSON.stringify(this.level.toJSON()));
  }

  loadFromLocalStorage() {
    const levelJSON = localStorage.getItem('level');
    if (!levelJSON) return;
    return Level.fromJSON(-1, JSON.parse(levelJSON));
  }

  deleteFromLevel () {
    const midhitbox = new HitBox(this.camera.center, 1, 1);

    for (let bouncepad of this.level.bouncepads) {
      if (bouncepad.hitbox.overlaps(midhitbox)) {
        const index = this.level.bouncepads.indexOf(bouncepad);

        if (index == -1) continue;

        this.level.bouncepads.splice(index, 1);

        return;
      }
    }

    for (let platform of this.level.platforms) {
      if (platform.overlaps(midhitbox)) {
        const platformindex = this.level.platforms.indexOf(platform);

        if (platformindex == -1) continue;

        this.level.platforms.splice(platformindex, 1);

        return;
      }
    }

    for (let spike of this.level.spikes) {
      if (spike.hitbox.overlaps(midhitbox)) {
        const index = this.level.spikes.indexOf(spike);

        if (index == -1) continue;

        this.level.spikes.splice(index, 1);

        return;
      }
    }
  }

  keybinds () {
    document.addEventListener('keydown', (ev) => {
      switch(ev.key) {
        case ' ':
        case 'ArrowUp': this.directions.up = true; break;
        case 'ArrowDown': this.directions.down = true; break;
        case 'ArrowLeft': this.directions.left = true; break;
        case 'ArrowRight': this.directions.right = true; break;
        case 'p': this.mode = 'platform'; break;
        case 's': this.mode = 'spike'; break;
        case 'b': this.mode = 'bouncepad'; break;
        case 'd': this.mode = 'delete'; break;
        case 'Enter':
          if (this.playing) break;
          switch (this.mode) {
            case 'delete': this.deleteFromLevel(); break;
            case 'bouncepad': 
              this.level.bouncepads.push(
                new BouncePad({
                  x: Math.floor(this.camera.center.x / 8) * 8,
                  y: Math.floor(this.camera.center.y / 8) * 8 
                })
              );
              break;
            case 'platform':
            case 'spike':
              if (this.drawing) {
    
                if (!this.dragstart || !this.dragend) break;
                
                const startx = Math.min(this.dragstart.x, this.dragend.x);
                const starty = Math.min(this.dragstart.y, this.dragend.y);
                const endx = Math.max(this.dragstart.x, this.dragend.x);
                const endy = Math.max(this.dragstart.y, this.dragend.y);
    
                const width = Math.round((endx - startx) / 8) * 8;
                const height = Math.round((endy - starty) / 8) * 8;

                if (this.mode == 'platform')
                  this.level.platforms.push(new Platform({x: startx, y: starty}, width, height));
                if (this.mode == 'spike')
                  this.level.spikes.push(new Spikes({x: startx, y: starty - 4}, width));
              
                this.updateLocalStorage();
              }
              else {
                
                this.dragstart = { x: Math.round(this.camera.center.x / 8) * 8, y: Math.round(this.camera.center.y / 8) * 8 };
              }
    
              this.drawing = !this.drawing;
              break;
          }
          break;
        case 'Escape':
          this.drawing = false;
          break;
        case 'j':
          navigator.clipboard.writeText(JSON.stringify(this.level.toJSON()));
          break;
        case 'c':
          if (this.playing) break;
          this.level.coffee.pos = {
            x: Math.floor(this.camera.center.x / 8) * 8,
            y: Math.floor(this.camera.center.y / 8) * 8,
          }
          break;
        case 'q':
          this.playing = !this.playing;
          break;
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

  mainloop () {
    setInterval(() => {
      this.tick();

      this.render();
    }, 1000 / 60);
  }

  tick () {
    if (this.playing) {
      this.level.updateVisiblePlatforms(this.camera);
      this.level.deathY = this.level.platforms.sort((a, b) => b.corners.ll.y - a.corners.ll.y)[0].corners.ll.y;
      this.player.tick(this.directions, this.level, this.camera);

      if (this.player.dead) {
        this.player = new Player('Editing', this.level.startPos);
      }
    } else {
      if (this.drawing) {
        this.dragend = {
          x: Math.round(this.camera.center.x / 8) * 8,
          y: Math.round(this.camera.center.y / 8) * 8
        };
      }
  
      if (this.directions.left) this.camera.center.x --;
      if (this.directions.right) this.camera.center.x ++;
      if (this.directions.up) this.camera.center.y --;
      if (this.directions.down) this.camera.center.y ++;
    }
  }

  render () {
    this.bufferctx.clearRect(0,0,this.canvaswidth, this.canvasheight);

    for (let spike of this.level.spikes) {
      spike.render(this.bufferctx, this.camera);
    }

    for (let platform of this.level.platforms) {
      platform.render(this.bufferctx, this.camera);
    }

    for (let bouncepad of this.level.bouncepads) {
      bouncepad.render(this.bufferctx, this.camera);
    }

    for (let infoplaque of this.level.plaques) {
      infoplaque.render(this.bufferctx, this.camera);
    }
    
    this.level.coffee.render(this.bufferctx, this.camera);

    this.player.render(this.bufferctx, this.camera);

    if (!this.playing) {
  
      if (this.drawing && this.dragstart) { // Dragstart included for safe typing
  
        const startx = Math.min(this.dragstart.x, Math.round(this.camera.center.x / 8) * 8);
        const starty = Math.min(this.dragstart.y, Math.round(this.camera.center.y / 8) * 8);
        const endx = Math.max(this.dragstart.x, Math.round(this.camera.center.x / 8) * 8);
        const endy = Math.max(this.dragstart.y, Math.round(this.camera.center.y / 8) * 8);
  
        (
          this.mode == 'platform'
          ? new Platform(
            {
              x: startx,
              y: starty
            },
            endx - startx,
            endy - starty
          )
          : new Spikes(
            {
              x: startx,
              y: starty - 4
            },
            endx - startx
          )
        )
        .render(
          this.bufferctx,
          this.camera
        );
      }

      this.bufferctx.fillStyle = '#4c566a';
      this.bufferctx.fillRect(EDITORWIDTH / 2 - 1, EDITORHEIGHT / 2 - 1, 2, 2);
    }

    this.bufferctx.fillStyle = '#4c566a';
    this.bufferctx.fillRect(1,1,12,12);

    this.bufferctx.drawImage(
      this.mode == 'platform' ? platformimg
      : this.mode == 'bouncepad' ?bouncepadimgs[0]
      : this.mode == 'spike' ? spikesimg : trash,
      3,
      3
    );

    // Switch buffers
    this.ctx.putImageData(this.bufferctx.getImageData(0, 0, this.canvaswidth, this.canvasheight), 0, 0);
  }
}