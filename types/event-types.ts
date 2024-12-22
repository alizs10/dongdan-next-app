// import { Event as PrismaEvent } from "@prisma/client";

export type Event = {
    id: string;
    name: string;
    slug: string;
    start_date: Date;
    end_date: null | Date;
    label: string;
    members?: Person[];
    expenses?: Expense[];
    created_at?: Date;
    updated_at?: Date;
    deleted_at?: Date | null;
}


export type Expend = {
    id: string;
    desc: string;
    amount: number;
    date: Date;
    type: 'expend';
    payer: string;
    group: string[];
}

export type Transfer = {
    id: string;
    desc: string;
    amount: number;
    date: Date;
    type: 'transfer';
    to: string;
    from: string;
}

export type Expense = Expend | Transfer;

export type ExpendFilter = {
    type: 'expend'
    dateRange: [Date, Date];
    amountMin: string;
    amountMax: string;
    group: string[];
    payer: string;
}

export type TransferFilter = {
    type: 'transfer'
    dateRange: [Date, Date];
    amountMin: string;
    amountMax: string;
    from: string;
    to: string;
}

export type AnyExpense = {
    type: 'any'
    dateRange: [Date, Date];
    amountMin: string;
    amountMax: string;
}

export type ExpenseFilters = ExpendFilter | TransferFilter | AnyExpense;

export type SchemeType = 'gray' | 'blue' | 'red' | 'rose' | 'green' | 'orange' | 'yellow' | 'purple';

export type Person = {
    id: string;
    name: string;
    scheme: SchemeType;
    eventId: string;
}

export type EventState = {
    events: null | Event[];
    setEvents: (events: Event[]) => void;
    // addEvent: (event: Event) => void;
    deleteEvent: (eventId: string) => void;
    // restoreEvent: (eventId: string) => void;
    // updateEvent: (eventId: string, updatedEvent: Event) => void;
    // deleteEvent: (eventId: string) => void;
    // activateEvent: (eventId: string) => void;
    // deactivateEvent: (eventId: string) => void;
    // addPerson: (eventId: string, person: Person) => void;
    // deletePerson: (eventId: string, personId: string) => void;
    // updatePerson: (eventId: string, personId: string, updatedPerson: Person) => void;
    // addExpense: (eventId: string, expense: Expense) => void;
    // updateExpense: (eventId: string, expenseId: string, updatedExpense: Expense) => void;
    // deleteExpense: (eventId: string, expenseId: string) => void;
    // updatePersonInEvents: (personId: string, updatedPerson: Omit<Person, "eventId">) => void;
    // filteredExpenses: Expense[];
    // activeFilters: ExpenseFilters | null;
    // applyFilters: (filters: ExpenseFilters, eventId: string) => void;
    // clearFilters: () => void;
    // deleteEventMemberWithExpenses: (eventId: string, personId: string) => void;
};


export type SettlePerson = {
    name: string;
    amount: number;
};