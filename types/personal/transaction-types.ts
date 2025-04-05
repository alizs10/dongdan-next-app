import { Category } from "./category-types";

export interface Transaction {
    id: number;
    type: "income" | "expense";
    amount: number;
    date: Date;
    title: string;
    description: string | null;
    category_ids: number[] | null;
    categories: Category[] | null;
    is_recurring: boolean;
    frequency: null | string;
    user_id: number;
    created_at: Date;
    updated_at: Date;
}
