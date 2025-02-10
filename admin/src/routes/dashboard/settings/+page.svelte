<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import ProfileSettings from '$lib/pages/settings/profile-settings.svelte';
	import Icon from '@iconify/svelte';
</script>

<svelte:head>
	<title>Dashboard | Settings</title>
	<meta name="description" content="dashboard for kings chic." />
</svelte:head>

<Tabs.Root value={'list'} class="w-full p-4">
	<Tabs.List>
		<Tabs.Trigger value="list" class="flex items-center">
			<Icon class="h-4 w-4" icon="uil:setting" />
			<span class="ml-2">Profile Settings</span>
		</Tabs.Trigger>
	</Tabs.List>
	<Tabs.Content value="list">
		<ProfileSettings />
	</Tabs.Content>
</Tabs.Root>
