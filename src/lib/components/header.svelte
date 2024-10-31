<script lang="ts">
  import Icon from "./icon.svelte";

  export let user: { name: string, id: number } | null;
</script>

<header>
  <div class="links">
    <a href="/" class="button" title="Home">
      <Icon icon="home" />
    </a>
    <a href="/stats" class="button" title="Statistics">
      <Icon icon="bar_chart" />
    </a>
  </div>
  <!-- User -->
  <div class="loginoruser">
    {#if user}
      <a class="button" href="/userpage" title="User settings">
        <Icon icon="person"/>
      </a>
    {:else}
      <a class="button" href="/login">Log in</a>
      <a class="button" href="/signup">Sign up</a>
    {/if}
  </div>
</header>

<style>
  header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex-grow: 1 0;
    padding: .5rem;
    background-color: var(--bg2);
  }
  .links, .loginoruser {
    display: flex;
    flex-direction: row;
    gap: .5rem;
  }
  .button {
    background-color: var(--bg1);
    font-weight: bold;

    color: var(--fg1);
    text-decoration: none;
    padding: .5rem;
    display: flex;

    border-radius: .5rem;
    
    &:hover {
      background-color: var(--emphasis);
      color: var(--bg1);
    }
    &:active {
      background-color: var(--emphasis-dark);
      color: var(--bg1);
    }
  }
</style>