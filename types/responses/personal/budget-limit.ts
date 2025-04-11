import { BudgetLimit } from "@/types/personal/limit-types";

export interface CreateBudgetLimitResponse {
    status: boolean;
    message: string;
    data: BudgetLimit;
}

export interface UpdateBudgetLimitResponse {
    status: boolean;
    message: string;
    data: BudgetLimit;
}

export interface DeleteBudgetLimitResponse {
    status: boolean;
    message: string;
} 