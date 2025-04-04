import { Category } from "@/types/personal/category-types";
import { SavingsGoal } from "@/types/personal/savings-goal-types";
import { Transaction } from "@/types/personal/transaction-types";

export interface InitDataResponse {
    status: boolean;
    message: string;
    data: InitData;
}

export interface InitData {
    categories: Category[];
    savings_goals: SavingsGoal[];
    transactions: Transaction[];
    budget: number;
}



