import { Event, EventState } from "@/types/event-types";
import { create } from "zustand";

export const useEventStore = create<EventState>((set) => ({
    events: [],
    addEvent: (event: Event) => set((state) => ({ events: [...state.events, event] })),

    addPerson: (eventId, person) => set((state) => ({ events: state.events.map(e => e.id === eventId ? { ...e, group: [...e.group, person] } : e) })),
    addExpense: (eventId, expense) => set((state) => ({ events: state.events.map(e => e.id === eventId ? { ...e, expenses: [...e.expenses, expense] } : e) })),
}));