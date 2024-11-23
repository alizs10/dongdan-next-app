import { arraysHaveSameValues, isDateBetween, TomanPriceToNumber } from "@/helpers/helpers";
import { Event, EventState, Expense } from "@/types/event-types";
// import { batch } from 'zustand/middleware';
import { create } from "zustand";

var initEvents: Event[] = [
    // {
    //     id: "jv6sh7k5wrj0cfvmd1umb",
    //     group: [
    //         {
    //             id: "tx34s6b1rzfhq7htoan5",
    //             name: "MHS",
    //             scheme: "rose",
    //         },
    //         {
    //             id: "ytpiubrev2uekim5e8nh",
    //             name: "Ali ZS",
    //             scheme: "gray",
    //         },
    //         {
    //             id: "90e0tz9i0vgpbhxq60h7t",
    //             name: "Milad",
    //             scheme: "blue",
    //         }
    //     ],
    //     expenses: [
    //         {
    //             id: "x6ptazo9d89tz7avqudlf",
    //             type: "expend",
    //             desc: "شام رستوران",
    //             amount: 1200000,
    //             group: [
    //                 "tx34s6b1rzfhq7htoan5",
    //                 "ytpiubrev2uekim5e8nh"
    //             ],
    //             payer: "tx34s6b1rzfhq7htoan5",
    //             date: new Date("2024-11-14T16:11:31.333Z")
    //         },
    //         {
    //             id: "eyrf6tlxskpm8030fp31q",
    //             type: "expend",
    //             desc: "شام رستوران",
    //             amount: 200000,
    //             group: [
    //                 "tx34s6b1rzfhq7htoan5",
    //                 "ytpiubrev2uekim5e8nh"
    //             ],
    //             payer: "tx34s6b1rzfhq7htoan5",
    //             date: new Date("2024-11-15T16:16:11.653Z")
    //         },
    //         {
    //             from: "ytpiubrev2uekim5e8nh",
    //             to: "tx34s6b1rzfhq7htoan5",
    //             desc: "شام رستوران",
    //             amount: 1200000,
    //             date: new Date("2024-11-20T16:17:55.170Z"),
    //             id: "7g7kefjrfca5c6p8hg7f37",
    //             type: "transfer"
    //         }
    //     ],
    //     name: "سفر شمال",
    //     "label": "سفر",
    //     status: 'active',
    //     date: new Date("2024-10-22T16:04:42.751Z")
    // }
];

