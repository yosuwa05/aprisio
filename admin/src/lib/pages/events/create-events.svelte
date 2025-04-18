<script lang="ts">
	import { _axios } from '$lib/_axios';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select/index';
	import { queryClient } from '$lib/query-client';
	import { createMutation } from '@tanstack/svelte-query';
	import { format, parseISO } from 'date-fns';
	import { formatInTimeZone } from 'date-fns-tz';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import DatePicker from 'svelty-picker';
	import { _topicsSchema, eventsStore } from './events-store';
	import { Switch } from '$lib/components/ui/switch';
	// 2025-03-07 03:30 am

	let edit = $state(false);
	$effect(() => {
		edit = $eventsStore.mode == 'create' && $eventsStore.id ? true : false;
	});

	$effect(() => {
		console.log($form.datetime);
	});

	let quill = $state<any>(null);
	let loading = $state<boolean>(true);

	onMount(() => {
		const script = document.createElement('script');
		script.src = 'https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.js';
		loading = false;
		script.onload = () => {
			quill = new (window as any).Quill('#editor', {
				theme: 'snow'
			});
		};
		document.body.appendChild(script);
	});

	let rules = $state([
		{
			heading: '',
			subHeading: ''
		}
	]);

	let contentRef = $state<HTMLElement | null>(null);
	let file = $state<any>(null);

	const createManagerMutation = createMutation({
		mutationFn: (data: any) =>
			edit ? _axios.put(`/events/${$eventsStore.id}`, data) : _axios.post('/events/create', data),
		onSuccess() {
			queryClient.refetchQueries({
				queryKey: ['events fetch']
			});
			$eventsStore.mode = 'list';
			toast(edit ? 'Event Updated ✅' : 'Event Created ✅');
			let elem: any = document.getElementById('file');

			file = null;
			rules = [
				{
					heading: '',
					subHeading: ''
				}
			];

			if (elem) elem.value = '';
			if (quill) {
				quill.setContents([]);
			}
			reset();
		},
		onError(error, variables, context) {
			console.error('onError', error, variables, context);
		}
	});
	const { form, errors, enhance, constraints, reset, validateForm } = superForm(
		defaults(zod(_topicsSchema)),
		{
			SPA: true,
			validationMethod: 'oninput',
			validators: zod(_topicsSchema),
			clearOnSubmit: 'none',
			invalidateAll: false,
			resetForm: false,
			async onSubmit({}) {
				let _data: any = {
					eventName: $form.eventName,
					datetime: $form.datetime,
					enddatetime: $form.enddatetime,
					organiserName: $form.organiserName,
					biography: $form.biography,
					mapLink: $form.mapLink,
					gst: $form.gst,
					duration: $form.duration,
					expirydatetime: $form.expirydatetime,
					location: $form.location,
					eventType: $form.eventType,
					price: $form.price,
					strikePrice: $form.strikePrice,
					availableTickets: $form.availableTickets,
					isEventActivated: $form.isEventActivated,
					eventRules: rules.map((rule) => ({
						heading: rule.heading,
						subHeading: rule.subHeading
					}))
				};
				const { valid } = await validateForm({
					focusOnError: true
				});

				if (!valid) return;
				if (!file && !edit) return toast.error('Please select an image');

				const content = quill.root.innerHTML;

				let formData = new FormData();
				console.log(_data.isEventActivated);
				formData.append('eventName', _data.eventName);
				formData.append('datetime', _data.datetime);
				formData.append('enddatetime', _data.enddatetime);
				formData.append('expirydatetime', _data.expirydatetime);
				formData.append('organiserName', _data.organiserName);
				formData.append('biography', _data.biography);
				formData.append('mapLink', _data.mapLink);
				formData.append('gst', _data.gst);
				formData.append('duration', _data.duration);
				formData.append('location', _data.location);
				formData.append('isEventActivated', JSON.stringify(_data.isEventActivated));
				if (file) {
					formData.append('eventImage', file);
				}

				if (quill) {
					const delta = JSON.stringify(quill.getContents());
					formData.append('delta', delta);
				}
				formData.append('eventType', _data.eventType);
				formData.append('price', _data.price);
				formData.append('strikePrice', _data.strikePrice);

				formData.append('availableTickets', _data.availableTickets);

				formData.append('description', content);

				$createManagerMutation.mutate(formData);
			}
		}
	);
	$effect(() => {
		if (edit) {
			$form.eventName = $eventsStore.eventName;
			const starttime = parseISO($eventsStore.datetime);
			$form.datetime = formatInTimeZone(starttime, 'UTC', 'yyyy-MM-dd h:mm a');

			const endtime = parseISO($eventsStore.enddatetime);
			$form.enddatetime = formatInTimeZone(endtime, 'UTC', 'yyyy-MM-dd h:mm a');

			const bookingexpiry = parseISO($eventsStore.expirydatetime);
			$form.expirydatetime = formatInTimeZone(bookingexpiry, 'UTC', 'yyyy-MM-dd h:mm a');
			$form.location = $eventsStore.location;
			$form.price = $eventsStore.price;
			$form.availableTickets = $eventsStore.availableTickets;
			$form.mapLink = $eventsStore.mapLink;
			$form.gst = $eventsStore.gst;
			$form.duration = $eventsStore.duration;
			$form.organiserName = $eventsStore.organiserName;
			$form.biography = $eventsStore.biography;
			$form.description = $eventsStore.description;
			$form.isEventActivated = $eventsStore.isEventActivated;
			$form.strikePrice = $eventsStore.strikePrice;

			if (quill && $eventsStore.delta) {
				quill.setContents(JSON.parse($eventsStore.delta));
			}
		} else {
			$form.eventName = '';
			$form.datetime = '';
			$form.enddatetime = '';
			$form.location = '';
			$form.price = '';
			$form.strikePrice = '';
			$form.availableTickets = '';
			$form.mapLink = '';
			$form.gst = '';
			$form.duration = '';
			$form.expirydatetime = '';
			$form.organiserName = '';
			$form.biography = '';
			$form.description = '';
			$form.isEventActivated = true;

			if (quill) {
				quill.setContents([]);
			}
		}
	});
