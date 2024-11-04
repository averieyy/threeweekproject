<script lang="ts">
  import { goto } from "$app/navigation";
  import Icon from "$lib/components/icon.svelte";
  import type { PageData } from "./$types";

  const { data }: { data: PageData } = $props();

  let errorMessage : string = $state('');
  
  const logOut = async () => {
    const resp = await fetch('/api/logout', {
      method: 'POST'
    });

    if (resp.ok) goto('/');
    else {
      const obj = await resp.json();

      errorMessage = obj['message'] || 'An error occured while trying to log out.';
    }
  }
</script>

<svelte:head>
  <title>User</title>
</svelte:head>

<main>
  <h2>Welcome, {data.user.username}</h2>
  {#if errorMessage}
    <span class="error">{errorMessage}</span>
  {/if}
  <button onclick={logOut}><Icon icon='logout'/>Log out</button>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    gap: .5rem;
    padding: .5rem;
  }

  button {
    padding: .5rem;
    border: none;
    border-radius: .25rem;
    background-color: var(--emphasis);
    color: var(--bg1);

    display: flex;
    flex-direction: row;
    align-items: center;
    gap: .5rem;

    font-weight: bold;

    &:active, &:hover {
      background-color: var(--emphasis-dark);
    }

    width: fit-content;
  }
  h2 {
    margin: 0;
    margin-top: 1rem;
    margin-bottom: 1rem;
    padding: .125rem;
    width: fit-content;

    border-bottom: .125rem solid var(--emphasis);
  }
  .error {
    background-color: var(--bg2);
    padding: .5rem;
    border-radius: .25rem;
    
    font-style: italic;
  }
</style>