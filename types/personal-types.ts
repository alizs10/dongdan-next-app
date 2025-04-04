export interface PersonalTransaction {
    user_id: string;
    type: 'income' | 'expense';
    title: string;
    amount: string;
    date: Date;
    description?: string | null;
    category_id: string[] | null;
    is_recurring: 0 | 1;
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly' | null;
}