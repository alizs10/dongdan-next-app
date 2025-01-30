import { Event, Expense, Member } from "../event-types";
import { Pagination } from "../globals";

export type EventData = {
    expends_count: number;
    transfers_count: number;
    total_amount: number;
    max_expend_amount: number;
    max_transfer_amount: number;
    member_with_most_expends: Member & {
        expenses_as_payer_sum_amount: number
    } | null;
    member_with_most_transfers: Member & {
        transfers_as_transmitter_sum_amount: number
    } | null;
}

export type GetEventResponse = {
    event: Event;
    event_data: EventData;
    expenses_data: {
        expenses: Expense[];
        pagination: Pagination;
    }
}

export type LoadMoreExpensesResponse = {
    status: boolean;
    message: string;
    data: {
        expenses: Expense[];
        pagination: Pagination;
    }
}