export const useEventStore = create<EventState>((set) => ({
    events: initEvents,
    addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
    updateEvent: (eventId, updatedEvent) => set((state) => ({ events: state.events.map(e => e.id === eventId ? { ...e, ...updatedEvent, updatedAt: new Date(Date.now()) } : e) })),
    deleteEvent: (eventId) => set((state) => ({ events: state.events.filter(e => e.id !== eventId) })),
    trashEvent: (eventId) => set((state) => ({ events: state.events.map(e => e.id === eventId ? { ...e, deletedAt: new Date(Date.now()) } : e) })),
    restoreEvent: (eventId) => set((state) => ({ events: state.events.map(e => e.id === eventId ? { ...e, deletedAt: null } : e) })),


    deactivateEvent: (eventId) => set((state) => ({ events: state.events.map(e => e.id === eventId ? { ...e, status: 'inactive' } : e) })),
    activateEvent: (eventId) => set((state) => ({ events: state.events.map(e => e.id === eventId ? { ...e, status: 'active' } : e) })),

    addPerson: (eventId, person) => set((state) => ({ events: state.events.map(e => e.id === eventId ? { ...e, group: [...e.group, person] } : e) })),
    deletePerson: (eventId, personId) => set((state) => ({ events: state.events.map(e => e.id === eventId ? { ...e, group: e.group.filter(p => p.id !== personId) } : e) })),
    updatePerson: (eventId, personId, updatedPerson) => set((state) => ({ events: state.events.map(e => e.id === eventId ? { ...e, group: e.group.map(p => p.id === personId ? { ...p, ...updatedPerson, updatedAt: new Date(Date.now()) } : p), updatedAt: new Date(Date.now()) } : e) })),
    addExpense: (eventId, expense) => set((state) => ({ events: state.events.map(e => e.id === eventId ? { ...e, expenses: [...e.expenses, expense] } : e) })),
    deleteExpense: (eventId, expenseId) => set((state) => ({ events: state.events.map(e => e.id === eventId ? { ...e, expenses: e.expenses.filter(expense => expense.id !== expenseId) } : e) })),
    updateExpense: (eventId, expenseId, updatedExpense) => set((state) => ({ events: state.events.map(e => e.id === eventId ? { ...e, expenses: e.expenses.map(expense => expense.id === expenseId ? { ...expense, ...updatedExpense, updatedAt: new Date(Date.now()) } : expense), updatedAt: new Date(Date.now()) } : e) })),
    updatePersonInEvents: (personId, updatedPerson) => set((state) => {
        let eventsIns = [...state.events];

        eventsIns.forEach(event => {
            let personIndex = event.group.findIndex(p => p.id === personId)
            let person = { ...updatedPerson, eventId: event.id }
            if (personIndex !== -1) {
                event.group[personIndex] = { ...event.group[personIndex], ...person };
            }
        })

        return { events: eventsIns }
    }),
    deleteEventMemberWithExpenses: (eventId, personId) => set((state) => {

        //  delete all expenses of person
        let eventsIns = [...state.events];
        let eventIndex = eventsIns.findIndex(e => e.id === eventId);
        if (eventIndex === -1) return { events: eventsIns };


        let event = eventsIns[eventIndex];
        let expenses = event.expenses;
        let deletableExpensesIds: string[] = []
        expenses.forEach(expense => {
            if (expense.type === 'transfer' && (expense.from === personId || expense.to === personId)) {
                deletableExpensesIds.push(expense.id);
            } else if (expense.type === 'expend' && expense.payer === personId) {
                deletableExpensesIds.push(expense.id);
            } else if (expense.type === 'expend' && expense.payer !== personId && expense.group.includes(personId)) {
                expense.group = expense.group.filter(p => p !== personId);
            }
        });

        event.expenses = expenses.filter(expense => !deletableExpensesIds.includes(expense.id));

        // delete person from event group
        event.group = event.group.filter(p => p.id !== personId);

        return { events: eventsIns }
    }),

    // filters
    filteredExpenses: [],
    activeFilters: null,

    applyFilters: (filters, eventId) => set((state) => {

        const event = state.events.find(e => e.id === eventId);
        if (!event) return { filteredExpenses: [], activeFilters: null };

        let results: Event['expenses'] = filters.type === 'any' ? [...event.expenses] : event.expenses.filter(exp => filters.type === exp.type);

        // 1. amount filter
        results = results.filter(exp => {

            const amount = TomanPriceToNumber(exp.amount.toString());

            const amountMin = TomanPriceToNumber(filters.amountMin);
            const amountMax = TomanPriceToNumber(filters.amountMax);

            if (filters.amountMin.length > 0 && filters.amountMax.length > 0 && amount >= amountMin && amount < amountMax) return true;

            return false;
        })

        // 2. date filter
        results = results.filter(exp => {
            const startDate = filters.dateRange[0];
            const endDate = filters.dateRange[1];

            return isDateBetween(exp.date, startDate, endDate);
        })


        // expend
        // 1. payer filter
        if (filters.type === 'expend' && filters?.payer.length > 0) {
            // activeFilters.payer = filters.payer;
            results = results.filter((exp) => (exp.type === 'expend' && exp.payer === filters.payer));
        }

        // 2. group filter
        if (filters.type === 'expend' && filters?.group.length > 0) {
            // activeFilters.group = filters.group;
            results = results.filter((exp) => (exp.type === 'expend' && arraysHaveSameValues(exp.group, filters.group)));
        }


        // transfer
        // 1. from filter
        if (filters.type === 'transfer' && filters?.from.length > 0) {
            // activeFilters.from = filters.from;
            results = results.filter((exp) => (exp.type === 'transfer' && exp.from === filters.from));
        }

        // 2. to filter
        if (filters.type === 'transfer' && filters?.to.length > 0) {
            // activeFilters.to = filters.to;
            results = results.filter((exp) => (exp.type === 'transfer' && exp.to === filters.to));
        }


        return { filteredExpenses: results, activeFilters: filters }
    }),
    clearFilters: () => set((state) => ({ filteredExpenses: [], activeFilters: null })),

}));