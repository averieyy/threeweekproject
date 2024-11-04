<script lang="ts">
  import { Game } from "$lib/snake/game";
    import { onDestroy, onMount } from "svelte";


let canvas: HTMLCanvasElement;

let game: Game;

onMount(() => {
  game = new Game(canvas);

  game.mainloop();
});

onDestroy(() => {
  game.stop();
});

</script>

<svelte:head>
  <title>Snake</title>
</svelte:head>

<canvas bind:this={canvas}></canvas>

<style>
  canvas {
    max-width: 100%;
    image-rendering: pixelated;
    object-fit: contain;
    border: none;
  }
</style>