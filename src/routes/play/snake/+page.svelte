<script lang="ts">
  import { Game } from "$lib/snake/game";
    import { onMount } from "svelte";


let canvas: HTMLCanvasElement;

onMount(() => {
  let game = new Game(canvas);

  game.mainloop();
});

</script>

<main>
  <canvas bind:this={canvas} />
</main>

<style>
  main {
    display: flex;
  }
  canvas {
    width: 100%;
    height: 100%;
    image-rendering: pixelated;
    object-fit: contain;
    border: none;
  }
</style>