export interface SavingsGoal {
    id: number;
    name: string;
    target_amount: number;
    due_date: Date;
    current_amount: number;
    progress_percentage: number;
    status: boolean; // true if goal is reached, false otherwise
    created_at: Date;
    updated_at: Date;
}
