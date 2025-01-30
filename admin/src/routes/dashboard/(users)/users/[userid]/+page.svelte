<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { _axios } from '$lib/_axios';
	import { Button } from '$lib/components/ui/button';
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
<div class="hidescrollbarthumb mx-auto w-[95%] space-y-6 overflow-y-auto p-6 text-white">
	{#if $query.isLoading}
		<div class="flex min-h-[400px] items-center justify-center">
			<div class="border-primary h-8 w-8 animate-spin rounded-full border-b-2"></div>
		</div>
	{:else if $query.data?.user}
		{@const user = $query.data.user}
		<div class="flex justify-between">
			<div>
				<div class="flex items-center justify-between gap-2">
					<h1 class="mb-2 text-3xl font-bold capitalize">{user.username}</h1>
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

				<div class="mt-4 flex">
					<h1 class="text-muted-foreground flex items-center gap-2 text-2xl">
						<Icon icon="fluent:person-48-regular" class="text-lg" />
						{user.name}
					</h1>
				</div>
				<div class="mt-4 flex items-center gap-2">
					<p class="text-muted-foreground flex items-center gap-2">
						<Icon icon="fluent:call-48-regular" class="text-lg" />
						{user.mobile}
					</p>
					<p class="text-muted-foreground flex items-center gap-2">
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
					<Icon icon="ep:arrow-up-bold" class="rotate-[-90deg] text-lg" />
					Back</Button
				>
			</div>
		</div>
	{/if}
</div>
