<script lang="ts">
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";
  import Loginform from "$lib/components/loginform.svelte";

  let errorMessage = '';

  const redirectURL = $page.url.searchParams.get('redirect');

  function submit (username: string, email:string, password:string) {
    fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        username
      })
    }).then(resp => {
      if (resp.ok) {
        if (redirectURL) {
          goto('/login/2fa?redirect='+redirectURL);
        }
        else goto('/login/2fa');
      }
    });
  }
</script>

<main>
  <Loginform submit={submit} title="Log in" errorMessage={errorMessage} />
</main>

<style>
  main {
    display: flex;
    align-items: center;
    justify-content: center;
  }
</style>