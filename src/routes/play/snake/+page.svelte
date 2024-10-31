<script lang="ts">
  import { Game } from "$lib/snake/game";
    import { onMount } from "svelte";


let canvas: HTMLCanvasElement;

onMount(() => {
  let game = new Game(canvas);

  game.mainloop();
});

</script>

<svelte:head>
  <title>Snake</title>
</svelte:head>

<canvas bind:this={canvas}></canvas>

<style>
  canvas {
    image-rendering: pixelated;
    object-fit: contain;
    border: none;
  }
</style>