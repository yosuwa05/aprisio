<script lang="ts">
	import { _axios } from '$lib/_axios';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { updateAdminData } from '$lib/stores/global-store';
	import { Eye, EyeOff } from 'lucide-svelte';
	import { onMount } from 'svelte';
	import { toast } from 'svelte-sonner';
	import { defaults, superForm } from 'sveltekit-superforms';
	import { zod } from 'sveltekit-superforms/adapters';
	import { z } from 'zod';

	// Define schema for the form
	export const _settingsSchema = z.object({
		name: z.string({ message: 'Name is required' }),
		email: z.string().email({ message: 'Enter a valid email address' }),
		password: z.string({ message: 'Password is required' }),
		profileImage: z.instanceof(File).optional()
	});

	type SettingsData = z.infer<typeof _settingsSchema>;

	let showPassword = false;
	let editMode = false;
	let previewImage: string | undefined; // Store the profile image preview URL
	let ImageUploaded = false;
	const { form, errors, enhance, constraints, reset } = superForm(defaults(zod(_settingsSchema)), {
		SPA: true,
		validationMethod: 'oninput',
		validators: zod(_settingsSchema),
		clearOnSubmit: 'none',
		invalidateAll: false,
		resetForm: false,
		onSubmit: async () => {
			try {
				const adminData = localStorage.getItem('admin');
				if (!adminData) {
					console.error('Admin data not found in localStorage');
					return;
				}

				const parsedAdminData = JSON.parse(adminData);
				const Id = parsedAdminData._id;

				if (!Id) {
					console.error('User ID not found in admin data');
					return;
				}

				const payload: FormData = new FormData();
				payload.append('name', $form.name);
				payload.append('email', $form.email);
				payload.append('password', $form.password);

				if ($form.profileImage) {
					payload.append('profileImage', $form.profileImage);
				}

				const response = await _axios.put(`/admin/${Id}`, payload, {
					headers: {
						'Content-Type': 'multipart/form-data'
					}
				});

				if (response.status === 200) {
					console.log('Form successfully submitted:', response.data);
					toast.success('Details updated successfully!');
					editMode = false;
					showPassword = false;
					ImageUploaded = false;
					const updatedAdminData = {
						...response.data.data
					};
					updateAdminData(updatedAdminData);
					localStorage.setItem('admin', JSON.stringify(updatedAdminData));
				} else {
					console.error('Failed to update settings:', response.data);
					toast.error('Failed to update details.');
				}
			} catch (error) {
				console.error('Error during form submission:', error);
				toast.error('An error occurred while updating settings.');
			}
		}
	});

	async function fetchUser(id: string) {
		const res = await _axios.get(`/admin/${id}`);
		return res.data;
	}

	onMount(async () => {
		const adminData = localStorage.getItem('admin');
		if (!adminData) {
			console.error('Admin data not found in localStorage');
			return;
		}

		const parsedAdminData = JSON.parse(adminData);

		const Id = parsedAdminData._id;

		if (!Id) {
			console.error('User ID not found in admin data');
			return;
		}

		try {
			const data = await fetchUser(Id);

			if (data) {
				// Populate the form with fetched data
				$form.name = data.user.name || '';
				$form.email = data.user.email || '';
				$form.password = data.user.password || '';
				if (data.user.profileImage) {
					previewImage = data.user.profileImage; // If the profile image exists, set the preview URL
				}
			}
		} catch (error) {
			console.error('Failed to fetch user data:', error);
		}
	});

	function toggleEditMode() {
		editMode = !editMode;
		if (!editMode) {
			previewImage = undefined;
		}
	}
</script>

<div class="text-maintext m-auto max-w-[50%] pl-[10%]">
	<form method="POST" use:enhance class="grid gap-4 py-4">
		<!-- Name -->
		<div>
			<Label for="name">Name</Label>
			<Input
				id="name"
				autocomplete="name"
				class="mt-1 pr-10"
				placeholder="Enter name"
				aria-invalid={$errors.name ? 'true' : undefined}
				bind:value={$form.name}
				{...$constraints.name}
				readonly={!editMode}
				disabled={!editMode}
			/>
			{#if $errors.name}
				<span class="invalid text-xs text-red-500">{$errors.name}</span>
			{/if}
		</div>

		<!-- Email -->
		<div>
			<Label for="email">Email</Label>
			<Input
				id="email"
				type="email"
				autocomplete="email"
				class="mt-1 pr-10"
				placeholder="Enter email"
				aria-invalid={$errors.email ? 'true' : undefined}
				bind:value={$form.email}
				{...$constraints.email}
				readonly={!editMode}
				disabled={!editMode}
			/>
			{#if $errors.email}
				<span class="invalid text-xs text-red-500">{$errors.email}</span>
			{/if}
		</div>

		<!-- Password -->
		<div class="relative">
			<Label for="password">Password</Label>
			<Input
				id="password"
				type={showPassword ? 'text' : 'password'}
				autocomplete="current-password"
				class="mt-1 pr-10"
				placeholder="Enter password"
				aria-invalid={$errors.password ? 'true' : undefined}
				bind:value={$form.password}
				{...$constraints.password}
				readonly={!editMode}
				disabled={!editMode}
			/>
			<button
				type="button"
				class="absolute right-2 top-[58%]"
				on:click={() => (showPassword = !showPassword)}
				disabled={!editMode}
			>
				{#if showPassword}
					<EyeOff class="h-4 w-4 text-gray-600 hover:text-gray-800" />
				{:else}
					<Eye class="h-4 w-4 text-gray-600 hover:text-gray-800" />
				{/if}
			</button>
			{#if $errors.password}
				<span class="invalid text-xs text-red-500">{$errors.password}</span>
			{/if}
		</div>

		<!-- Profile Picture -->
		<div>
			<Label for="profileImage">Profile Picture</Label>
			<Input
				id="profileImage"
				type="file"
				accept="image/*"
				onchange={(event) => {
					const input = event.target as HTMLInputElement;
					if (input?.files?.[0]) {
						const file = input.files[0];
						$form.profileImage = file;
						previewImage = URL.createObjectURL(file);
					}
					ImageUploaded = true;
				}}
				class="text-muted-foreground mt-1"
				readonly={!editMode}
				disabled={!editMode}
			/>

			{#if $errors.profileImage}
				<span class="invalid text-xs text-red-500">{$errors.profileImage}</span>
			{/if}
		</div>

		<!-- Display Profile Picture only if selected -->
		{#if previewImage && ImageUploaded}
			<div class="mt-4">
				<img src={previewImage} alt="Profile Preview" class="h-16 w-16 rounded-full object-cover" />
			</div>
		{/if}

		<!-- Edit and Save Buttons -->
		<div class="flex gap-4">
			<Button class="w-[100px] text-white" type="button" onclick={toggleEditMode}>
				{editMode ? 'Cancel' : 'Edit'}
			</Button>
			{#if editMode}
				<Button class="w-[100px] text-white" type="submit">Save</Button>
			{/if}
		</div>
	</form>
</div>
