<script lang="ts">
	import EventsTable from '$lib/pages/userevents/user-event-table.svelte';
	import SingleEventTable from '$lib/pages/userevents/view-user-event.svelte';
	import { manageUserEventStore } from '$lib/pages/userevents/user-events-store';
</script>

<svelte:head>
	<title>Dashboard | User Events</title>
	<meta name="description" content="dashboard for aprisio." />
</svelte:head>

{#if !$manageUserEventStore.userEventSelected}
	<EventsTable />
{:else}
	<SingleEventTable />
{/if}
