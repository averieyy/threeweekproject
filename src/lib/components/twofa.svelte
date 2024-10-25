<script lang="ts">
    import { goto } from "$app/navigation";
    import { page } from "$app/stores";

  export let verify: boolean = false;

  const redirectURL = $page.url.searchParams.get('redirect');

  let codevalues: number[] = [0,0,0,0,0,0];

  let inputcontainer: HTMLFormElement;
  
  let errorMessage = '';

  function update(n: number, ev: Event & {currentTarget: HTMLInputElement}) {
    const value = ev.currentTarget.value;
    
    const num = parseInt(value);
    if (Number.isNaN(num)) {
      ev.preventDefault();
      return;
    }
    if (!value && n != 0)
      inputcontainer.querySelectorAll('input')[n-1].focus();
    codevalues[n] = num;
    console.log(codevalues);

    if (n < 5)
      inputcontainer.querySelectorAll('input')[n+1].focus();
  }

  function submit () {
    const code = codevalues.join('');

    fetch('/api/2fa', {
      method: 'POST',
      body: JSON.stringify({
        code
      })
    }).then(async resp => {
      if (resp.ok) {
        goto(redirectURL || '/');
      }
      else {
        errorMessage = '';
        try {
          const { message } = await resp.json();
          errorMessage = message;
        }
        catch { }
        errorMessage = errorMessage || '';
      }
    });
  }

  const items = [...Array(6).keys()];
</script>

<div class="parent">
  {#if errorMessage}
    <span class="error">{errorMessage}</span>
  {/if}
  <form class="input" bind:this={inputcontainer} on:submit={submit}>
    {#each items as i}
      <input inputmode="numeric" maxlength="1" placeholder='0' on:input={(ev) => update(i, ev)}/>
    {/each}
  </form>
  <button class="button" on:click={submit}>
    {#if verify}
      Verify
    {:else}
      Submit
    {/if}
  </button>
</div>

<style>
  .parent {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: .5rem;

    padding: .75rem;
    background-color: var(--bg3);
  }
  .input {
    display: flex;
    flex-direction: row;
    gap: .5rem;
  }
  input {
    height: 2rem;
    width: 1rem;

    font-size: 1.75rem;
    padding: .5rem;
    
    border: none;
    background-color: var(--bg2);
    color: var(--fg1);
    border-radius: .5rem;
  }
  .button {
    padding: .5rem;
    border: none;
    background-color: var(--emphasis);
    color: var(--bg1);
    font-weight: bold;

    &:hover {
      background-color: var(--emphasis-dark);
    }
  }
</style>