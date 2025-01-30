type FormStatusMessage = {
    type: 'info' | 'error' | 'success';
    body: string;
}

export type Pagination = {
    total: number;
    per_page: number;
    current_page: number;
    total_pages: number;
    from: number;
    to: number;
}
