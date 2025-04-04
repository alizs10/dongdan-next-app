import { Transaction } from "@/types/personal/transaction-types";

export type CreateTransactionResponse = {
    status: boolean;
    message: string;
    data?: Transaction;
};

export type UpdateTransactionResponse = {
    status: boolean;
    message: string;
    data?: Transaction;
};

export type DeleteTransactionResponse = {
    status: boolean;
    message: string;
};