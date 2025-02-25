import { writable, type Writable } from 'svelte/store';
import { z } from 'zod';

export const eventsStore = writable({
	mode: 'list',
	eventName: '',
	id: '',
	date: '',
	location: '',
	eventRules: []
});

type StoreProps = {
	mode: string;
	eventName: string;
	id: string;
	date: string;
	location: string;
	eventRules: any[];
};

export type eventStore = Writable<StoreProps>;

export const _topicsSchema = z.object({
	eventName: z
		.string({
			message: 'Event name is required'
		})
		.max(50),

	location: z
		.string({
			message: 'Location is required'
		})
		.max(100)
});

export type EventsStoreProps = {
	managerStore: eventStore;
};

export type CreateEventData = z.infer<typeof _topicsSchema>;
