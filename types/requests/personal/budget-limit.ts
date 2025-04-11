export type CreateBudgetLimitRequest = {
    name: string;
    category_id: number | null;
    amount: number;
    period: 'weekly' | 'monthly' | 'yearly';
};

export type UpdateBudgetLimitRequest = {
    id: number;
    name: string;
    category_id: number | null;
    amount: number;
    period: 'weekly' | 'monthly' | 'yearly';
    user_id: number;
};

export type DeleteBudgetLimitRequest = {
    id: number;
}; 