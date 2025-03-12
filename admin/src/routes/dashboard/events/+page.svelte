<script lang="ts">
	import { goto } from '$app/navigation';
	import * as Tabs from '$lib/components/ui/tabs';
	import CreateEvents from '$lib/pages/events/create-events.svelte';
	import { eventsStore } from '$lib/pages/events/events-store';
	import EventsTable from '$lib/pages/events/events-table.svelte';
	import { topicsStore } from '$lib/pages/topics/topics-store';
	import Icon from '@iconify/svelte';
</script>

<svelte:head>
	<title>Dashboard | Events</title>
	<meta name="description" content="dashboard for aprisio." />
</svelte:head>

<Tabs.Root
	value={$topicsStore.mode}
	class="w-full p-4"
	onValueChange={(value) => {
		goto(`/admin/dashboard/events?mode=${value}`);
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
			description: ''
		};
	}}
>
	<Tabs.List>
		<Tabs.Trigger value="list" class="flex items-center">
			<Icon class="h-4 w-4" icon="tabler:table" />
			<span class="ml-2">Events List</span>
		</Tabs.Trigger>
		<Tabs.Trigger value="create">
			<Icon class="h-4 w-4" icon="mi:user-add" />
			<span class="ml-2"> Create Events</span>
		</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="list">
		<EventsTable />
	</Tabs.Content>
	<Tabs.Content value="create">
		<CreateEvents />
	</Tabs.Content>
</Tabs.Root>
