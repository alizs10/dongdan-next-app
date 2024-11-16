export type Event = {
    id: string;
    name: string;
    date: Date;
    label: string;
    group: Person[];
    expenses: Expense[];
    status: 'active' | 'inactive';
    createdAt: Date;
    updatedAt: Date;
    deletedAt: Date | null;
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

export type Person = {
    id: string;
    name: string;
    scheme: string;
}

export type EventState = {
    events: Event[];
    addEvent: (event: Event) => void;
    trashEvent: (eventId: string) => void;
    deleteEvent: (eventId: string) => void;
    activateEvent: (eventId: string) => void;
    deactivateEvent: (eventId: string) => void;
    addPerson: (eventId: string, person: Person) => void;
    deletePerson: (eventId: string, personId: string) => void;
    addExpense: (eventId: string, expense: Expense) => void;
    deleteExpense: (eventId: string, expenseId: string) => void;
};


export type SettlePerson = {
    name: string;
    amount: number;
};