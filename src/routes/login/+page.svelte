<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Loginform from "$lib/components/loginform.svelte";

  let errorMessage = $state('');

  const redirectURL = $page.url.searchParams.get('redirect');

  function submit (username: string, email:string, password:string) {
    fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        username
      })
    }).then(async resp => {
      if (resp.ok) {
        if (redirectURL) {
          goto('/login/2fa?redirect='+redirectURL);
        }
        else goto('/login/2fa');
      }
      else {
        if (resp.status == 400) {
          errorMessage = (await resp.json()).message || 'An error occured while trying to sign in.';
        }
        else errorMessage = 'An error occured while trying to sign in';
      }
    });
  }
</script>

<svelte:head>
  <title>Log in</title>
</svelte:head>

<main>
  <Loginform submit={submit} title="Log in" errorMessage={errorMessage} />
  <a href={`/signup?redirect=${redirectURL || ''}`}>Don't have an account? Sign up</a>
</main>

<style>
  main {
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: .25rem;
  }
  a {
    color: var(--fg3);
    font-size: 75%;
    font-style: italic;
  }
</style>