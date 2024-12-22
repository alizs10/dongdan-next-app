'use client'

import { Event } from "@/types/event-types";
import { createContext, useState } from "react";

type TrashedEventsContextType = {
    trashedEvents: Event[];
    deleteEvent: (contactId: string) => void;
    deleteMultiEvent: (contactIds: string[]) => void;
};

export const TrashedEventsContext = createContext<TrashedEventsContextType>({
    trashedEvents: [],
    deleteEvent: () => { },
    deleteMultiEvent: () => { },
});

export function TrashedEventsContextProvider({ children, items }: { children: React.ReactNode, items: Event[] }) {

    const [trashedEvents, setTrashedEvents] = useState<Event[]>(items);

    function deleteEvent(contactId: string) {
        setTrashedEvents(trashedEvents.filter((event) => event.id !== contactId));
    }

    function deleteMultiEvent(contactIds: string[]) {
        setTrashedEvents(trashedEvents.filter((event) => !contactIds.includes(event.id)));
    }

    const values = {
        trashedEvents,
        deleteEvent,
        deleteMultiEvent,
    };

    return (
        <TrashedEventsContext.Provider value={values}>
            {children}
        </TrashedEventsContext.Provider>
    );
}