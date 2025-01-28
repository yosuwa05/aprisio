<script lang="ts">
	import * as Tabs from '$lib/components/ui/tabs';
	import UsersTable from '$lib/pages/users/users-table.svelte';
</script>

<svelte:head>
	<title>Dashboard | Users</title>
	<meta name="description" content="dashboard for Aprisio" />
</svelte:head>

<Tabs.Root value="list" class="w-full p-4">
	<UsersTable />
</Tabs.Root>
