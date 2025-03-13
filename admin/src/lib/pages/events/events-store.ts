import { writable, type Writable } from 'svelte/store';
import { z } from 'zod';

export const eventsStore = writable({
	mode: 'list',
	eventName: '',
	id: '',
	datetime: '',
	location: '',
	eventRules: [],
	eventType: 'online',
	price: '',
	availableTickets: '',
	mapLink: '',
	expirydatetime: '',
	organiserName: '',
	biography: '',
	description: '',
	eventImage: '',
	delta: ''
});

export const manageLayoutStore = writable({
	singleEventSelected: false,
	selectedId: ''
});

type StoreProps = {
	mode: string;
	eventName: string;
	id: string;
	datetime: string;
	location: string;
	eventRules: any[];
	eventType: string;
	price: string;
	availableTickets: string;
	mapLink: string;
	expirydatetime: string;
	organiserName: string;
	biography: string;
	description: string;
	eventImage: string;
	delta: string;
};

export type eventStore = Writable<StoreProps>;

export const _topicsSchema = z.object({
	datetime: z.string({
		required_error: 'Date Time  is required'
	}),
	expirydatetime: z.string({
		required_error: 'Date Time  is required'
	}),
	mapLink: z.string({
		required_error: 'Map Link is required'
	}),
	organiserName: z.string({
		required_error: 'Organiser Name  is required'
	}),
	biography: z.string({
		required_error: 'Biography is required'
	}),
	eventName: z
		.string({
			message: 'Event name is required'
		})
		.max(50),

	location: z
		.string({
			message: 'Location is required'
		})
		.max(100),
	eventType: z.enum(['online', 'offline']),
	price: z.union([z.string(), z.number()]).transform((val) => val.toString()),

	availableTickets: z.union([z.string(), z.number()]).transform((val) => val.toString()),
	description: z.string({
		required_error: 'Biography is required'
	})
});

export type EventsStoreProps = {
	managerStore: eventStore;
};

export type CreateEventData = z.infer<typeof _topicsSchema>;
