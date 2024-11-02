<script lang="ts">
  import { Editor } from "$lib/parkour/editor/main";
  import { onMount } from "svelte";

  let canvas: HTMLCanvasElement;

  onMount(() => {
    const editor = new Editor(canvas);
    
    editor.render();
  });

</script>

<svelte:head>
  <title>Parkour</title>
</svelte:head>

<canvas bind:this={canvas}></canvas>

<style>
  canvas {
    image-rendering: pixelated;
    max-width: 100%;

    object-fit: contain;
  }
</style>