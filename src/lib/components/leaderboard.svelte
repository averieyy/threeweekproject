<script lang="ts">
    import { toTimeString } from "$lib/time";
    import Icon from "./icon.svelte";

  const { entries, game } : { entries: {user: string, points: number }[], game: {speedrunning: boolean, id: number, name: string} } = $props();
</script>

<div class="gamesection">
  <div class="toggleopen">
    <input type="checkbox" id={game.id.toString()}><label for={game.id.toString()}><div class="icon"><Icon icon='chevron_right'/></div>{game.name}</label>
  </div>
  <div class="leaderboard">
    {#if entries && entries.length != 0}
      <div class="innerleaderboard">
        <div class="entryheader">
          <span>Player</span>
          <span>{game.speedrunning ? "Time" : "Points"}</span>
        </div>
        {#each (entries.sort((a, b) => (a.points - b.points) * (game.speedrunning ? 1 : -1))) as entry}
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

<style>

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
</style>