import type { Camera } from "./camera";

export interface Renderable {
  render: (ctx: OffscreenCanvasRenderingContext2D, camera: Camera) => void;
}