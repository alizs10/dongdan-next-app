// import { Event as PrismaEvent } from "@prisma/client";

export type NewEvent = {
    name: string;
    label: string;
    start_date: Date;
    self_included: 'true' | 'false';
    contact_members: string[];
}

export type UpdateEvent = {
    name: string;
    label: string;
    start_date: Date;
    members: string[];
    contacts: string[];
    self_included: 'true' | 'false';
}

export type Event = {
    id: number;
    name: string;
    slug: string;
    start_date: Date;
    end_date: null | Date;
    label: string;
    members: Member[];
    expenses: Expense[];
    members_count: number;
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}

export type Member = {
    id: number;
    name: string;
    email?: string;
    scheme: SchemeType;
    eventId: string;
    member_id?: number;
    member_type?: string;
    event?: Event;
}

export type CreateMemberInputs = {
    name: string;
    email?: string;
    scheme: SchemeType;
    member_id?: string;
    member_type?: string;
}

export type Expend = {
    id: number;
    description: string;
    amount: number;
    date: Date;
    type: 'expend';
    payer_id: number;
    payer: Member;
    contributors: Member[]
}

export type Transfer = {
    id: number;
    description: string;
    amount: number;
    date: Date;
    type: 'transfer';
    receiver_id: number;
    receiver: Member;
    transmitter_id: number;
    transmitter: Member;
}

export type Expense = Expend | Transfer;

export type ExpendFilter = {
    type: 'expend'
    dateRange: [Date, Date];
    amountMin: string;
    amountMax: string;
    contributors: Member[]
    payer_id: string;
    payer: Member;
}

export type TransferFilter = {
    type: 'transfer'
    dateRange: [Date, Date];
    amountMin: string;
    amountMax: string;
    transmitter_id: string;
    transmitter: Member;
    receiver_id: string;
    receiver: Member;
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
    id: number;
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


export type SettlePerson = Member & {
    amount: number;
};