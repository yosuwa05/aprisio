<script lang="ts">
	import Sidebar from '$lib/components/sidebar.svelte';
	import Topbar from '$lib/components/topbar.svelte';

	let { children } = $props();
</script>

<div class="flex">
	<Sidebar />
	<div class="ml-[300px] flex w-full flex-col">
		<!-- <Topbar /> -->
		{@render children()}
	</div>
</div>
