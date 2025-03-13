<script lang="ts">
	import { _axios } from '$lib/_axios';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select/index';
	import { queryClient } from '$lib/query-client';
	import type { DateValue } from '@internationalized/date';
	import { createMutation } from '@tanstack/svelte-query';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { _topicsSchema, eventsStore } from './events-store';
	let edit = $state(false);
	$effect(() => {
		edit = $eventsStore.mode == 'create' && $eventsStore.id ? true : false;
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

	let selectedDate: any = $state<DateValue | any>();
	let contentRef = $state<HTMLElement | null>(null);
	let file = $state<any>(null);

	const createManagerMutation = createMutation({
		mutationFn: (data: any) =>
			edit ? _axios.put(`/events/${$eventsStore.id}`, data) : _axios.post('/events/create', data),
		onSuccess({}) {
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
			selectedDate = undefined;

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
					organiserName: $form.organiserName,
					biography: $form.biography,
					mapLink: $form.mapLink,
					expirydatetime: $form.expirydatetime,
					location: $form.location,
					eventType: $form.eventType,
					price: $form.price,
					availableTickets: $form.availableTickets,
					eventRules: rules.map((rule) => ({
						heading: rule.heading,
						subHeading: rule.subHeading
					}))
				};

				const { valid } = await validateForm({
					focusOnError: true
				});

				if (!valid) return;
				// if (!selectedDate) return toast.error('Please select a date');
				if (!file) return toast.error('Please select an image');

				// for (let i = 0; i < rules.length; i++) {
				// 	if (rules[i].heading == '' || rules[i].subHeading == '') {
				// 		return toast.error('Please fill all the fields in the rule section');
				// 	}
				// }

				const content = quill.root.innerHTML;

				let formData = new FormData();

				formData.append('eventName', _data.eventName);
				formData.append('datetime', JSON.stringify(_data.datetime));
				formData.append('expirydatetime', JSON.stringify(_data.expirydatetime));
				formData.append('organiserName', _data.organiserName);
				formData.append('biography', _data.biography);
				formData.append('mapLink', _data.mapLink);
				formData.append('location', _data.location);
				formData.append('eventImage', file);
				formData.append('eventType', _data.eventType);
				formData.append('price', _data.price);
				formData.append('availableTickets', _data.availableTickets);
				// formData.append('eventRules', JSON.stringify(rules));
				formData.append('description', content);
				console.log(_data);
				$createManagerMutation.mutate(formData);
			}
		}
	);

	$effect(() => {
		if (edit) {
			$form.eventName = $eventsStore.eventName;
		} else {
			$form.eventName = '';
		}
	});

	function addRule() {
		rules = [...rules, { heading: '', subHeading: '' }];
	}

	function deleteRule(index: number) {
		if (rules.length > 1) {
			rules = rules.filter((_, i) => i !== index);
		}
	}
</script>

<svelte:head>
	<link href="https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css" rel="stylesheet" />
</svelte:head>

<div class="text-maintext no-scrollbar mx-auto h-[calc(100vh-200px)] max-w-[80%] overflow-y-auto">
	<form method="POST" use:enhance class="">
		<div class="grid grid-cols-2 gap-4 py-2">
			<div>
				<Label>Date and Time</Label>
				<Input
					class="mt-1 pr-10"
					type="datetime-local"
					aria-invalid={$errors.datetime ? 'true' : undefined}
					bind:value={$form.datetime}
					{...$constraints.datetime}
				/>

				{#if $errors.datetime}<span class="invalid text-xs text-red-500">{$errors.datetime}</span
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
		</div>

		<!-- <div class="mt-1">
			<Label>Event Date</Label>

			<div>
				<Popover.Root>
					<Popover.Trigger
						class={cn(
							buttonVariants({
								variant: 'outline',
								class: 'w-full justify-start text-left font-normal'
							}),
							!selectedDate && 'text-muted-foreground'
						)}
					>
						{selectedDate || 'Select Date'}
					</Popover.Trigger>
					<Popover.Content bind:ref={contentRef} class="w-auto p-0">
						<Calendar type="single" bind:value={selectedDate} />
					</Popover.Content>
				</Popover.Root>
			</div>
		</div> -->
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
		</div>

		<div class="grid grid-cols-2 gap-3 py-2">
			<div>
				<Label>Price</Label>
				<Input
					class="mt-1 pr-10"
					type="number"
					aria-invalid={$errors.price ? 'true' : undefined}
					bind:value={$form.price}
					{...$constraints.price}
				/>

				{#if $errors.price}<span class="invalid text-xs text-red-500">{$errors.price}</span>{/if}
			</div>
			<div>
				<Label>Expiry Date</Label>
				<Input
					class="mt-1 pr-10"
					type="datetime-local"
					aria-invalid={$errors.expirydatetime ? 'true' : undefined}
					bind:value={$form.expirydatetime}
					{...$constraints.expirydatetime}
				/>

				{#if $errors.expirydatetime}<span class="invalid text-xs text-red-500"
						>{$errors.expirydatetime}</span
					>{/if}
			</div>
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
		</div>

		<div class="grid grid-cols-2 gap-4 py-2">
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
		</div>

		<div class="grid grid-cols-2 gap-4 py-2">
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
		</div>

		<div class="col-span-2 flex items-center justify-between">
			<div class="h-[30px] p-2">Event Notes</div>
		</div>
		<!-- <div class="no-scrollbar h-[150px] overflow-y-scroll">
			{#each rules as rule, index}
				<div class="col-span-2 mb-2 flex items-center gap-4">
					<Input class="mt-1 flex-1 pr-10" placeholder="Rule Heading" bind:value={rule.heading} />
					<Input
						class="mt-1 flex-1 pr-10"
						placeholder="Rule Subheading"
						bind:value={rule.subHeading}
					/>

					{#if index == 0}
						<Button type="button" variant="outline" onclick={addRule} class="w-[40px]">
							<Plus />
						</Button>
					{/if}

					{#if index > 0}
						<Button
							type="button"
							variant="outline"
							onclick={() => deleteRule(index)}
							class="w-[40px]"
						>
							<Delete />
						</Button>
					{/if}
				</div>
			{/each}
		</div> -->
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
