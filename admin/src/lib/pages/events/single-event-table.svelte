<script lang="ts">
	import { _axios } from '$lib/_axios';
	import Paginator from '$lib/components/paginator.svelte';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import * as Table from '$lib/components/ui/table';
	import TableCaption from '$lib/components/ui/table/table-caption.svelte';
	import { baseUrl } from '$lib/config';
	import Icon from '@iconify/svelte';
	import { createQuery } from '@tanstack/svelte-query';
	import { format } from 'date-fns';
	import { Loader } from 'lucide-svelte';
	import { tick } from 'svelte';
	import { manageLayoutStore } from './events-store';
	import ExcelJS from 'exceljs';
	//@ts-ignore
	import { saveAs } from 'file-saver';
	import { toast } from 'svelte-sonner';

	async function fetchTopics(limit = 10, page = 1, search = '', eventId = '') {
		const res = await _axios.get(
			`/events/ticketusers?limit=${limit}&page=${page}&q=${search}&eventId=${$manageLayoutStore.selectedId}`
		);
		const data = await res.data;
		return data;
	}

	async function fetchDetails(id: string) {
		const res = await _axios.get('/events/' + id);
		const data = await res.data;
		return data;
	}

	async function FetchAlltickets(eventId = '') {
		const res = await _axios.get(`/events/All-tickets?eventId=${eventId}`);
		const data = await res.data;
		return data;
	}

	const formatEventDate = (date: string) => {
		return format(new Date(date), 'EEE, MMM d yyyy, h:mm a');
	};

	let page = $state(1);
	let limit = $state(7);
	let search = $state('');
	let debounceTimeout: any;
	function debounceSearch() {
		clearTimeout(debounceTimeout);
		debounceTimeout = setTimeout(async () => {
			await tick();
			page = 1;
			$query.refetch();
		}, 500);
	}
	const query = createQuery({
		// svelte-ignore state_referenced_locally
		queryKey: ['events fetch 2', $manageLayoutStore.selectedId, page, limit, search], // Include selectedId
		queryFn: () => fetchTopics(limit, page, search, $manageLayoutStore.selectedId)
	});

	const detailsQuery = createQuery({
		queryKey: ['single event fetch', $manageLayoutStore.selectedId],
		queryFn: () => fetchDetails($manageLayoutStore.selectedId)
	});

	const AllTickets = createQuery({
		queryKey: ['Fetch All tickets', $manageLayoutStore.selectedId],
		queryFn: () => FetchAlltickets($manageLayoutStore.selectedId)
	});
	console.log($AllTickets.data);

	async function exportToExcel() {
		if ($AllTickets?.data?.alltickets?.length === 0) {
			return toast.error('No tickets found');
		}

		const workbook = new ExcelJS.Workbook();
		const worksheet = workbook.addWorksheet('Event Tickets');

		// Define columns with headers
		worksheet.columns = [
			{ header: 'Ticket Id', key: 'ticketId', width: 50 },
			{ header: 'Name', key: 'name', width: 50 },
			{ header: 'Mobile', key: 'mobile', width: 20 },
			{ header: 'Email', key: 'emailId', width: 50 },
			{ header: 'Tickets', key: 'ticketCount', width: 10 },
			{ header: 'Price', key: 'amount', width: 20 }
		];

		worksheet.getRow(1).font = { bold: true, size: 12 };
		worksheet.getRow(1).alignment = { horizontal: 'center' };

		$AllTickets?.data?.alltickets?.forEach((ticket: any) => {
			worksheet.addRow({
				ticketId: ticket.ticketId,
				name: ticket.name,
				mobile: ticket.mobile,
				emailId: ticket.emailId,
				ticketCount: ticket.ticketCount,
				amount: ticket.amount
			});
		});

		worksheet.getColumn('amount').numFmt = '"₹"#,##0.00';

		worksheet.columns.forEach((column) => {
			column.alignment = { vertical: 'middle', horizontal: 'left' };
		});

		const buffer = await workbook.xlsx.writeBuffer();
		const blob = new Blob([buffer], {
			type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
		});
		const date = new Date();
		const fileName = `${$detailsQuery.data?.event.eventName}_${date.toLocaleDateString('en-GB')}.xlsx`;
		saveAs(blob, fileName);
	}

	function formatDate(date: Date) {
		return new Intl.DateTimeFormat('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric'
		}).format(date);
	}
</script>

