<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { _axios } from '$lib/_axios';
	import Icon from '@iconify/svelte';
	import { createMutation } from '@tanstack/svelte-query';
	import { toast } from 'svelte-sonner';
	import logo from '../../public/logo.png';

	const routes = $state([
		// {
		// 	type: 'heading',
		// 	name: 'Analytics'
		// },
		// {
		// 	name: 'Dashboard',
		// 	href: '/admin/dashboard/',
		// 	icon: 'uil:analysis',
		// 	subRoutes: '-'
		// },
		{
			type: 'heading',
			name: 'Dashboard'
		},
		{
			name: 'Users',
			href: '/admin/dashboard/users/',
			icon: 'lucide:users-round',
			subRoutes: '-'
		},
		{
			type: 'heading',
			name: 'Community'
		},
		{
			name: 'Topics',
			href: '/admin/dashboard/topics/',
			icon: 'ic:twotone-book',
			subRoutes: '-'
		},
		{
			name: 'Sub Topics',
			href: '/admin/dashboard/subtopics/',
			icon: 'mdi:books',
			subRoutes: '-'
		},
		{
			name: 'Admin Events',
			href: '/admin/dashboard/adminevents/',
			icon: 'material-symbols:event-rounded',
			subRoutes: '-'
		}
	]);

	const logoutMutation = createMutation({
		mutationFn: async () => {
			let res = await _axios.post('/auth/logout');
			return res.data;
		},
		onSuccess: (data) => {
			toast('User has been banned successfully');
		},
		onError: (error) => {
			console.log(error);
		}
	});

	function logout() {
		$logoutMutation.mutate();
		sessionStorage.clear();
		toast('You have been logged out successfully');
		goto('/');
	}
</script>

<div
	class="hidescrollbarthumb hidden h-screen min-w-[300px] max-w-[300px] border-r border-r-[#6F7E5F] bg-[#6F7E5F] font-karla text-white md:block"
>
	<div
		class="hidescrollbarthumb flex h-[calc(100vh)] flex-col justify-between gap-2 overflow-y-auto"
	>
		<button onclick={() => goto('/admin/dashboard')}>
			<div
				class="flex min-h-[50px] cursor-pointer items-center justify-center gap-2 border-b-[1px] border-b-[#9faf8e]"
			>
				<img src={logo} alt="logo" />
			</div>
		</button>

		<nav class="flex h-full flex-col items-start px-4 text-sm">
			{#each routes as route}
				{#if route.type === 'heading'}
					<h2 class="text-md mb-2 mt-2 font-bold text-white">{route.name}</h2>
				{:else}
					<div class="w-full rounded-md">
						<button
							class="w-full py-1"
							onclick={() => {
								if (!route.href) return;
								goto(route.href);
							}}
						>
							<div
								class={`flex cursor-pointer items-center ${
									$page.url.pathname === route.href ||
									(route.href !== '/admin/dashboard/' &&
										$page.url.pathname.startsWith(route.href ?? ''))
										? 'bg-gradient-to-r from-[#4c573f] to-[#5e6852] font-bold text-white'
										: 'text-white'
								} justify-start rounded-md p-2`}
							>
								<Icon icon={route.icon ?? ''} class="mr-2 h-6 w-6" />
								<p class="text-md flex items-center gap-3 rounded-lg px-3 font-normal">
									{route.name}
								</p>
								<Icon icon={'ep:arrow-right-bold'} class="ml-auto h-4 w-4 text-zinc-300 " />
							</div>
						</button>
					</div>
				{/if}
			{/each}

			<button class="mt-auto w-full py-1" onclick={() => {}}>
				<div
					class={`my-2 flex cursor-pointer items-center justify-start rounded-md bg-gradient-to-r from-[#4c573f] to-[#5e6852] p-2 font-bold text-white`}
				>
					<Icon icon={'uil:setting'} class="mr-2 h-6 w-6 text-zinc-300" />
					<p class="text-md flex items-center gap-3 rounded-lg px-3 font-normal text-zinc-300">
						Settings
					</p>
					<Icon icon={'ep:arrow-right-bold'} class="ml-auto h-4 w-4 text-zinc-300 " />
				</div>
			</button>
		</nav>
	</div>
</div>
