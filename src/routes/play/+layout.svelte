<script>
    import Icon from "$lib/components/icon.svelte";

</script>

<div class="everything">
  <a href="/"><Icon icon='arrow_back'/> Go back</a>
  <main>
    <slot />
  </main>
</div>

<style>
  .everything {
    display: flex;
    flex-direction: column;

    width: 100%;
    height: 100%;
  }
  a {
    color: var(--fg1);
    text-decoration: none;
    font-weight: bold;
    background-color: var(--bg2);
    display: flex;
    flex-direction: row;
    width: fit-content;
    margin: .25rem;
    gap: .5rem;
    padding: .5rem;
  }
  main {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
</style>