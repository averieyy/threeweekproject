<script lang="ts">
  import { page } from "$app/stores";

  const games = $page.data.games;
</script>

<main>
  <div class="maincolumn">
    <h2>Games</h2>
    <div class="games">
      {#each games as game}
        <a href={`/games/${game.id}`} class="gametile">
          <span>{game.name}</span>
        </a>
      {/each}
    </div>
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .maincolumn {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    max-width: 500px;
    width: 100%;
    padding: 1rem;
  }
  h2 {
    text-align: center;
    margin: 0;
  }
  .games {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
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