<script lang="ts">
  import { page } from "$app/stores";
  import Icon from "$lib/components/icon.svelte";

  const svgContent = $page.data.svgContent;
  const games = $page.data.games;
  const leaderboard : {gameid: number, points: number, user: string}[] = $page.data.leaderboard
    .sort((l1: {points: number}, l2: {points: number}) => l2.points - l1.points)
    .slice(0,50);
</script>

<main>
  <div class="outergraph">
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
  </div>
  <div class="leaderboards">
    {#each games as game}
      <div class="gamesection">
        <div class="toggleopen">
          <input type="checkbox" id={game.id}><label for={game.id}><div class="icon"><Icon icon='chevron_right'/></div>{game.name}</label>
        </div>
        <div class="leaderboard">
          <div class="innerleaderboard">
            <div class="entryheader">
              <span>Player</span>
              <span>Points</span>
            </div>
            {#each leaderboard.filter(l => l.gameid == game.id) as entry}
              <div class="leaderboardentry">
                <span>
                  {entry.user}
                </span>
                <span>
                  {entry.points}
                </span>
              </div>
            {/each}
          </div>
        </div>
      </div>
    {/each}
  </div>
</main>

<style>
  main {
    display: flex;
    flex-direction: column;
    padding: .75rem;
    gap: .75rem;
  }
  .outergraph {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  .graph {
    width: 100%;
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
  .leaderboard {
    display: none;
    padding: .75rem;
    background-color: var(--bg3);
    border-radius: .5rem;
  }
  .innerleaderboard {
    flex: 1;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: .375rem;
    border-radius: .25rem;
    background-color: var(--bg2);
  }
  .entryheader, .leaderboardentry {
    padding: .75rem;
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    background-color: var(--bg3);
  }
  .entryheader {
    font-weight: bold;
    background-color: var(--bg2);
  }
  .gamesection {
    background-color: var(--bg2);
    border-radius: .5rem;
    
    & .icon {
      display: flex;

      user-select: none;

      aspect-ratio: 1 / 1;
    }

    &:has(:checked) {
      & .icon {
        rotate: 90deg;
      }

      & .leaderboard {
        display: flex;
      }
    }
  }
  .toggleopen {
    & input[type="checkbox"] {
      display: none;
      margin: 0;
      padding: 0;
      appearance: none;
    }
    & label {
      display: flex;
      padding: 1rem;
      align-items: center;
      gap: .5rem;
    }
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
</style>