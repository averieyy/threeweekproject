<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Loginform from "$lib/components/loginform.svelte";

  let errorMessage = $state('');

  const redirectURL = $page.url.searchParams.get('redirect');

  function signin (username: string, email: string, password: string) {
    fetch ('/api/signup', {method: 'POST',
      body: JSON.stringify({
        username,
        email,
        password
      })}
    ).then(async resp => {
      if (resp.ok) {
        if (redirectURL) {
          goto('/verify2fa?redirect='+redirectURL);
        }
        else goto('/verify2fa');
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
  <title>Sign up</title>
</svelte:head>

<main>
  <Loginform submit={signin} title="Sign up" errorMessage={errorMessage} />
  <a href={`/login?redirect=${redirectURL || ''}`}>Already have an account? Log in</a>
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