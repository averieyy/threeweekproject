<script lang="ts">
  import { page } from "$app/stores";

  const redirectUrl : string = $page.url.searchParams.get('redirect') || '/login';

  let code: string;
  let errorMessage: string;

  const disallowedChars = /^[0-9]/;

  function authenticate() {
    if (code.length != 6) {
      errorMessage = '';
      return;
    }
    if (code.match(disallowedChars)) {
      
      return;
    }
  }
</script>

<main>
  <h1>Enter code from your authenticator app</h1>
  {#if errorMessage}
    <span>{errorMessage}</span>
  {/if}
  <input bind:value={code} maxlength="6">
  <button on:click={authenticate}>Authenticate</button>
</main>

<style>
  main {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap: .5rem;
  }

  h1 {
    font-size: 1.25rem;
    font-weight: 400;
  }

  input {
    padding: 1rem;
    background-color: var(--bg2);
    border: none;
    color: var(--fg1);
    text-align: center;

    font-family: var(--monospace);
    font-size: large;
    width: 4em;
  }
  button {
    padding: .5rem;
    border: 2px solid var(--bg2);
    background-color: var(--bg2);
    color: var(--fg1);

    &:hover {
      background-color: var(--bg1);
    }
  }
</style>