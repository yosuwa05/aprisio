<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { _axios } from '$lib/_axios';
	import Paginator from '$lib/components/paginator.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Table from '$lib/components/ui/table';
	import Icon from '@iconify/svelte';
	import { createQuery } from '@tanstack/svelte-query';

	async function fetchUser(id: string) {
		const res = await _axios.get(`/user/${id}`);
		const data = await res.data;
		return data;
	}

	async function fetchOrders(limit = 10, page = 1, userId = '') {
		const res = await _axios.get(
			`/users/orderhistory?limit=${limit}&page=${page}&userId=${userId}`
		);
		const data = await res.data;
		return data;
	}

	let _page = $state(1);
	let limit = $state(7);

	const query = createQuery({
		queryKey: ['admin user fetch'],
		queryFn: () => fetchUser($page.params?.userid)
	});

	const orderHistoryQuery = createQuery({
		queryKey: ['admin user order history'],
		queryFn: () => fetchOrders(limit, _page, $page.params?.userid)
	});

	function viewOrder(orderId: string) {
		goto(`/hidden-admin-base-007/dashboard/orders/${orderId}`);
	}
</script>

<svelte:head>
	<title>Dashboard | User</title>
	<meta name="description" content="dashboard for kings chic." />
</svelte:head>
<div
	class="w-[95%] mx-auto p-6 space-y-6 h-[calc(100vh-60px)] overflow-y-auto hidescrollbarthumb text-white"
>
	{#if $query.isLoading}
		<div class="flex justify-center items-center min-h-[400px]">
			<div class="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
		</div>
	{:else if $query.data?.user}
		{@const user = $query.data.user}
		<div class="flex justify-between">
			<div>
				<div class="flex gap-2 items-center justify-between">
					<h1 class="text-3xl font-bold capitalize mb-2">{user.username}</h1>
				</div>
				<p class="text-muted-foreground">
					Joined At {new Date(user.createdAt).toLocaleString('en-IN', {
						year: 'numeric',
						month: 'long',
						day: 'numeric',
						hour: '2-digit',
						minute: '2-digit',
						hour12: true
					})}
				</p>

				<div class="flex mt-4">
					<h1 class="text-muted-foreground text-2xl flex gap-2 items-center"><Icon icon="fluent:person-48-regular" class="text-lg" />
{user.name}
					</h1>
				</div>
				<div class="flex gap-2 items-center mt-4">
					
					<p class="text-muted-foreground flex gap-2 items-center">
						<Icon icon="fluent:call-48-regular" class="text-lg" />
						{user.mobile}
					</p>
					<p class="text-muted-foreground flex gap-2 items-center">
						<Icon icon="ic:outline-email" class="text-lg" />
						{#if user.email}
							{user.email}
						{:else}
							Not Available
						{/if}
					</p>
				</div>

			</div>
			<div>
				<Button size="sm" onclick={() => history.back()}>
					<Icon icon="ep:arrow-up-bold" class="text-lg rotate-[-90deg]" />
					Back</Button
				>
			</div>
		</div>

	{/if}
</div>
