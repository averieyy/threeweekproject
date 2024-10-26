<script>
    import Icon from "$lib/components/icon.svelte";

</script>

<a href="/"><Icon icon='arrow_back'/> Go back</a>
<slot />

<style>
  a {
    position: absolute;
    left: .5rem;
    top: .5rem;
    color: var(--fg1);
    text-decoration: none;
    font-weight: bold;
    background-color: var(--bg2);
    display: flex;
    flex-direction: row;
    gap: .5rem;
    padding: .5rem;
  }
</style>