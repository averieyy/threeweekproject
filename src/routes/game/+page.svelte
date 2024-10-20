<script lang="ts">

  function canvasload(ev: Event) {
    const canv = ev.currentTarget as HTMLCanvasElement;
  }

</script>

<canvas on:load={canvasload}></canvas>