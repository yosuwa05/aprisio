import { writable, type Writable } from 'svelte/store';


export const manageUserEventStore = writable({
    userEventSelected: false,
    userEventId: ''
});

