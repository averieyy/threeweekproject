<script lang="ts">

let { submit, title, errorMessage }: {
  submit: (username: string, email:string, password:string) => void,
  title: string,
  errorMessage: string | undefined,
} = $props();

const onsubmit = () => {
  submit(username, email, password);
}

let username : string = $state('');
let email : string = $state('');
let password : string = $state('');

</script>

<form onsubmit={onsubmit}>
  <h2>{title}</h2>
  {#if errorMessage}
    <span>{errorMessage}</span>
  {/if}
  <input bind:value={username} type="text" placeholder="Username">
  <input bind:value={email} type="email" placeholder="Email">
  <input bind:value={password} type="password" placeholder="Password">
  <input type="submit" value={title}>
</form>

<style>
  h2 {
    margin-top: .5rem;
    margin-bottom: .5rem;
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