<script lang="ts">
	import { _axios } from '$lib/_axios';
	import Paginator from '$lib/components/paginator.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Table from '$lib/components/ui/table';
	import TableCaption from '$lib/components/ui/table/table-caption.svelte';
	import { baseUrl } from '$lib/config';
	import Icon from '@iconify/svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import { format } from 'date-fns';
	import { Loader } from 'lucide-svelte';
	import { tick } from 'svelte';
	import { manageUserEventStore } from './user-events-store';

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
		queryKey: ['events fetch 2'],
		queryFn: () => fetchTopics(limit, page, search)
	});

	const detailsQuery = createQuery({
		queryKey: ['user single event fetch', $manageUserEventStore.userEventId],
		queryFn: () => fetchDetails($manageUserEventStore.userEventId)
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

<div class="px-12">
	{#if $detailsQuery.isLoading && $detailsQuery.isRefetching}
		<Loader class="mx-auto h-10 w-10" />
	{:else if $detailsQuery.data}
		<div class="text-maintext font-karla mx-auto mt-6 flex gap-5">
			<Button
				size="icon"
				onclick={() => {
					$manageUserEventStore.userEventSelected = false;
					$manageUserEventStore.userEventId = '';
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
</div>
