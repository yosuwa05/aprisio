import { writable, type Writable } from 'svelte/store';
import { z } from 'zod';

export const topicsStore = writable({
	mode: 'list',
	topicName: '',
	id: ''
});

type StoreProps = {
	mode: string;
	topicName: string;
	id: string;
};

export type TopicsStore = Writable<StoreProps>;

export const _topicsSchema = z.object({
	topicName: z
		.string({
			message: 'Username is required'
		})
		.max(50)
});

export type TopicsStoreProps = {
	managerStore: TopicsStore;
};

export type CreateTopicsData = z.infer<typeof _topicsSchema>;
