<script lang="ts">
	import SingleEventTable from '$lib/pages/userevents/view-user-event.svelte';
	import { manageUserEventStore } from '$lib/pages/userevents/user-events-store';
	import UserEventTable from '$lib/pages/userevents/user-event-table.svelte';
</script>

<svelte:head>
	<title>Dashboard | User Events</title>
	<meta name="description" content="dashboard for aprisio." />
</svelte:head>

{#if !$manageUserEventStore.userEventSelected}
	<UserEventTable />
{:else}
	<SingleEventTable />
{/if}
