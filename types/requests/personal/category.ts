// types/requests/personal.ts
export type CreateCategoryRequest = {
    name: string;
};

export type UpdateCategoryRequest = {
    id: number;
    name: string;
};

export type DeleteCategoryRequest = {
    id: number;
};