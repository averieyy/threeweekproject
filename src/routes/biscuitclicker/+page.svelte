<script lang="ts">
    import { onMount } from "svelte";

  let points = 0;
  let displayPoints : string;
  let pps = 0;

  let timing = 1000/60;

  interface upgrade {
    name: string,
    cps: number,
    bonus: number,
    count: number,
    price: number,
  }
  
  let upgrades: upgrade[] = [
    {name: 'Click me!', cps: 0, bonus: 1, count: 0, price: 0},
    {name: 'Autoclicker', cps: .5, bonus: 0, count: 0, price: 10},
    {name: 'Autoclicker 2', cps: 1, bonus: 0, count: 0, price: 100},
    {name: 'Autoclicker 3', cps: 10, bonus: 0, count: 0, price: 1000},
    {name: 'Autoclicker 4', cps: 100, bonus: 0, count: 0, price: 10000},
    {name: 'Autoclicker 5', cps: 1000, bonus: 0, count: 0, price: 100000},
  ];

  function buy(upgrade: upgrade) {
    const u = upgrades.find((u) => u == upgrade);
    if (!u) return;
    if (points < u.price) return;

    points -= u.price;
    u.count ++;
    
    u.price *= 1.15;

    upgrades = upgrades;
    pps += upgrade.cps;
    points += upgrade.bonus;
  }

  onMount(() => {
    setInterval(() => {
      points += (pps / 60);
    }, timing);
  });

  $: {
    displayPoints = points.toFixed(1).toString();
  }
</script>

<h2>Neoclicker</h2>

<span>{displayPoints} {pps}</span>

<div class="upgrades">
  {#each upgrades as upgrade}
    <button on:click={() => buy(upgrade)} class={`${points >= upgrade.price ? 'available' : 'unavailable'}`}>{upgrade.name} [{upgrade.count}]</button>
  {/each}
</div>


<style>
  .upgrades {
    display: flex;
    flex-direction: column;
    padding: 3px;
    gap: 3px;
  }
  button {
    height: 2rem;
    border: none;
    background-color: var(--bg2);
    color: var(--fg1);

    &.unavailable {
      background-color: var(--bg1);
      color: var(--fg3);
      font-style: italic;
    }
  }
</style>