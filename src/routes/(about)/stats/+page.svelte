<script lang="ts">
  import { page } from "$app/stores";
  import Icon from "$lib/components/icon.svelte";
    import { toTimeString } from "$lib/time";

  const svgContent = $page.data.svgContent;
  const games: {id: number, name: string, colour: string, speedrunning: boolean}[] = $page.data.games;
  const leaderboard : {[key: number] : {gameid: number, points: number, user: string}[]} = $page.data.leaderboards;
</script>

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
            <div class="gamesection">
              <div class="toggleopen">
                <input type="checkbox" id={game.id.toString()}><label for={game.id.toString()}><div class="icon"><Icon icon='chevron_right'/></div>{game.name}</label>
              </div>
              <div class="leaderboard">
                {#if leaderboard[game.id] && leaderboard[game.id].length != 0}
                  <div class="innerleaderboard">
                    <div class="entryheader">
                      <span>Player</span>
                      <span>{game.speedrunning ? "Time" : "Points"}</span>
                    </div>
                    {#each leaderboard[game.id] as entry}
                      <div class="leaderboardentry">
                        <span>
                          {entry.user}
                        </span>
                        <span>
                          {game.speedrunning ? toTimeString(entry.points) : entry.points}
                        </span>
                      </div>
                    {/each}
                  </div>
                {:else}
                  <span>No leaderboard entries</span>
                {/if}
              </div>
            </div>
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