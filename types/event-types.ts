export type Event = {
    id: string;
    name: string;
    date: Date;
    label: string;
    group: Person[];
    expenses: Expense[];
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
    addPerson: (eventId: string, person: Person) => void;
    addExpense: (eventId: string, expense: Expense) => void;
};