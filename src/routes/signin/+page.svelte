<script lang="ts">
    import { goto } from "$app/navigation";
  import Loginform from "$lib/components/loginform.svelte";

  let errorMessage = '';

  function signin (username: string, email: string, password: string) {
    fetch ('/api/signin', {method: 'POST',
      body: JSON.stringify({
        username,
        email,
        password
      })}
    ).then(async resp => {
      if (!resp.ok) {
        if (resp.status == 400) {
          errorMessage = (await resp.json()).message || 'An error occured while trying to sign in.';
        }
        else errorMessage = 'An error occured while trying to sign in';
      }
      else {
        goto('/verify2fa');
      }
    });
  }
</script>

<main>
  <Loginform submit={signin} title="Sign in" errorMessage={errorMessage} />
</main>

<style>
  main {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>