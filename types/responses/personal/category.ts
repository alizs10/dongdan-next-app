import { Category } from "@/types/personal/category-types";

export interface CreateCategoryResponse {
    status: boolean;
    message: string;
    data: Category;
}

export interface UpdateCategoryResponse {
    status: boolean;
    message: string;
    data: Category;
}

export interface DeleteCategoryResponse {
    status: boolean;
    message: string;
}