<div class="px-12">
	{#if $detailsQuery.isLoading && $detailsQuery.isRefetching}
		<Loader class="mx-auto h-10 w-10" />
	{:else if $detailsQuery.data}
		<div class="text-maintext font-karla mx-auto mt-6 flex gap-5">
			<Button
				size="icon"
				onclick={() => {
					$manageLayoutStore.singleEventSelected = false;
					$manageLayoutStore.selectedId = '';
				}}
			>
				<Icon icon="ion:arrow-back" color="white" class="h-6 w-6" />
			</Button>
			<div class="flex flex-col gap-3">
				<div class="flex items-center gap-2">
					<h1 class="text-3xl font-bold">{$detailsQuery.data?.event.eventName}</h1>

					<h5 class="text-gray-500">{$detailsQuery.data?.event.eventId}</h5>
				</div>
				<p class="flex items-center gap-2">
					<Icon icon="tdesign:time" font-size="1rem" />
					{formatEventDate($detailsQuery.data?.event.datetime)}
				</p>

				<p class="flex items-center gap-2">
					<Icon icon="lets-icons:ticket" font-size="1rem" />
					{$detailsQuery.data?.event.availableTickets} tickets
				</p>

				<p class="flex items-center gap-2">
					<Icon icon="streamline:bag-rupee" font-size="1rem" />
					{$detailsQuery.data?.event.price} INR
				</p>
			</div>
		</div>
	{/if}
	<div class="ml-auto w-[30%]">
		<div class="relative grid gap-2">
			<div class="my-7 flex w-full justify-end gap-2">
				<Button
					class="w-[120px] text-white"
					type="submit"
					onclick={() => {
						exportToExcel();
					}}
				>
					Export
				</Button>
			</div>
			<Input
				type={'text'}
				required
				class="pr-10"
				placeholder={'Search Topics'}
				bind:value={search}
				oninput={debounceSearch}
			/>
			{#if !search}
				<Icon
					icon={'iconamoon:search'}
					class="absolute bottom-2.5 right-2 cursor-pointer text-xl text-gray-400"
				/>
			{:else}
				<Icon
					icon={'mdi:clear-outline'}
					onclick={() => {
						search = '';
						debounceSearch();
					}}
					class="absolute bottom-2.5 right-2 cursor-pointer text-xl text-gray-400"
				/>
			{/if}
		</div>
	</div>
	<Table.Root class="mt-6">
		{#if $query.isLoading}
			<Table.Caption>Loading....</Table.Caption>
		{:else if $query?.data?.total === 0}
			<TableCaption class="w-full text-center text-xs">No Users Found!</TableCaption>
		{/if}
		<Table.Header>
			<Table.Row class="">
				<Table.Head class="w-[100px]">Sl.No</Table.Head>
				<Table.Head>User Name</Table.Head>
				<Table.Head>Mobile</Table.Head>
				<Table.Head class="">Email</Table.Head>
				<Table.Head class="">Ticket Id</Table.Head>
				<Table.Head>Tickets</Table.Head>
				<Table.Head>Price</Table.Head>
				<!-- <Table.Head class="">Date</Table.Head> -->
				<Table.Head>Download</Table.Head>
			</Table.Row>
		</Table.Header>
		<Table.Body>
			{#each $query.data?.ticketusers || [] as ticket, i}
				<Table.Row>
					<Table.Cell>{i + 1 + (page - 1) * limit}</Table.Cell>
					<Table.Cell class="cursor-pointer capitalize hover:underline">
						{ticket.userId?.name}
					</Table.Cell>
					<Table.Cell class="flex items-center capitalize">
						{ticket.userId?.mobile}</Table.Cell
					>
					<Table.Cell>
						{ticket.userId?.email}
					</Table.Cell>
					<Table.Cell>
						{ticket?.tickets?.ticketId}
					</Table.Cell>
					<Table.Cell>
						{ticket?.ticketCount}
					</Table.Cell>
					<Table.Cell>
						{ticket?.amount}
					</Table.Cell>
					<!-- <Table.Cell>
						{formatDate(new Date(ticket?.createdAt))}
					</Table.Cell> -->
					<Table.Cell class="flex gap-2">
						<button
							onclick={() => {
								window.open(baseUrl + '/admin/generatepdf?id=' + ticket._id);
							}}
						>
							<Icon icon={'bytesize:download'} class="text-xl hover:text-red-500" />
						</button>
					</Table.Cell>
				</Table.Row>
			{/each}
		</Table.Body>
	</Table.Root>
	{#if !$query.isLoading && $query?.data?.total > 0}
		<Paginator
			total={$query?.data?.total || 0}
			{limit}
			{page}
			callback={(_page: any) => {
				if (_page === page) return;
				page = _page;
				$query.refetch();
			}}
		/>
		<!-- {:else}
			<p class="text-center text-xs">No Managers Found!</p> -->
	{/if}
</div>
