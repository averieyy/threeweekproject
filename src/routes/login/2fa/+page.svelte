<script lang="ts">
  import { page } from "$app/stores";
    import Twofa from "$lib/components/twofa.svelte";

  const redirectUrl : string = $page.url.searchParams.get('redirect') || '/login';
</script>

<main>
  <Twofa />
</main>

<style>
  main {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: .5rem;
  }
</style>