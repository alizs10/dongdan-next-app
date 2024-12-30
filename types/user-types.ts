import { SchemeType } from "./event-types";

export type Settings = {
    show_as_me: 0 | 1;
}

export type User = {
    id: number;
    name: string;
    email: string;
    email_verified_at: null | Date;
    scheme: SchemeType;
    settings?: Settings;
    created_at: Date;
    updated_at: Date;
}