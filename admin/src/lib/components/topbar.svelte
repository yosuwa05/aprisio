<script lang="ts">
	import { loadAdminData } from '$lib/stores/global-store';
	import { onMount } from 'svelte';
	// Import store
	import { goto } from '$app/navigation';
	import { _axios } from '$lib/_axios';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { createMutation } from '@tanstack/svelte-query';
	import * as Avatar from './ui/avatar';

	onMount(() => {
		loadAdminData();
	});
	const logoutMutation = createMutation({
		mutationFn: () => _axios.post('/auth/logout'),
		onSuccess() {
			localStorage.removeItem('admin');
			localStorage.removeItem('token');
			goto('/admin');
		}
	});

	function logout() {
		$logoutMutation.mutate();
	}
</script>

<!-- In the template, use $writableGlobalStore to subscribe to the store value -->
<div
	class="bg-primary flex min-h-[65px] items-center justify-start border-l-[1px] border-[#9faf8e]"
>
	<div class="ml-auto flex items-center gap-2 pr-5 text-white">
		<DropdownMenu.Root>
			<DropdownMenu.Trigger>
				<Avatar.Root class="mx-4 cursor-pointer">
					<Avatar.Image src="" alt="Profile" class="object-cover"></Avatar.Image>
					<Avatar.Fallback class="text-black">A</Avatar.Fallback>
				</Avatar.Root>
			</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				<DropdownMenu.Group>
					<DropdownMenu.GroupHeading>Account</DropdownMenu.GroupHeading>
					<DropdownMenu.Separator></DropdownMenu.Separator>
					<DropdownMenu.Item
						onclick={() => {
							goto('/admin/dashboard/settings');
						}}>Settings</DropdownMenu.Item
					>
					<DropdownMenu.Item onclick={() => logout()}>Logout</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</div>
