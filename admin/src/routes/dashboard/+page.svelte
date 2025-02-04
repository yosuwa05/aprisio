<script lang="ts">
	import { goto } from '$app/navigation';
	import { _axios } from '$lib/_axios';
	import * as Avatar from '$lib/components/ui/avatar';
	import { Badge } from '$lib/components/ui/badge';
	import * as Card from '$lib/components/ui/card';
	// import { formatDate, setBadgeColor } from '$lib/utils';
	import Icon from '@iconify/svelte';
	import { createQuery } from '@tanstack/svelte-query';


</script>

<svelte:head>
	<title>Dashboard | Aprisio</title>
	<meta name="description" content="dashboard for Aprisio." />
</svelte:head>

<div class="grid grid-cols-2 lg:grid-cols-4 gap-5 items-center p-4">
<h1 class="text-4xl font-lato">Dashboard</h1>
</div>

