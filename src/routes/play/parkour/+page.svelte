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

<canvas bind:this={canvas} />

<style>

  canvas {
    image-rendering: pixelated;

    height: 100%;
    width: 100%;

    object-fit: contain;
  }
</style>