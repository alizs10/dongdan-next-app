export type CreateEventRequest = {
    name: string;
    label: string;
    start_date: Date;
    self_included: 'true' | 'false';
    contact_members: string[];
}

export type UpdateEventRequest = {
    name: string;
    label: string;
    start_date: Date;
    members: string[];
    contacts: string[];
    self_included: 'true' | 'false';
}
