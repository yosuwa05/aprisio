<script lang="ts">
	import { _axios } from '$lib/_axios';
	import { Button, buttonVariants } from '$lib/components/ui/button';
	import { Calendar } from '$lib/components/ui/calendar';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Popover from '$lib/components/ui/popover';
	import { queryClient } from '$lib/query-client';
	import { cn } from '$lib/utils';
	import type { DateValue } from '@internationalized/date';
	import { createMutation } from '@tanstack/svelte-query';
	import { Delete, Plus } from 'lucide-svelte';
	import { toast } from 'svelte-sonner';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { _topicsSchema, eventsStore } from './events-store';

	let edit = $state(false);
	$effect(() => {
		edit = $eventsStore.mode == 'create' && $eventsStore.id ? true : false;
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
					date: selectedDate,
					location: $form.location,
					eventRules: rules.map((rule) => ({
						heading: rule.heading,
						subHeading: rule.subHeading
					}))
				};

				const { valid } = await validateForm({
					focusOnError: true
				});

				if (!valid) return;
				if (!selectedDate) return toast.error('Please select a date');
				if (!file) return toast.error('Please select an image');

				for (let i = 0; i < rules.length; i++) {
					if (rules[i].heading == '' || rules[i].subHeading == '') {
						return toast.error('Please fill all the fields in the rule section');
					}
				}

				let formData = new FormData();

				formData.append('eventName', _data.eventName);
				formData.append('date', JSON.stringify(_data.date));
				formData.append('location', _data.location);
				formData.append('eventImage', file);
				formData.append('eventRules', JSON.stringify(rules));

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

<div class="text-maintext mx-auto max-w-[80%]">
	<form method="POST" use:enhance class="grid grid-cols-2 gap-4 py-4">
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

		<div class="mt-1">
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
			<Label>Event Image</Label>
			<Input
				class="mt-1 pr-10"
				type="file"
				id="file"
				onchange={(e: any) => (file = e.target.files[0])}
				accept="image/*"
			/>
		</div>

		<div class="col-span-2 flex items-center justify-between">
			<div class="h-[30px] p-2">Event Rules</div>
		</div>
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

		<Button class="w-[40%] text-white" type="submit" disabled={$createManagerMutation.isPending}>
			{edit ? 'Update' : $createManagerMutation.isPending ? 'Creating...' : 'Create'}
		</Button>
	</form>
</div>
