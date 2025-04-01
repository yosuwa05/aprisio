<script lang="ts">
	import { goto } from '$app/navigation';
	import { _axios } from '$lib/_axios';
	import Paginator from '$lib/components/paginator.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Table from '$lib/components/ui/table';
	import Icon from '@iconify/svelte';
	import { createMutation, createQuery } from '@tanstack/svelte-query';
	import { tick } from 'svelte';
	import * as Select from '$lib/components/ui/select/index';
	import { toast } from 'svelte-sonner';
	import { manageUserEventStore } from './user-events-store';
	async function fetchEvents(limit = 10, page = 1, search = '', filter = 'true') {
		const res = await _axios.get(
			`/user-event/all?limit=${limit}&page=${page}&q=${search}&filter=${filter}`
		);
		const data = await res.data;
		return data;
	}

	let page = $state(1);
	let limit = $state(8);
	let search = $state('');
	let filter = $state('false');

	function handleFilterChange(value: any) {
		filter = value;
		page = 1;
		$query.refetch();
	}

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
		// svelte-ignore state_referenced_locally
		queryKey: ['user events fetch', page, limit, search, filter], // Ensure filter is included
		queryFn: () => fetchEvents(limit, page, search, filter)
	});

	const approvevent = createMutation({
		mutationFn: async ({ id }: { id: string }) => {
			let res = await _axios.post('/user-event/approve/' + id);
			return res.data;
		},
		onSuccess: (data) => {
			toast.success(data.message);
			$query.refetch();
		},
		onError: (error: any) => {
			toast.error(error.message);
			console.log(error);
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

<div class="text-maintext font-karla mx-auto mt-6 w-[calc(100vw-420px)] overflow-auto">
	<div class="mb-4 ml-auto w-[40%]">
		<div class="relative grid grid-cols-2 items-center gap-2">
			<Select.Root
				type="single"
				name="category"
				bind:value={filter}
				onValueChange={handleFilterChange}
			>
				<Select.Trigger class="capitalize">
					{filter ? (filter === 'true' ? 'Ended' : 'Live') : 'Filter'}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.Item value="false">Live</Select.Item>
						<Select.Item value="true">Ended</Select.Item>
					</Select.Group>
				</Select.Content>
			</Select.Root>
			<Input
				type={'text'}
				required
				class="pr-10  focus:!ring-0 focus:!ring-transparent"
				placeholder={'Search Event Name'}
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

	<div class="overflow-x-auto">
		<Table.Root>
			{#if $query.isLoading}
				<Table.Caption>Loading....</Table.Caption>
			{:else if $query?.data?.total === 0}
				<Table.Caption class="w-full text-center text-xs">No Events Found!</Table.Caption>
			{/if}
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-[100px]">Sl.No</Table.Head>
					<Table.Head>Event Name</Table.Head>
					<Table.Head>Created At</Table.Head>
					<Table.Head>Created By</Table.Head>
					<Table.Head>Status</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each $query.data?.events || [] as event, i}
					<Table.Row>
						<Table.Cell>{i + 1 + (page - 1) * limit}</Table.Cell>
						<Table.Cell class="capitalize ">
							<button
								class="text-primary cursor-pointer capitalize underline underline-offset-4"
								onclick={() => {
									$manageUserEventStore.userEventSelected = true;
									$manageUserEventStore.userEventId = event._id;
								}}
							>
								{event?.eventName}
							</button>
						</Table.Cell>

						<Table.Cell>{formatDate(new Date(event?.createdAt))}</Table.Cell>
						<Table.Cell>{event?.managedBy?.name || '-'}</Table.Cell>
						<Table.Cell>
							<button>
								<Badge
									class={`ml-2 ${event.isEventEnded ? 'bg-red-500 text-white hover:bg-red-700' : 'bg-green-500 text-white hover:bg-green-700'}`}
									variant="secondary"
								>
									{event?.isEventEnded ? 'Ended' : 'Live'}
								</Badge>
							</button>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>

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
	{/if}
</div>
