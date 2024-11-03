<script lang="ts">
  import { page } from "$app/stores";
  import Icon from "$lib/components/icon.svelte";

  const data = $page.data;
</script>

<svelte:head>
  <title>{data.name}</title>
</svelte:head>

<main>
  <div class="name">
    <h2>{data.name}</h2>
    {#if data.loggedin}
      <a href={data.url} class="playbtn" title="Play"><Icon icon="play_arrow" /></a>
    {:else}
      <a href={"/login?redirect=" + data.url} class="playbtn">Log in to play!</a>
    {/if}
  </div>
  <div class="leaderboard">
    <div class="header">
      <span>Username</span>
      <span>Points</span>
    </div>
    {#each data.leaderboard as leaderboardentry}
      <div class="leaderboardentry">
        <span>{leaderboardentry.user.username}</span>
        <span>{leaderboardentry.points}</span>
      </div>
    {/each}
  </div>
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

    &:hover {
      background-color: var(--emphasis);
      color: var(--bg1);
    }

    &:active {
      background-color: var(--emphasis-dark);
      color: var(--bg1);
    }
  }
  .leaderboard {
    display: flex;
    flex-direction: column;
  }
  .leaderboardentry {
    &:nth-child(odd) {
      background-color: var(--bg2);
    }
    &:nth-child(even) {
      background-color: var(--bg1);
    }

    padding: 1rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .header {
    padding: 1rem;

    background-color: var(--bg1);

    display: flex;
    flex-direction: row;
    justify-content: space-between;

    border-bottom: .125rem solid var(--fg1);
  
    font-weight: bold;
  }
</style>