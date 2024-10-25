<script lang="ts">

export let submit: (username: string, email:string, password:string) => void;
export let title: string;
export let errorMessage: string | undefined;

const onsubmit = () => {
  submit(username, email, password);
}

let username : string;
let email : string;
let password : string;

</script>

<form on:submit={onsubmit}>
  <h2>{title}</h2>
  {#if errorMessage}
    <span>{errorMessage}</span>
  {/if}
  <input bind:value={username} type="text" placeholder="Username">
  <input bind:value={email} type="email" placeholder="Email">
  <input bind:value={password} type="password" placeholder="Password">
  <input type="submit" value="Log in">
</form>

<style>
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