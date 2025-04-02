<script lang="ts">
	import { goto } from '$app/navigation';
	import * as Tabs from '$lib/components/ui/tabs';
	import CreateSubtopics from '$lib/pages/subtopics/create-subtopics.svelte';
	import { subTopicsStore } from '$lib/pages/subtopics/subtopics-store';
	import SubtopicsTable from '$lib/pages/subtopics/subtopics-table.svelte';
	import Icon from '@iconify/svelte';
</script>

<svelte:head>
	<title>Dashboard | Sub Community</title>
	<meta name="description" content="dashboard for aprisio." />
</svelte:head>

<Tabs.Root
	value={$subTopicsStore.mode}
	class="w-full p-4"
	onValueChange={(value) => {
		goto(`/admin/dashboard/subtopics?mode=${value}`);
		$subTopicsStore = {
			mode: value,
			id: '',
			topicName: '',
			description: '',
			topic: ''
		};
	}}
>
	<Tabs.List>
		<Tabs.Trigger value="list" class="flex items-center">
			<Icon class="h-4 w-4" icon="ph:books" />
			<span class="ml-2">Sub Community List</span>
		</Tabs.Trigger>
		<Tabs.Trigger value="create">
			<Icon class="h-4 w-4" icon="proicons:book-add" />
			<span class="ml-2"> Create Sub Community</span>
		</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="list">
		<SubtopicsTable />
	</Tabs.Content>
	<Tabs.Content value="create">
		<CreateSubtopics />
	</Tabs.Content>
</Tabs.Root>
