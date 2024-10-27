<script>
    import Icon from "$lib/components/icon.svelte";

</script>

<a href="/"><Icon icon='arrow_back'/> Go back</a>
<slot />

<style>
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
</style>