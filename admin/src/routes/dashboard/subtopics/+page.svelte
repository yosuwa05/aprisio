<script lang="ts">
	import { goto } from '$app/navigation';
	import * as Tabs from '$lib/components/ui/tabs';
	import CreateSubtopics from '$lib/pages/subtopics/create-subtopics.svelte';
	import SubtopicsTable from '$lib/pages/subtopics/subtopics-table.svelte';
	import { topicsStore } from '$lib/pages/topics/topics-store';
	import Icon from '@iconify/svelte';
</script>

<svelte:head>
	<title>Dashboard | Sub Topics</title>
	<meta name="description" content="dashboard for aprisio." />
</svelte:head>

<Tabs.Root
	value={$topicsStore.mode}
	class="w-full p-4"
	onValueChange={(value) => {
		goto(`/admin/dashboard/subtopics?mode=${value}`);
		$topicsStore = {
			mode: value,
			id: '',
			topicName: ''
		};
	}}
>
	<Tabs.List>
		<Tabs.Trigger value="list" class="flex items-center">
			<Icon class="h-4 w-4" icon="ph:books" />
			<span class="ml-2">Subtopics List</span>
		</Tabs.Trigger>
		<Tabs.Trigger value="create">
			<Icon class="h-4 w-4" icon="proicons:book-add" />
			<span class="ml-2"> Create Subtopics</span>
		</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="list">
		<SubtopicsTable />
	</Tabs.Content>
	<Tabs.Content value="create">
		<CreateSubtopics />
	</Tabs.Content>
</Tabs.Root>
