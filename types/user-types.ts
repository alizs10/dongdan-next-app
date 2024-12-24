import { SchemeType } from "./event-types";

export type User = {
    id: string;
    name: string;
    email: string;
    email_verified_at: null | Date;
    scheme: SchemeType;
    created_at: Date;
    updated_at: Date;
}