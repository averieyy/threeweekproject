<script lang="ts">
  import { page } from "$app/stores";
  import Icon from "$lib/components/icon.svelte";
    import Leaderboard from "$lib/components/leaderboard.svelte";
    import { toTimeString } from "$lib/time";

  const svgContent = $page.data.svgContent;
  const games: {id: number, name: string, colour: string, speedrunning: boolean}[] = $page.data.games;
  const leaderboard : {[key: number] : {gameid: number, points: number, user: string}[]} = $page.data.leaderboards;
</script>

<svelte:head>
  <title>Statistics</title>
</svelte:head>

<main>
  <div class="outerarticle">
    <div class="article">
      <div class="graph">
        <div class="games">
          {#each games as game}
            <span style:border-color={game.colour} class="game">
              {game.name}
            </span>
          {/each}
        </div>
        <figure>
          {@html svgContent}
        </figure>
      </div>
      <section>
        <h2>Leaderboards</h2>
        <div class="leaderboards">
          {#each games.sort((a,b) => a.id - b.id) as game}
            <Leaderboard game={game} entries={leaderboard[game.id]} />
          {/each}
        </div>
      </section>
    </div>
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    padding: .75rem;
  }
  .outerarticle {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  .article {
    display: flex;
    flex-direction: column;
    max-width: 500px;
    width: 100%;
    gap: .75rem;
  }
  .graph {
    display: flex;
    flex-direction: row;
    background-color: var(--bg2);
    border-radius: 1rem;
    padding: 1rem;
    gap: .5rem;
    max-width: 500px;
  }
  .games {
    display: flex;
    flex-direction: column;
    gap: .5rem;
    flex: 1;
  }
  .game {
    transition: border-left .25s ease;
    border-left: .125rem solid;
    padding-left: .25rem;
    cursor: default;

    &:hover {
      border-left: .5rem solid;
    }
  }
  .leaderboards {
    display: flex;
    flex-direction: column;
    gap: .75rem;
  }
  figure {
    aspect-ratio: 1 / 1;
    margin: 0;
    border-radius: 1rem;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    background-color: var(--bg1);
  }

  section {
    display: flex;
    flex-direction: column;
    gap: .5rem;
  }

  section h2 {
    margin: 0;
    border-bottom: .2rem solid var(--emphasis);
  }
</style>