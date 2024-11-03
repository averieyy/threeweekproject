<script lang="ts">
  import { page } from "$app/stores";
  import Icon from "$lib/components/icon.svelte";
    import Leaderboard from "$lib/components/leaderboard.svelte";

  const data = $page.data;
</script>

<svelte:head>
  <title>{data.game.name}</title>
</svelte:head>

<main>
  <div class="name">
    <h2>{data.game.name}</h2>
    {#if data.loggedin}
      <a href={data.game.url} class="playbtn" title="Play"><Icon icon="play_arrow" /></a>
    {:else}
      <a href={"/login?redirect=" + data.game.url} class="playbtn">Log in to play!</a>
    {/if}
  </div>
  <article>
    <section id="about">
      <h3>About</h3>
      <p class="description">
        {data.game.description}
      </p>
    </section>
    <section>
      <h3>Leaderboard</h3>
      <Leaderboard game={{ ...data.game }} entries={data.leaderboard} />
    </section>
    {#if data.loggedin}
      <div class="center">
        <a href={data.game.url} class="playbtn">
          <Icon icon="play_arrow" />
          Play {data.name}
        </a>
      </div>
    {/if}
  </article>
</main>

<style>
  a {
    display: flex;
    flex-direction: row;
    align-items: center;

    gap: .5rem;

    color: var(--fg1);
    text-decoration: none;
    font-weight: bold;

    padding: .5rem;
    width: fit-content;
  }
  .name {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    gap: .5rem;
    padding: .5rem;
  }
  h2 {
    width: fit-content;
    
    margin: 0;
    
    padding: .25rem;
  }
  .playbtn {
    background-color: var(--bg2);
    border-radius: .5rem;

    user-select: none;

    &:hover {
      background-color: var(--emphasis);
      color: var(--bg1);
    }

    &:active {
      background-color: var(--emphasis-dark);
      color: var(--bg1);
    }
  }
  h3 {
    margin: 0;
    border-bottom: .125rem solid var(--emphasis);
    padding: .25rem;
    padding-right: 1rem;
    padding-left: 0;
  }
  article {
    margin: 1rem;
    display: flex;
    flex-direction: column;
    gap: .5rem;
  }
  section {
    display: flex;
    flex-direction: column;
    gap: .5rem;
  }
  p {
    margin: 0;
    padding: 1rem;
    background-color: var(--bg2);
    border-radius: .25rem;
  }
  .center {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
</style>