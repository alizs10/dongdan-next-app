import { Category } from "./category-types";

export interface Transaction {
    id: number;
    type: string;
    amount: number;
    date: Date;
    title: string;
    description: null;
    category_id: number | null;
    category: Category | null;
    is_recurring: boolean;
    frequency: null | string;
    user_id: number;
    created_at: Date;
    updated_at: Date;
}
