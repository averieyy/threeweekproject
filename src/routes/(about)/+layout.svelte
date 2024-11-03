<script lang="ts">
  import Header from '$lib/components/header.svelte';
  import type { Snippet } from 'svelte';
  import type { LayoutData } from './$types';

  const { data, children }: { data : LayoutData, children: Snippet } = $props();
</script>

<Header user={data.user} />
{@render children()}