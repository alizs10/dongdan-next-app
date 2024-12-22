'use client'

import { Event } from "@/types/event-types";
import { createContext, useState } from "react";

type EventsContextType = {
    events: Event[];
    addEvent: (event: Event) => void;
    updateEvent: (eventId: string, updatedEvent: Event) => void;
    deleteEvent: (eventId: string) => void;
    deleteMultiEvent: (eventIds: string[]) => void;
};

export const EventsContext = createContext<EventsContextType>({
    events: [],
    addEvent: () => { },
    updateEvent: () => { },
    deleteEvent: () => { },
    deleteMultiEvent: () => { },
});

export function EventsContextProvider({ children, items }: { children: React.ReactNode, items: Event[] }) {

    const [events, setEvents] = useState<Event[]>(items);

    function addEvent(event: Event) {
        setEvents(prevState => [...prevState, event]);
    }

    function updateEvent(eventId: string, updatedEvent: Event) {
        setEvents(prevState => prevState.map(event => event.id === eventId ? updatedEvent : event));
    }

    function deleteEvent(eventId: string) {
        setEvents(events.filter((event) => event.id !== eventId));
    }

    function deleteMultiEvent(eventIds: string[]) {
        setEvents(events.filter((event) => !eventIds.includes(event.id)));
    }

    const values = {
        events,
        addEvent,
        updateEvent,
        deleteEvent,
        deleteMultiEvent,
    };

    return (
        <EventsContext.Provider value={values}>
            {children}
        </EventsContext.Provider>
    );
}