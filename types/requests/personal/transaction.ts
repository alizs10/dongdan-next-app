// types/requests/personal/transaction.ts
export type CreateTransactionRequest = {
    type: 'income' | 'expense';
    amount: number;
    date: Date;
    title: string;
    description?: string | null;
    category_ids?: number[] | null;
    is_recurring: 0 | 1;
    frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly' | null;
};

export type UpdateTransactionRequest = {
    id: number;
    type?: 'income' | 'expense';
    amount?: number;
    date?: Date;
    title?: string;
    description?: string | null;
    category_ids?: number[] | null;
    is_recurring?: 0 | 1;
    frequency?: 'daily' | 'weekly' | 'monthly' | 'yearly' | null;
};

export type DeleteTransactionRequest = {
    id: number;
};