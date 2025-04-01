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
	import * as Dialog from '$lib/components/ui/dialog';
	import { Button } from '$lib/components/ui/button';
	import { queryClient } from '$lib/query-client';
	async function fetchGroups(limit = 10, page = 1, search = '', filter = 'true') {
		const res = await _axios.get(
			`/group-management/all?limit=${limit}&page=${page}&q=${search}&filter=${filter}`
		);
		const data = await res.data;
		return data;
	}

	let page = $state(1);
	let limit = $state(8);
	let search = $state('');
	let filter = $state('true');
	let modelOpen = $state(false);
	let deleteId = $state('');

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
	const deleteMutation = createMutation({
		mutationFn: () => _axios.delete(`/group-management/group?groupId=${deleteId}`),
		onSuccess({ data }) {
			$query.refetch();
			toast(data?.message ?? 'Group deleted successfully');
			modelOpen = false;
			console.log(data);
		},
		onError(error, variables, context) {
			console.error('onError', error, variables, context);
		}
	});
	const query = createQuery({
		// svelte-ignore state_referenced_locally
		queryKey: ['user groups fetch', page, limit, search, filter],
		queryFn: () => fetchGroups(limit, page, search, filter)
	});

	const approvevent = createMutation({
		mutationFn: async ({ id }: { id: string }) => {
			let res = await _axios.post('/group-management/statuschange/' + id);
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
		<div class="relative grid grid-cols-2 items-center gap-3">
			<Select.Root
				type="single"
				name="category"
				bind:value={filter}
				onValueChange={handleFilterChange}
			>
				<Select.Trigger class="capitalize">
					{filter ? (filter === 'true' ? 'Active' : 'Inactive') : 'Filter'}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.Item value="true">Active</Select.Item>
						<Select.Item value="false">Inactive</Select.Item>
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
				<Table.Caption class="w-full text-center text-xs">No Groups Found!</Table.Caption>
			{/if}
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-[100px]">Sl.No</Table.Head>
					<Table.Head>Group Name</Table.Head>
					<Table.Head>Sub Topic</Table.Head>
					<Table.Head>Created At</Table.Head>
					<Table.Head>Created By</Table.Head>
					<Table.Head>Status</Table.Head>
					<Table.Head>Action</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each $query.data?.Groups || [] as group, i}
					<Table.Row>
						<Table.Cell>{i + 1 + (page - 1) * limit}</Table.Cell>
						<Table.Cell class="capitalize ">
							<button class="text-primary cursor-pointer capitalize underline underline-offset-4">
								{group?.name}
							</button>
						</Table.Cell>
						<Table.Cell>{group?.subTopic?.subTopicName || '-'}</Table.Cell>

						<Table.Cell>{formatDate(new Date(group?.createdAt))}</Table.Cell>
						<Table.Cell>{group?.groupAdmin?.name || '-'}</Table.Cell>

						<Table.Cell>
							<button onclick={() => $approvevent.mutate({ id: group._id })}>
								<Badge
									class={`ml-2 ${group.active ? 'bg-green-500 text-white hover:bg-green-700' : 'bg-red-500 text-white hover:bg-red-700'}`}
									variant="secondary"
								>
									{group?.active ? 'Active' : 'Inactive'}
								</Badge>
							</button>
						</Table.Cell>
						<Table.Cell class="flex gap-2">
							<button
								onclick={() => {
									modelOpen = true;
									deleteId = group._id;
								}}
							>
								<Icon icon={'iconoir:trash'} class="text-xl hover:text-red-500" />
							</button>
						</Table.Cell>
					</Table.Row>
				{/each}
			</Table.Body>
		</Table.Root>
	</div>
	<Dialog.Root open={modelOpen} onOpenChange={(e) => (modelOpen = e)}>
		<Dialog.Content class="w-[300px] p-6">
			<Dialog.Header class="text-center">
				<Dialog.Title class="text-center leading-6"
					>Do you want to delete this Event Permanently ?</Dialog.Title
				>
			</Dialog.Header>

			<div class="flex flex-col justify-center gap-4">
				<Button
					class="bg-red-500 font-bold text-white hover:bg-red-400"
					onclick={() => $deleteMutation.mutate()}>Yes</Button
				>
				<Button
					class=" font-bold text-white"
					onclick={() => {
						modelOpen = false;
						deleteId = '';
					}}>No</Button
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
	{/if}
</div>
