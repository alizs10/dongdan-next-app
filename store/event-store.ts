import { Event, EventState } from "@/types/event-types";
import { create } from "zustand";

var initEvents: Event[] = [
    {
        id: "jv6sh7k5wrj0cfvmd1umb",
        group: [
            {
                id: "tx34s6b1rzfhq7htoan5",
                name: "MHS",
                scheme: "rose",
            },
            {
                id: "ytpiubrev2uekim5e8nh",
                name: "Ali ZS",
                scheme: "gray",
            },
            {
                id: "90e0tz9i0vgpbhxq60h7t",
                name: "Milad",
                scheme: "blue",
            }
        ],
        expenses: [
            {
                id: "x6ptazo9d89tz7avqudlf",
                type: "expend",
                desc: "شام رستوران",
                amount: 1200000,
                group: [
                    "tx34s6b1rzfhq7htoan5",
                    "ytpiubrev2uekim5e8nh"
                ],
                payer: "tx34s6b1rzfhq7htoan5",
                date: new Date("2024-11-14T16:11:31.333Z")
            },
            {
                id: "eyrf6tlxskpm8030fp31q",
                type: "expend",
                desc: "شام رستوران",
                amount: 200000,
                group: [
                    "tx34s6b1rzfhq7htoan5",
                    "ytpiubrev2uekim5e8nh"
                ],
                payer: "tx34s6b1rzfhq7htoan5",
                date: new Date("2024-11-15T16:16:11.653Z")
            },
            {
                from: "ytpiubrev2uekim5e8nh",
                to: "tx34s6b1rzfhq7htoan5",
                desc: "شام رستوران",
                amount: 1200000,
                date: new Date("2024-11-20T16:17:55.170Z"),
                id: "7g7kefjrfca5c6p8hg7f37",
                type: "transfer"
            }
        ],
        name: "سفر شمال",
        "label": "سفر",
        date: new Date("2024-10-22T16:04:42.751Z")
    }
];

export const useEventStore = create<EventState>((set) => ({
    events: initEvents,
    addEvent: (event: Event) => set((state) => ({ events: [...state.events, event] })),

    addPerson: (eventId, person) => set((state) => ({ events: state.events.map(e => e.id === eventId ? { ...e, group: [...e.group, person] } : e) })),
    addExpense: (eventId, expense) => set((state) => ({ events: state.events.map(e => e.id === eventId ? { ...e, expenses: [...e.expenses, expense] } : e) })),
}));