</script>

<svelte:head>
	<link href="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css" rel="stylesheet" />
</svelte:head>

<div class="text-maintext no-scrollbar mx-auto h-[calc(100vh-200px)] max-w-[80%] overflow-y-auto">
	<form method="POST" use:enhance class="">
		<div class="grid grid-cols-2 gap-4 py-2">
			<div>
				<Label>Event Name</Label>
				<Input
					class="mt-1 pr-10"
					placeholder="Ex: tech talk"
					aria-invalid={$errors.eventName ? 'true' : undefined}
					bind:value={$form.eventName}
					{...$constraints.eventName}
				/>

				{#if $errors.eventName}<span class="invalid text-xs text-red-500">{$errors.eventName}</span
					>{/if}
			</div>
			<div>
				<Label>Location</Label>
				<Input
					class="mt-1 pr-10"
					placeholder="Ex: Tamilnadu"
					aria-invalid={$errors.location ? 'true' : undefined}
					bind:value={$form.location}
					{...$constraints.location}
				/>

				{#if $errors.location}<span class="invalid text-xs text-red-500">{$errors.location}</span
					>{/if}
			</div>

			<div>
				<Label>Available Tickets</Label>
				<Input
					class="mt-1 pr-10"
					type="number"
					aria-invalid={$errors.availableTickets ? 'true' : undefined}
					bind:value={$form.availableTickets}
					{...$constraints.availableTickets}
				/>

				{#if $errors.availableTickets}<span class="invalid text-xs text-red-500"
						>{$errors.availableTickets}</span
					>{/if}
			</div>

			<div>
				<Label>Price</Label>
				<Input class="mt-1 pr-10" type="number" bind:value={$form.price} />

				<!-- {#if $errors.price}<span class="invalid text-xs text-red-500">{$errors.price}</span>{/if} -->
			</div>
			<div>
				<Label>Gst</Label>
				<Input
					class="mt-1 pr-10"
					type="number"
					min="0"
					max="100"
					aria-invalid={$errors.gst ? 'true' : undefined}
					bind:value={$form.gst}
					{...$constraints.gst}
				/>

				{#if $errors.gst}<span class="invalid text-xs text-red-500">{$errors.gst}</span>{/if}
			</div>
			<div>
				<Label>Strike Price</Label>
				<Input
					class="mt-1 pr-10"
					type="number"
					aria-invalid={$errors.strikePrice ? 'true' : undefined}
					bind:value={$form.strikePrice}
					{...$constraints.strikePrice}
				/>

				{#if $errors.strikePrice}<span class="invalid text-xs text-red-500"
						>{$errors.strikePrice}</span
					>{/if}
			</div>
		</div>

		<div class="grid grid-cols-2 gap-3 py-2">
			<div>
				<Label for="datetime">Start Date and Time</Label>
				<div class="w-full">
					<DatePicker
						bind:value={$form.datetime}
						format="yyyy-mm-dd HH:ii P"
						formatType="standard"
						displayFormat="yyyy-mm-dd HH:ii P"
						placeholder={edit ? $form.datetime : 'Select Date and Time'}
						displayFormatType="standard"
						inputClasses={`bg-[#fefae4] text-black! w-full text-xs p-4 border bg-transparent border-none outline-none border-input bg-background ring-offset-background placeholder:text-muted-foreground flex h-10 w-full rounded-md border px-3 py-2 text-base ${edit ? 'font-black' : ''} placeholder:`}
					/>
				</div>
				{#if $errors.datetime}
					<span class="error">{$errors.datetime}</span>
				{/if}
			</div>
			<div>
				<Label for="enddatetime">End Date and Time</Label>
				<div class="w-full">
					<DatePicker
						bind:value={$form.enddatetime}
						format="yyyy-mm-dd HH:ii P"
						formatType="standard"
						displayFormat="yyyy-mm-dd HH:ii P"
						placeholder={edit ? $form.enddatetime : 'Select Date and Time'}
						displayFormatType="standard"
						inputClasses={`bg-[#fefae4] text-black! w-full text-xs p-4 border bg-transparent border-none outline-none border-input bg-background ring-offset-background placeholder:text-muted-foreground flex h-10 w-full rounded-md border px-3 py-2 text-base ${edit ? 'font-black' : ''} placeholder:`}
					/>
				</div>
				{#if $errors.enddatetime}
					<span class="error">{$errors.enddatetime}</span>
				{/if}
			</div>
			<div>
				<Label>Booking Expiry Date and Time</Label>

				<DatePicker
					bind:value={$form.expirydatetime}
					format="yyyy-mm-dd hh:ii p"
					formatType="standard"
					displayFormat="yyyy-mm-dd hh:ii p"
					placeholder={edit ? $form.expirydatetime : 'Select Date and Time'}
					displayFormatType="standard"
					inputClasses={`bg-[#fefae4] text-black!  w-full text-xs p-4 border bg-transparent border-none outline-none border-input bg-background ring-offset-background placeholder:text-muted-foreground flex h-10 w-full rounded-md border px-3 py-2 text-base ${edit ? 'font-black' : ''} placeholder:`}
				/>
				{#if $errors.expirydatetime}<span class="invalid text-xs text-red-500"
						>{$errors.expirydatetime}</span
					>{/if}
			</div>
			<div class="flex flex-col gap-2">
				<Label>Event Status</Label>
				<div class="flex items-center space-x-2 pt-2">
					<Switch
						id="event-active"
						checked={$form.isEventActivated}
						onCheckedChange={(checked) => ($form.isEventActivated = checked)}
					/>
					<Label for="event-active" class="cursor-pointer">
						{$form.isEventActivated ? 'Event Enabled' : 'Event Disabled'}
					</Label>
				</div>
			</div>
		</div>

		<div class="grid grid-cols-2 gap-4 py-2">
			<div>
				<Label>Map Link</Label>
				<Input
					class="mt-1 pr-10"
					type="text"
					aria-invalid={$errors.mapLink ? 'true' : undefined}
					bind:value={$form.mapLink}
					{...$constraints.mapLink}
				/>

				{#if $errors.mapLink}<span class="invalid text-xs text-red-500">{$errors.mapLink}</span
					>{/if}
			</div>

			<div>
				<Label>Organiser Name</Label>
				<Input
					class="mt-1 pr-10"
					placeholder="Ex: tech talk"
					aria-invalid={$errors.organiserName ? 'true' : undefined}
					bind:value={$form.organiserName}
					{...$constraints.organiserName}
				/>

				{#if $errors.organiserName}<span class="invalid text-xs text-red-500"
						>{$errors.organiserName}</span
					>{/if}
			</div>
			<div>
				<Label>Biography</Label>
				<Input
					class="mt-1 pr-10"
					type="text"
					aria-invalid={$errors.biography ? 'true' : undefined}
					bind:value={$form.biography}
					{...$constraints.biography}
				/>

				{#if $errors.biography}<span class="invalid text-xs text-red-500">{$errors.biography}</span
					>{/if}
			</div>

			<div>
				<Label>Event Image</Label>
				<Input
					class="mt-1 pr-10"
					type="file"
					id="file"
					onchange={(e: any) => (file = e.target.files[0])}
					accept="image/*"
				/>
			</div>
		</div>

		<div class="grid grid-cols-2 gap-4 py-2">
			<div>
				<Label>Event Type</Label>
				<Select.Root
					type="single"
					name="category"
					bind:value={$form.eventType}
					onValueChange={(value: any) => {
						$form.eventType = value;
					}}
				>
					<Select.Trigger class="mt-1 pr-10 capitalize">
						{$form.eventType ? $form.eventType : 'Select Event Type'}
					</Select.Trigger>
					<Select.Content>
						<Select.Group>
							<Select.Item value="online">Online</Select.Item>
							<Select.Item value="offline">Offline</Select.Item>
						</Select.Group>
					</Select.Content>
				</Select.Root>

				{#if $errors.eventType}<span class="invalid text-xs text-red-500">{$errors.eventType}</span
					>{/if}
			</div>
			<div>
				<Label>Duration of the Event (Hours)</Label>
				<Input
					class="mt-1 pr-10"
					type="number"
					step="0.01"
					aria-invalid={$errors.duration ? 'true' : undefined}
					bind:value={$form.duration}
					{...$constraints.duration}
				/>

				{#if $errors.duration}<span class="invalid text-xs text-red-500">{$errors.duration}</span
					>{/if}
			</div>
		</div>

		<div class="col-span-2 flex items-center justify-between">
			<div class="h-[30px] p-2">Event Notes</div>
		</div>

		<div id="editor" class="overflow-y-auto"></div>
		<div class="my-7 flex w-full justify-end gap-2">
			<Button
				class="w-[120px] text-white"
				type="submit"
				disabled={$createManagerMutation.isPending}
			>
				{edit ? 'Update' : $createManagerMutation.isPending ? 'Creating...' : 'Create'}
			</Button>
		</div>
	</form>
</div>

<style>
	#editor {
		height: 500px;
		overflow: hidden;
	}

	#editor .ql-editor {
		height: 100%;
		overflow-y: auto;
	}
</style>
