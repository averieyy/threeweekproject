<script lang="ts">
  let email: string;
  let password: string;
  let username: string;

  function submit () {
    fetch('/api/login', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
        username
      })
    }).then(resp => {
      
    });
  }
</script>

<main>
  <form on:submit={submit}>
    <h2>Log in</h2>
    <input bind:value={username} type="text" placeholder="Username">
    <input bind:value={email} type="email" placeholder="Email">
    <input bind:value={password} type="password" placeholder="Password">
    <input type="submit" value="Log in">
  </form>
</main>

<style>
  main {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  form {
    display: flex;
    flex-direction: column;
    background-color: var(--bg2);
    gap: .5rem;
    padding: .5rem;
  }

  input {
    background-color: var(--bg3);
    color: var(--fg1);
    border: none;
    padding: .5rem;
  }
</style>