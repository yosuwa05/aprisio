<script lang="ts">
	import { goto } from '$app/navigation';
	import * as Tabs from '$lib/components/ui/tabs';
	import CreateEvents from '$lib/pages/events/create-events.svelte';
	import { eventsStore, manageLayoutStore } from '$lib/pages/events/events-store';
	import EventsTable from '$lib/pages/events/events-table.svelte';
	import SingleEventTable from '$lib/pages/events/single-event-table.svelte';
	import Icon from '@iconify/svelte';
</script>

<svelte:head>
	<title>Dashboard | Admin Events</title>
	<meta name="description" content="dashboard for aprisio." />
</svelte:head>

{#if !$manageLayoutStore.singleEventSelected}
	<Tabs.Root
		value={$eventsStore.mode}
		class="w-full p-4"
		onValueChange={(value) => {
			goto(`/admin/dashboard/adminevents?mode=${value}`);
			$eventsStore = {
				mode: value,
				id: '',
				eventName: '',
				datetime: '',
				location: '',
				eventRules: [],
				price: '',
				eventType: '',
				availableTickets: '',
				mapLink: '',
				expirydatetime: '',
				organiserName: '',
				biography: '',
				description: '',
				delta: '',
				eventImage: '',
				gst: ''
			};
		}}
	>
		<Tabs.List>
			<Tabs.Trigger value="list" class="flex items-center">
				<Icon class="h-4 w-4" icon="tabler:table" />
				<span class="ml-2">Admin Events</span>
			</Tabs.Trigger>
			<Tabs.Trigger value="create">
				<Icon class="h-4 w-4" icon="gridicons:create" />
				<span class="ml-2">
					{$eventsStore.mode == 'create' && $eventsStore.id ? 'Edit' : 'Create'} Event</span
				>
			</Tabs.Trigger>
		</Tabs.List>
		<Tabs.Content value="list">
			<EventsTable />
		</Tabs.Content>
		<Tabs.Content value="create">
			<CreateEvents />
		</Tabs.Content>
	</Tabs.Root>
{:else}
	<SingleEventTable />
{/if}
