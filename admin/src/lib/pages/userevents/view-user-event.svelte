<script lang="ts">
	import { _axios } from '$lib/_axios';
	import { Button } from '$lib/components/ui/button';
	import Icon from '@iconify/svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import { format } from 'date-fns';
	import { Loader } from 'lucide-svelte';
	import { manageUserEventStore } from './user-events-store';

	async function fetchDetails(id: string) {
		const res = await _axios.get('/user-event/view-event?eventId=' + id);
		return res.data;
	}

	const formatEventDate = (date: string) => format(new Date(date), 'EEE, MMM d yyyy, h:mm a');

	const detailsQuery = createQuery({
		queryKey: ['user single event fetch', $manageUserEventStore.userEventId],
		queryFn: () => fetchDetails($manageUserEventStore.userEventId)
	});
</script>

<div class="px-12 py-6">
	{#if $detailsQuery.isLoading && $detailsQuery.isRefetching}
		<Loader class="mx-auto h-10 w-10" />
	{:else if $detailsQuery.data}
		<div class="text-maintext font-karla mx-auto max-w-4xl">
			<Button
				size="icon"
				onclick={() => {
					$manageUserEventStore.userEventSelected = false;
					$manageUserEventStore.userEventId = '';
				}}
			>
				<Icon icon="ion:arrow-back" color="white" class="h-6 w-6" />
			</Button>
			<div class="mt-6 flex flex-col gap-4 border-b pb-4">
				<h1 class="text-3xl font-bold">{$detailsQuery.data?.Event?.eventName}</h1>
				<p class="flex items-center gap-2 text-gray-600">
					<Icon icon="tdesign:time" class="text-lg" />
					{formatEventDate($detailsQuery.data?.Event?.date)}
				</p>
				<p class="flex items-center gap-2 text-gray-600">
					<Icon icon="mdi:map-marker" class="text-lg" />
					{$detailsQuery.data?.Event?.location}
				</p>
			</div>

			<div class="mt-6 border-b pb-4">
				<h2 class="text-xl font-semibold">Event Rules</h2>
				<ul class="mt-2 list-disc pl-5 text-gray-700">
					{#each $detailsQuery.data?.Event?.rules as rule}
						<li>
							<strong>{rule?.heading}:</strong>
							{rule?.subHeading}
						</li>
					{/each}
				</ul>
			</div>

			<div class="mt-6 border-b pb-4">
				<h2 class="text-xl font-semibold">Managed By</h2>
				<p class="mt-2 text-gray-700">{$detailsQuery.data?.Event?.managedBy?.name || 'N/A'}</p>
			</div>

			<div class="mt-6 border-b pb-4">
				<h2 class="text-xl font-semibold">Group & Topics</h2>
				<p class="mt-2 text-gray-700">
					<strong>Group:</strong>
					{$detailsQuery.data?.Event?.group?.name || 'N/A'}
				</p>
				<p class="text-gray-700">
					<strong>Sub-Topic:</strong>
					{$detailsQuery.data?.Event?.group?.subTopic?.subTopicName}
				</p>
				<p class="text-gray-700">
					<strong>Topic:</strong>
					{$detailsQuery.data?.Event?.group?.subTopic?.topic?.topicName}
				</p>
			</div>
		</div>
	{/if}
</div>
