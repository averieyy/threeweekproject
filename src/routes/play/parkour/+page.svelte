<script lang="ts">
  import { Game } from "$lib/parkour/game";
  import { onDestroy, onMount } from "svelte";

  let canvas: HTMLCanvasElement;

  let game: Game;

  onMount(() => {
    game = new Game(canvas);
    
    game.render();
  });

  onDestroy(() => {
    game.stop();
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