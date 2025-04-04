export interface SavingsGoal {
    id: number;
    name: string;
    target_amount: number;
    due_date: Date;
    current_amount: number;
    progress_percentage: number;
    created_at: Date;
    updated_at: Date;
}
