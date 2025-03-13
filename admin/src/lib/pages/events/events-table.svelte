<script lang="ts">
	import { _axios } from '$lib/_axios';
	import Paginator from '$lib/components/paginator.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Dialog from '$lib/components/ui/dialog';
	import { Input } from '$lib/components/ui/input';
	import * as Table from '$lib/components/ui/table';
	import TableCaption from '$lib/components/ui/table/table-caption.svelte';
	import { queryClient } from '$lib/query-client';
	import Icon from '@iconify/svelte';
	import { createMutation, createQuery } from '@tanstack/svelte-query';
	import { formatDistanceToNow } from 'date-fns';
	import { tick } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { eventsStore } from './events-store';

	async function fetchTopics(limit = 10, page = 1, search = '') {
		const res = await _axios.get(`/events/all?limit=${limit}&page=${page}&q=${search}`);
		const data = await res.data;
		return data;
	}

	let page = $state(1);
	let limit = $state(7);
	let modelOpen = $state(false);
	let search = $state('');

	let debounceTimeout: any;
	function debounceSearch() {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(async () => {
			await tick();
			page = 1;
			$query.refetch();
		}, 500);
	}

	const query = createQuery({
		queryKey: ['topics fetch'],
		queryFn: () => fetchTopics(limit, page, search)
	});

	const deleteMutation = createMutation({
		mutationFn: ({ id, permanent }: { id: string; permanent: boolean }) =>
			_axios.delete(`/events/${id}?permanent=${permanent}`),
		onSuccess({ data }) {
			queryClient.refetchQueries({
				queryKey: ['topics fetch']
			});
			toast(data?.message ?? 'Topic Edited');
			modelOpen = false;
		},
		onError(error, variables, context) {
			console.error('onError', error, variables, context);
		}
	});

	function formatDate(date: Date) {
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric'
		}).format(date);
	}
</script>

<div>
	<div class="text-maintext mx-auto mt-6 font-karla">
		<div class="ml-auto w-[40%]">
			<div class="relative grid gap-2">
				<Input
					type={'text'}
					required
					class="pr-10"
					placeholder={'Search Topics'}
					bind:value={search}
					oninput={debounceSearch}
				/>
				{#if !search}
					<Icon
						icon={'iconamoon:search'}
						class="absolute bottom-2.5 right-2 cursor-pointer text-xl text-gray-400"
					/>
				{:else}
					<Icon
						icon={'mdi:clear-outline'}
						onclick={() => {
							search = '';
							debounceSearch();
						}}
						class="absolute bottom-2.5 right-2 cursor-pointer text-xl text-gray-400"
					/>
				{/if}
			</div>
		</div>

		<Table.Root class="">
			{#if $query.isLoading}
				<Table.Caption>Loading....</Table.Caption>
			{:else if $query?.data?.total === 0}
				<TableCaption class="w-full text-center text-xs">No Events Found!</TableCaption>
			{/if}
			<Table.Header>
				<Table.Row class="">
					<Table.Head class="w-[100px]">Sl.No</Table.Head>
					<Table.Head>Topic Name</Table.Head>
					<Table.Head class="">Created At</Table.Head>
					<Table.Head>Total Tickets</Table.Head>
					<Table.Head>Sold Tickets</Table.Head>
					<Table.Head>Balance Tickets</Table.Head>
					<Table.Head>Actions</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each $query.data?.events || [] as event, i}
					<Table.Row>
						<Table.Cell>{i + 1 + (page - 1) * limit}</Table.Cell>
						<Table.Cell>{event.eventName}</Table.Cell>
						<Table.Cell class="flex items-center capitalize"
							>{formatDistanceToNow(new Date(event.createdAt))}</Table.Cell
						>
						<Table.Cell>
							{event?.availableTickets}
						</Table.Cell>
						<Table.Cell>
							{event?.attendees?.length}
						</Table.Cell>
						<Table.Cell>
							{event?.availableTickets - event?.attendees?.length}
						</Table.Cell>
						<Table.Cell class="flex gap-2">
							<button
								onclick={() => (
									(modelOpen = true), ($eventsStore = { ...$eventsStore, id: event._id })
								)}
							>
								<Icon icon={'mingcute:delete-2-fill'} class="text-xl hover:text-red-500" />
							</button>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>

		<Dialog.Root open={modelOpen} onOpenChange={(e) => (modelOpen = e)}>
			<Dialog.Content class="p-6">
				<Dialog.Header class="text-center">
					<Dialog.Title class="text-center"
						>Do you want to delete this Event Permanently ?</Dialog.Title
					>
				</Dialog.Header>

				<div class="flex justify-around gap-4">
					<Button
						class="w-full bg-red-500 font-bold text-white hover:bg-red-400"
						onclick={() => $deleteMutation.mutate({ id: $eventsStore.id, permanent: true })}
						>Yes</Button
					>
					<Button class="w-full font-bold text-white" onclick={() => (modelOpen = false)}>No</Button
					>
				</div>
			</Dialog.Content>
		</Dialog.Root>

		{#if !$query.isLoading && $query?.data?.total > 0}
			<Paginator
				total={$query?.data?.total || 0}
				{limit}
				{page}
				callback={(_page: any) => {
					if (_page === page) return;
					page = _page;
					$query.refetch();
				}}
			/>
			<!-- {:else}
			<p class="text-center text-xs">No Managers Found!</p> -->
		{/if}
	</div>
</div>
