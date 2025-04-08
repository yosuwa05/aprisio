import { writable, type Writable } from 'svelte/store';
import { z } from 'zod';

export const subTopicsStore = writable({
	mode: 'list',
	topicName: '',
	id: '',
	topic: '',
	description: '',
	popularity: ''
});

type StoreProps = {
	mode: string;
	topicName: string;
	id: string;
	topic: string;
	description: string;
	popularity: string
};

export type SubTopicsStore = Writable<StoreProps>;

export const _subTopicsSchema = z.object({
	subTopicName: z
		.string({
			message: 'Username is required'
		})
		.max(50),
	topic: z.string(),
	description: z.string().min(1),
	popularity: z.union([z.string(), z.number()]).transform((val) => val.toString()),
});

export type SubTopicsStoreProps = {
	managerStore: SubTopicsStore;
};

export type CreateTopicsData = z.infer<typeof _subTopicsSchema>;
