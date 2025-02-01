export type FormStatusMessage = {
    type: 'info' | 'error' | 'success';
    body: string;
}

export type Pagination = {
    next_cursor: string | null;
    next_cursor_id: number | null;
    has_more: boolean;
}
