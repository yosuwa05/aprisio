<script lang="ts">
	import { _axios } from '$lib/_axios';
	import { Button } from '$lib/components/ui/button';
	import * as Table from '$lib/components/ui/table';
	import TableCaption from '$lib/components/ui/table/table-caption.svelte';
	import { baseUrl } from '$lib/config';
	import Icon from '@iconify/svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import { format } from 'date-fns';
	import { Loader } from 'lucide-svelte';
	import { manageLayoutStore } from './events-store';

	async function fetchTopics(limit = 10, page = 1, search = '') {
		const res = await _axios.get(`/events/ticketusers?limit=${limit}&page=${page}&q=${search}`);
		const data = await res.data;
		return data;
	}

	async function fetchDetails(id: string) {
		const res = await _axios.get('/events/' + id);
		const data = await res.data;
		return data;
	}

	const formatEventDate = (date: string) => {
		return format(new Date(date), 'EEE, MMM d yyyy, h:mm a');
	};

	let page = $state(1);
	let limit = $state(7);
	let search = $state('');

	const query = createQuery({
		queryKey: ['events fetch 2'],
		queryFn: () => fetchTopics(limit, page, search)
	});

	const detailsQuery = createQuery({
		queryKey: ['single event fetch', $manageLayoutStore.selectedId],
		queryFn: () => fetchDetails($manageLayoutStore.selectedId)
	});
</script>

<div class="px-12">
	{#if $detailsQuery.isLoading && $detailsQuery.isRefetching}
		<Loader class="mx-auto h-10 w-10" />
	{:else if $detailsQuery.data}
		<div class="text-maintext font-karla mx-auto mt-6 flex gap-5">
			<Button
				size="icon"
				onclick={() => {
					$manageLayoutStore.singleEventSelected = false;
					$manageLayoutStore.selectedId = '';
				}}
			>
				<Icon icon="ion:arrow-back" color="white" class="h-6 w-6" />
			</Button>
			<div class="flex flex-col gap-3">
				<div class="flex items-center gap-2">
					<h1 class="text-3xl font-bold">{$detailsQuery.data?.event.eventName}</h1>

					<h5 class="text-gray-500">{$detailsQuery.data?.event.eventId}</h5>
				</div>
				<p class="flex items-center gap-2">
					<Icon icon="tdesign:time" font-size="1rem" />
					{formatEventDate($detailsQuery.data?.event.datetime)}
				</p>

				<p class="flex items-center gap-2">
					<Icon icon="lets-icons:ticket" font-size="1rem" />
					{$detailsQuery.data?.event.availableTickets} tickets
				</p>

				<p class="flex items-center gap-2">
					<Icon icon="streamline:bag-rupee" font-size="1rem" />
					{$detailsQuery.data?.event.price} INR
				</p>
			</div>
		</div>
	{/if}

	<Table.Root class="mt-6">
		{#if $query.isLoading}
			<Table.Caption>Loading....</Table.Caption>
		{:else if $query?.data?.total === 0}
			<TableCaption class="w-full text-center text-xs">No Users Found!</TableCaption>
		{/if}
		<Table.Header>
			<Table.Row class="">
				<Table.Head class="w-[100px]">Sl.No</Table.Head>
				<Table.Head>User Name</Table.Head>
				<Table.Head>Mobile</Table.Head>
				<Table.Head class="">Email</Table.Head>
				<Table.Head>Tickets</Table.Head>
				<Table.Head>Price</Table.Head>
				<Table.Head>Download</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each $query.data?.ticketusers || [] as event, i}
				<Table.Row>
					<Table.Cell>{i + 1 + (page - 1) * limit}</Table.Cell>
					<Table.Cell class="cursor-pointer capitalize hover:underline">
						{event.userId?.name}
					</Table.Cell>
					<Table.Cell class="flex items-center capitalize">
						{event.userId?.mobile}</Table.Cell
					>
					<Table.Cell>
						{event.userId?.email}
					</Table.Cell>
					<Table.Cell>
						{event?.ticketCount}
					</Table.Cell>
					<Table.Cell>
						{event?.amount}
					</Table.Cell>
					<Table.Cell class="flex gap-2">
						<button
							onclick={() => {
								window.open(baseUrl + '/admin?id=' + event._id);
							}}
						>
							<Icon icon={'bytesize:download'} class="text-xl hover:text-red-500" />
						</button>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
</div>
