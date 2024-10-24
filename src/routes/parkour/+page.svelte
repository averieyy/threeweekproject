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

<main>
  <canvas bind:this={canvas} />
</main>

<style>
  main {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: row;
  }

  canvas {
    image-rendering: pixelated;

    height: 100%;
    width: 100%;

    object-fit: contain;
  }
</style>