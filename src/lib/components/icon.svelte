<script lang="ts">
  let { icon }: { icon: string } = $props();
</script>

<span class="material-symbols-outlined">{icon}</span>

<style>
  span {
    aspect-ratio: 1 / 1;
    margin: 0;
  }
</style>