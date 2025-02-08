import { SchemeType } from "./event-types";
import { Settings } from "./settings";

export type User = {
    id: number;
    name: string;
    email: string;
    avatar: string | null;
    email_verified_at: null | Date;
    scheme: SchemeType;
    settings?: Settings;
    created_at: Date;
    updated_at: Date;
}