import Running from '$lib/assets/parkour/running.png';
import Crouching from '$lib/assets/parkour/crouching.png';

function loadImages(path: string, width: number, height: number): ImageData[] {
  const image = new Image();
  image.src = path;

  let returned : ImageData[] = [];

  image.onload = () => {
    const canv = new OffscreenCanvas(image.width, image.height);
    const ctx = canv.getContext('2d');
    if (!ctx) return;
    ctx?.drawImage(image, 0, 0);

    for (let x = 0; x < image.width; x += width) {

      for (let y = 0; y < image.height; y += height) {
        returned.push(ctx?.getImageData(x,y,width,height));
      }
    }
  }

  return returned;
}

export const running = loadImages(Running, 10, 16);
export const crouching = loadImages(Crouching, 10, 12);