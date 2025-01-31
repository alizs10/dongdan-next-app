export type Event = {
    id: number;
    name: string;
    slug: string;
    start_date: Date;
    end_date: null | Date;
    label: string;
    members: Member[];
    // expenses: Expense[];
    members_count: number;
    expenses_count: number;
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
    balance?: number;
    balance_status?: 'debtor' | 'creditor' | 'settled';
    total_expends_amount?: number;
    total_contributions_amount?: number;
    total_recieved_amount?: number;
    total_sent_amount?: number;
}

export type Contributor = {
    id: number;
    event_member_id: number;
    expense_id: number;
    amount: number;
    event_member?: Member;
    created_at: Date;
    updated_at: Date;
}

export type Expend = {
    id: number;
    description: string;
    amount: number;
    date: Date;
    type: 'expend';
    equal_shares: 0 | 1;
    payer_id: number;
    payer: Member;
    contributors: Contributor[]
    created_at: Date;
    updated_at: Date;
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
    created_at: Date;
    updated_at: Date;
}

export type Expense = Expend | Transfer;


export type ExpendFilter = {
    type: 'expend'
    dateRange: [Date, Date];
    amountMin: string;
    amountMax: string;
    contributors: string[]
    payer_id: string;
}

export type TransferFilter = {
    type: 'transfer'
    dateRange: [Date, Date];
    amountMin: string;
    amountMax: string;
    transmitter_id: string;
    receiver_id: string;
}

export type AnyExpense = {
    type: 'any'
    dateRange: [Date, Date];
    amountMin: string;
    amountMax: string;
}

export type ExpenseFilters = ExpendFilter | TransferFilter | AnyExpense;

export type SchemeType = 'gray' | 'blue' | 'red' | 'rose' | 'green' | 'orange' | 'yellow' | 'purple';

export type SettlePerson = Member & {
    amount: number;
};