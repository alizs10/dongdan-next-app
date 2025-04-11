export interface BudgetLimit {
    id: number;
    name: string;
    category_id: number | null;
    amount: number;
    period: 'weekly' | 'monthly' | 'yearly';
    current_amount: number;
    progress_percentage: number;
    created_at: Date;
    updated_at: Date;
} 