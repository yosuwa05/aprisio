<script lang="ts">
	import { goto } from '$app/navigation';
	import { _axios } from '$lib/_axios';
	import Paginator from '$lib/components/paginator.svelte';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Table from '$lib/components/ui/table';
	import { formatDate } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import { tick } from 'svelte';

	async function fetchUsers(limit = 10, page = 1, search = '') {
		const res = await _axios.get(`/user/all?limit=${limit}&page=${page}&q=${search}`);
		const data = await res.data;
		return data;
	}

	let page = $state(1);
	let limit = $state(8);
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
		queryKey: ['users fetch', debounceSearch],
		queryFn: () => fetchUsers(limit, page, search)
	});
</script>

<div class="text-maintext font-pt mx-auto mt-6 w-[calc(100vw-420px)] overflow-auto">
	<div class="mb-4 ml-auto w-[40%]">
		<div class="relative grid gap-2">
			<Input
				type={'text'}
				required
				class="pr-10  focus:!ring-0 focus:!ring-transparent"
				placeholder={'Search Users Name'}
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
				<Table.Caption class="w-full text-center text-xs">No Users Found!</Table.Caption>
			{/if}
			<Table.Header>
				<Table.Row>
					<Table.Head class="w-[100px]">Sl.No</Table.Head>
					<Table.Head>User Name</Table.Head>
					<Table.Head class="cursor-pointer">Mobile</Table.Head>
					<Table.Head>Email</Table.Head>
					<Table.Head>Joined At</Table.Head>
					<Table.Head>Active</Table.Head>
				</Table.Row>
			</Table.Header>
			<Table.Body>
				{#each $query.data?.users || [] as user, i}
					<Table.Row>
						<Table.Cell>{i + 1 + (page - 1) * limit}</Table.Cell>
						<Table.Cell class="capitalize ">
							<button
								class="text-primary cursor-pointer capitalize underline underline-offset-4"
								onclick={() => {
									goto(`/admin/dashboard/users/${user._id}`);
								}}
							>
								{user.name}
							</button>
						</Table.Cell>
						<Table.Cell>{user.mobile}</Table.Cell>
						<Table.Cell>{user.email || '-'}</Table.Cell>
						<Table.Cell>{formatDate(user.createdAt)}</Table.Cell>
						<Table.Cell>{user.active ? 'Yes' : 'No'}</Table.Cell>
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
