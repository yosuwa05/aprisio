<script lang="ts">
	import '../app.css';
	let { children } = $props();

	import { goto } from '$app/navigation';
	import { Toaster } from '$lib/components/ui/sonner';
	import { queryClient } from '$lib/query-client';
	import { QueryClientProvider } from '@tanstack/svelte-query';
	import { onMount } from 'svelte';

	onMount(() => {
		const token = localStorage.getItem('token');

		if (!token) {
			goto('/admin');
		}
	});
</script>

<Toaster position="top-right" />
<QueryClientProvider client={queryClient}>
	{@render children()}
</QueryClientProvider>
