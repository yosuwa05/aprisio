<script lang="ts">
	import { _axios } from '$lib/_axios';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select/index';
	import { Textarea } from '$lib/components/ui/textarea';
	import { queryClient } from '$lib/query-client';
	import { createMutation, createQuery } from '@tanstack/svelte-query';
	import { toast } from 'svelte-sonner';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { _subTopicsSchema, subTopicsStore } from './subtopics-store';

	let edit = $state(false);
	let image = $state(null);
	let elem: any = null;

	$effect(() => {
		edit = $subTopicsStore.mode == 'create' && $subTopicsStore.id ? true : false;

		elem = document.getElementById('image') as HTMLInputElement | null;
	});

	async function fetchTopics() {
		const { data } = await _axios.get('/topics/select');
		return data;
	}

	const topicQuery = createQuery({
		queryKey: ['topics select'],
		queryFn: () => fetchTopics()
	});

	const createSubtopicMutation = createMutation({
		mutationFn: (data: any) =>
			edit
				? _axios.put(`/subtopic/${$subTopicsStore.id}`, data)
				: _axios.post('/subtopic/create', data),
		onSuccess({ data }) {
			if (!data.ok) {
				toast(data.message);
				return;
			}

			queryClient.refetchQueries({
				queryKey: ['subtopic fetch']
			});
			if (elem) elem.value = '';
			$subTopicsStore.mode = 'list';
			reset();
			toast(edit ? 'Subtopic Updated ✅' : 'Subtopic Created ✅');
		},
		onError(error, variables, context) {
			console.error('onError', error, variables, context);
		}
	});
	const { form, errors, enhance, constraints, reset, validateForm } = superForm(
		defaults(zod(_subTopicsSchema)),
		{
			SPA: true,
			validationMethod: 'oninput',
			validators: zod(_subTopicsSchema),
			clearOnSubmit: 'none',
			invalidateAll: false,
			resetForm: false,
			async onSubmit() {
				const { valid } = await validateForm({
					focusOnError: true
				});

				if (!valid) return;

				let formData = new FormData();

				if (image) {
					formData.append('file', image);
				}
				formData.append('subTopicName', $form.subTopicName);
				formData.append('topic', $form.topic);
				formData.append('description', $form.description);
				$createSubtopicMutation.mutate(formData);
			}
		}
	);

	$effect(() => {
		if (edit) {
			$form.subTopicName = $subTopicsStore.topicName;
			$form.topic = $subTopicsStore.topic;
			$form.description = $subTopicsStore.description;
		} else {
			$form.subTopicName = '';
			$form.topic = '';
			$form.description = '';
			image = null;
		}
	});

	function handleFileSelect(event: any) {
		const file = event.target.files[0];

		// if (file.size > 51200) {
		// 	toast.error('File size is too large! Max size is 50KB');

		// 	if (elem) elem.value = '';

		// 	return;
		// }

		// const img = new Image();
		// img.src = URL.createObjectURL(file);

		// img.onload = () => {
		// 	const { width, height } = img;

		// 	if (width > 35 || height > 35) {
		// 		toast.error('image dimensions must below 35x35 pixels.');
		// 		if (elem) elem.value = '';
		// 		return;
		// 	}

		// 	image = file;
		// };

		image = file;
	}
</script>

<div class="text-maintext mx-auto max-w-[80%]">
	<form method="POST" use:enhance class="grid grid-cols-2 gap-4 py-4">
		<div>
			<Label>Subtopic Name</Label>
			<Input
				class="mt-1 pr-10"
				placeholder="Ex:  technology"
				aria-invalid={$errors.subTopicName ? 'true' : undefined}
				bind:value={$form.subTopicName}
				{...$constraints.subTopicName}
			/>

			{#if $errors.subTopicName}<span class="invalid text-xs text-red-500"
					>{$errors.subTopicName}</span
				>{/if}
		</div>

		<div>
			<Label for="category">Topic</Label>

			<Select.Root
				type="single"
				name="category"
				bind:value={$form.topic}
				onValueChange={(value) => {
					$form.topic = value;
				}}
			>
				<Select.Trigger class="mt-1 pr-10">
					{$form.topic
						? $form.topic.includes(' -&- ')
							? $form.topic.split(' -&- ')[1]
							: $form.topic
						: 'Select Topic'}
				</Select.Trigger>
				<Select.Content>
					<Select.Group>
						<Select.GroupHeading>Categories</Select.GroupHeading>
						{#each $topicQuery.data?.topics || [] as topic}
							<Select.Item value={`${topic._id} -&- ${topic.topicName}`} label={topic.topicName}
								>{topic.topicName}</Select.Item
							>
						{/each}
					</Select.Group>
				</Select.Content>
			</Select.Root>
		</div>

		<div class="col-span-2">
			<Label for="image">Image</Label>
			<Input
				id="image"
				required={edit ? false : true}
				class="mt-1 pr-10 text-black placeholder:text-gray-400"
				type="file"
				accept=".jpg, .jpeg, .png, .webp"
				onchange={handleFileSelect}
			/>
		</div>

		<div class="col-span-2">
			<Label>Description</Label>
			<Textarea
				class="mt-1 pr-10"
				placeholder="Ex:  Science & Technology"
				aria-invalid={$errors.description ? 'true' : undefined}
				bind:value={$form.description}
				{...$constraints.description}
			/>

			{#if $errors.description}<span class="invalid text-xs text-red-500"
					>{$errors.description}</span
				>{/if}
		</div>

		<Button class="w-[40%] text-white" type="submit" disabled={$createSubtopicMutation.isPending}>
			{edit ? 'Update' : $createSubtopicMutation.isPending ? 'Creating...' : 'Create'}
		</Button>
	</form>
</div>
