<script lang="ts">
  import { page } from "$app/stores";

  const games = $page.data.games;
</script>

<svelte:head>
  <title>Games</title>
</svelte:head>

<main>
  <div class="maincolumn">
    <div class="gameparent">
      <div class="games">
        {#each games as game}
          <a href={`/games/${game.id}`} class="gametile">
            <span>{game.name}</span>
          </a>
        {/each}
      </div>
    </div>
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
  }
  .maincolumn {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
  }
  .gameparent {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  .games {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: .5rem;
    max-width: 500px;
    flex: 1;
  }
  .gametile {
    background-color: var(--bg2);

    padding: .5rem;
    aspect-ratio: 4 / 3;

    display: flex;
    flex-direction: column;

    align-items: center;
    justify-content: center;

    text-decoration: none;

    color: var(--fg1);

    & span {
      text-align: center;
      font-size: 120%;
      font-weight: bold;
    }

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