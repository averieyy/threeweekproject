<script lang="ts">
  import { Game } from "$lib/parkour/game";
  import { onMount } from "svelte";

  let canvas: HTMLCanvasElement;

  onMount(() => {
    const game = new Game(canvas);
    
    game.render();
  });

</script>

<svelte:head>
  <title>Parkour</title>
</svelte:head>

<canvas bind:this={canvas}></canvas>

<style>
  canvas {
    max-width: 100%;
    image-rendering: pixelated;

    object-fit: contain;
  }
</style>