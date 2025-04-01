<script lang="ts">
	import { _axios } from '$lib/_axios';
	import * as Card from '$lib/components/ui/card';
	import Icon from '@iconify/svelte';
	import { createQuery } from '@tanstack/svelte-query';

	async function fetchCounts() {
		const res = await _axios.get(`/dashboard/counts`);
		const data = await res.data;
		return data;
	}

	const query = createQuery({
		queryKey: ['Dashboard counts'],
		queryFn: () => fetchCounts()
	});
</script>

<div class="p-5">
	<h1 class="py-2 text-3xl font-bold">Dashboard</h1>
	<div class="p-2">
		<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0 ">
					<Card.Title class="text-sm font-medium">Users</Card.Title>
					<Icon icon="ion:people" class="text-muted-foreground text-xl " />
				</Card.Header>
				<Card.Content>
					<div class="text-2xl font-bold">+ {$query.data?.totalUsers}</div>
				</Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0">
					<Card.Title class="text-sm font-medium">Topics</Card.Title>
					<Icon icon="ic:twotone-book" class="text-muted-foreground text-xl" />
				</Card.Header>
				<Card.Content>
					<div class="text-2xl font-bold">+ {$query.data?.totalTopics}</div>
				</Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0 ">
					<Card.Title class="text-sm font-medium">Sub Topics</Card.Title>
					<Icon icon="mdi:books" class="text-muted-foreground text-xl" />
				</Card.Header>
				<Card.Content>
					<div class="text-2xl font-bold">+ {$query.data?.totalSubTopics}</div>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
	<div class="p-2">
		<h1 class="py-2 text-xl font-bold">Groups & Events</h1>
		<div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0">
					<Card.Title class="text-sm font-medium">Groups</Card.Title>
					<Icon icon="fa:group" class="text-muted-foreground text-xl" />
				</Card.Header>
				<Card.Content>
					<div class="text-2xl font-bold">+ {$query.data?.totalGroups}</div>
				</Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0">
					<Card.Title class="text-sm font-medium">Live Events</Card.Title>
					<Icon icon="material-symbols:event" class="text-muted-foreground text-xl" />
				</Card.Header>
				<Card.Content>
					<div class="text-2xl font-bold">+ {$query.data?.totalLiveEvents}</div>
				</Card.Content>
			</Card.Root>
			<Card.Root>
				<Card.Header class="flex flex-row items-center justify-between space-y-0">
					<Card.Title class="text-sm font-medium">Expired Events</Card.Title>
					<Icon
						icon="material-symbols-light:event-busy-outline-rounded"
						class="text-muted-foreground text-xl"
					/>
				</Card.Header>
				<Card.Content>
					<div class="text-2xl font-bold">+ {$query.data?.totalExpiredEvents}</div>
				</Card.Content>
			</Card.Root>
		</div>
	</div>
</div>
