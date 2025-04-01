<script lang="ts">
	import { goto } from '$app/navigation';
	import { _axios } from '$lib/_axios';
	import Paginator from '$lib/components/paginator.svelte';
	import { Badge } from '$lib/components/ui/badge';
	import { Button } from '$lib/components/ui/button';
	import Input from '$lib/components/ui/input/input.svelte';
	import * as Table from '$lib/components/ui/table';
	import { baseUrl } from '$lib/config';
	import { formatDate } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import { createMutation, createQuery } from '@tanstack/svelte-query';
	import { tick } from 'svelte';
	import * as Select from '$lib/components/ui/select/index';
	async function fetchUsers(limit = 10, page = 1, search = '', gender = '', ageRange = '') {
		const res = await _axios.get(
			`/user/all?limit=${limit}&page=${page}&q=${search}&gender=${gender}&ageRange=${ageRange}`
		);
		const data = await res.data;
		return data;
	}

	let page = $state(1);
	let limit = $state(8);
	let search = $state('');
	let gender = $state('');
	let ageRange = $state('');

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
		queryFn: () => fetchUsers(limit, page, search, gender, ageRange)
	});

	const banMutation = createMutation({
		mutationFn: async ({ id }: { id: string }) => {
			let res = await _axios.post('/user/banuser/' + id);
			return res.data;
		},
		onSuccess: (data) => {
			$query.refetch();
		},
		onError: (error) => {
			console.log(error);
		}
	});

	const exportUsers = () => {
		fetch(`${baseUrl}/user/export-excel`, {
			method: 'GET',
			headers: {
				Accept: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
			}
		})
			.then((res) => res.blob())
			.then((blob) => {
				const date = new Date();
				const url = URL.createObjectURL(blob);
				const a = document.createElement('a');
				a.href = url;
				a.download = `Aprisio_Users_${date.toISOString().split('T')[0]}.xlsx`;
				document.body.appendChild(a);
				a.click();
			})
			.catch((err) => console.error('Download error:', err));
	};
</script>

<div class="text-maintext font-karla mx-auto mt-6 w-[calc(100vw-420px)] overflow-auto">
	<div class="mb-4 ml-auto">
		<div class=" flex justify-end gap-4">
			<div class="relative">
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

			<Select.Root
				type="single"
				name="ageRange"
				value={ageRange}
				onValueChange={(value) => {
					ageRange = value === 'all' ? '' : value;
					page = 1;
					$query.refetch();
				}}
			>
				<Select.Trigger class="w-[120px] capitalize">
					{ageRange ? `${ageRange} years` : 'All Ages'}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.Item value="all">All Ages</Select.Item>
						<Select.Item value="10-20">10-20 years</Select.Item>
						<Select.Item value="20-30">20-30 years</Select.Item>
						<Select.Item value="30-40">30-40 years</Select.Item>
						<Select.Item value="40-50">40-50 years</Select.Item>
						<Select.Item value="50-60">50-60 years</Select.Item>
						<Select.Item value="60-70">60-70 years</Select.Item>
						<Select.Item value="70-80">70-80 years</Select.Item>
						<Select.Item value="80-90">80-90 years</Select.Item>
						<Select.Item value="90-100">90-100 years</Select.Item>
					</Select.Group>
				</Select.Content>
			</Select.Root>

			<Select.Root
				type="single"
				name="category"
				bind:value={gender}
				onValueChange={(value) => {
					gender = value === 'all' ? '' : value;
					page = 1;
					$query.refetch();
				}}
			>
				<Select.Trigger class="w-[100px] capitalize">
					{gender ? (gender === 'male' ? 'Male' : 'Female') : 'All'}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.Item value="all">All</Select.Item>
						<Select.Item value="male">Male</Select.Item>
						<Select.Item value="female">Female</Select.Item>
					</Select.Group>
				</Select.Content>
			</Select.Root>

			<div>
				<Button
					class="w-[120px] text-white"
					onclick={() => {
						exportUsers();
					}}
				>
					Export
				</Button>
			</div>
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
						<Table.Cell>
							<button onclick={() => $banMutation.mutate({ id: user._id })}>
								<Badge
									class={`ml-2 ${!user.active ? 'bg-green-500 text-white hover:bg-green-700' : 'bg-red-500 text-white hover:bg-red-700'}`}
									variant="secondary"
								>
									{user.active ? 'Deactivate' : 'Activate'}
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
