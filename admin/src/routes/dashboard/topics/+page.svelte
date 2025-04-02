<script lang="ts">
	import { goto } from '$app/navigation';
	import * as Tabs from '$lib/components/ui/tabs';
	import CreateTopics from '$lib/pages/topics/create-topics.svelte';
	import { topicsStore } from '$lib/pages/topics/topics-store';
	import TopicsTable from '$lib/pages/topics/topics-table.svelte';
	import Icon from '@iconify/svelte';
</script>

<svelte:head>
	<title>Dashboard | Community</title>
	<meta name="description" content="dashboard for aprisio." />
</svelte:head>

<Tabs.Root
	value={$topicsStore.mode}
	class="w-full p-4"
	onValueChange={(value) => {
		goto(`/admin/dashboard/topics?mode=${value}`);
		$topicsStore = {
			mode: value,
			id: '',
			topicName: ''
		};
	}}
>
	<Tabs.List>
		<Tabs.Trigger value="list" class="flex items-center">
			<Icon class="h-4 w-4" icon="tabler:table" />
			<span class="ml-2">Community List</span>
		</Tabs.Trigger>
		<Tabs.Trigger value="create">
			<Icon class="h-4 w-4" icon="mi:user-add" />
			<span class="ml-2"> Create Community</span>
		</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="list">
		<TopicsTable />
	</Tabs.Content>
	<Tabs.Content value="create">
		<CreateTopics />
	</Tabs.Content>
</Tabs.Root>
