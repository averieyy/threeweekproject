<script>
  import { page } from '$app/stores';
  import Header from '$lib/components/header.svelte';

  let user = $page.data.user;
</script>

<Header user={user} />
<slot/>