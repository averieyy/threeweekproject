<script lang="ts">
  import { Game } from "$lib/parkour/game";
  import { onDestroy, onMount } from "svelte";

  let canvas: HTMLCanvasElement;

  let game: Game;

  onMount(() => {
    // Record this play to the database
    fetch('/api/play', { method: 'POST', body: '{"gameid": 0}' });

    game = new Game(canvas, (points) => {
      // Update leaderboards
      fetch('/api/leaderboard', { method: 'POST', body: JSON.stringify({ gameid: 0, points: points }) })
    });

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