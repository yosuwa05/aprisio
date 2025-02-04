<script lang="ts">
	import Sidebar from '$lib/components/sidebar.svelte';
	import Topbar from '$lib/components/topbar.svelte';

	let { children } = $props();
</script>

<div class="flex w-screen">
	<Sidebar />
	<div class="flex flex-col w-full">
		<Topbar />
		{@render children()}
	</div>
</div>
