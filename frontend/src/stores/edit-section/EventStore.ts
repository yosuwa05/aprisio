import { create } from "zustand";
import { persist } from "zustand/middleware";

type EventRule = {
    heading: string;
    subHeading: string;
    _id: string;
};

type Event = {
    eventId: string;
    group: {
        name: string;
        slug: string;
        _id: string;
    };
    eventName: string;
    location: string;
    date: string;
    isEventEnded: boolean;
    managedBy: string;
    rules: Array<EventRule>;
    attendees: Array<string>;
    createdAt: string;
};

type EventStore = {
    currentEvent: Event;
    setCurrentEvent: (event: Event) => void;
    resetCurrentEvent: () => void;
};

const defaultEvent: Event = {
    eventId: "",
    group: {
        name: "",
        slug: "",
        _id: "",
    },
    eventName: "",
    location: "",
    date: "",
    isEventEnded: false,
    managedBy: "",
    rules: [],
    attendees: [],
    createdAt: "",
};


const useEventStore = create<EventStore>()(
    persist((set) => ({
        currentEvent: defaultEvent,
        setCurrentEvent: (event) => set({ currentEvent: event }),
        resetCurrentEvent: () => set({ currentEvent: defaultEvent })
    }), {
        name: "event-storage"
    })
)

export default useEventStore;
