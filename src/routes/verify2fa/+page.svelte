<script lang="ts">
  import { Authentication } from "$lib/auth/authservice";
  import Twofa from "$lib/components/twofa.svelte";
  import { Secret } from "otpauth";
  import { toDataURL } from "qrcode";
  import { onMount } from "svelte";
  import type { PageData } from "./$types";

  const { data } : { data: PageData } = $props();
  const token = data.totpsecret;

  let justshowcode: boolean = $state(false);

  const toggleShowCode = () => justshowcode = !justshowcode; 

  const uri = Authentication.generateTOTPObject(Secret.fromBase32(token), data.user).toString();
  let qrcode: string = $state('');

  onMount(async () => {
    qrcode = await toDataURL(uri);
  });
</script>

<main>
  <div class="qrcode">
    <h2>Scan this QR code with your authenticator app</h2>
    {#if justshowcode}
      <span class="token">{token}</span>
    {:else}
      <img src={qrcode} alt="A qr code that can be scanned to authenticate with an app."/>
    {/if}
    <button class="button" onclick={toggleShowCode}>{#if justshowcode}Show QR code{:else}Show raw Secret{/if}</button>
  </div>
  <Twofa verify />
</main>

<svelte:head>
  <title>Verify 2fa</title>
</svelte:head>

<style>
  main {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: .5rem;
  }
  h2 {
    width: 300px;
    text-align: center;
  }
  .qrcode {
    display: flex;
    flex-direction: column;
    gap: .5rem;
  }
  .button {
    padding: .5rem;
    border: none;
    background-color: var(--emphasis);
    color: var(--bg1);
    font-weight: bold;

    &:hover {
      background-color: var(--emphasis-dark);
    }
  }
  .token {
    padding: .5rem;
    background-color: var(--bg2);
    font-family: var(--monospace);
    text-align: center;
  }
</style>