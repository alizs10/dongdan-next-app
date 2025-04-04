import { SavingsGoal } from "@/types/personal/savings-goal-types";

export interface CreateSavingsGoalResponse {
    status: boolean;
    message: string;
    data: SavingsGoal;
}

export interface UpdateSavingsGoalResponse {
    status: boolean;
    message: string;
    data: SavingsGoal;
}

export interface DeleteSavingsGoalResponse {
    status: boolean;
    message: string;
} 