<script lang="ts">
	import { _axios } from '$lib/_axios';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { queryClient } from '$lib/query-client';
	import { createMutation } from '@tanstack/svelte-query';
	import { toast } from 'svelte-sonner';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { _topicsSchema, type CreateTopicsData, topicsStore } from './topics-store';

	let edit = $state(false);
	$effect(() => {
		edit = $topicsStore.mode == 'create' && $topicsStore.id ? true : false;
	});

	const createManagerMutation = createMutation({
		mutationFn: (data: CreateTopicsData) =>
			edit ? _axios.put(`/topics/${$topicsStore.id}`, data) : _axios.post('/topics/create', data),
		onSuccess({}) {
			queryClient.refetchQueries({
				queryKey: ['topics fetch']
			});
			$topicsStore.mode = 'list';
			toast(edit ? 'Topics Updated ✅' : 'Topics Created ✅');
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
				let _data: CreateTopicsData = {
					topicName: $form.topicName
				};

				const { valid } = await validateForm({
					focusOnError: true
				});

				if (!valid) return;
				$createManagerMutation.mutate(_data);
			}
		}
	);

	$effect(() => {
		if (edit) {
			$form.topicName = $topicsStore.topicName;
		} else {
			$form.topicName = '';
		}
	});
</script>

<div class="text-maintext mx-auto max-w-[80%]">
	<form method="POST" use:enhance class="grid grid-cols-2 gap-4 py-4">
		<div>
			<Label>Community Name</Label>
			<Input
				class="mt-1 pr-10"
				placeholder="Ex: Science & Technology"
				aria-invalid={$errors.topicName ? 'true' : undefined}
				bind:value={$form.topicName}
				{...$constraints.topicName}
			/>

			{#if $errors.topicName}<span class="invalid text-xs text-red-500">{$errors.topicName}</span
				>{/if}
		</div>

		<div></div>

		<Button class="w-[40%] text-white" type="submit" disabled={$createManagerMutation.isPending}>
			{edit ? 'Update' : $createManagerMutation.isPending ? 'Creating...' : 'Create'}
		</Button>
	</form>
</div>
