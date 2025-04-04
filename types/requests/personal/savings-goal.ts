export type CreateSavingsGoalRequest = {
    name: string;
    target_amount: number;
    due_date: string; // ISO format date
};

export type UpdateSavingsGoalRequest = {
    id: number;
    name: string;
    target_amount: number;
    due_date: string; // ISO format date
};

export type DeleteSavingsGoalRequest = {
    id: number;
}; 