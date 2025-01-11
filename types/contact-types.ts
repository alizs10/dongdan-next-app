import { Member, SchemeType } from "./event-types"

export type Contact = {
    id: number;
    name: string;
    scheme: SchemeType;
    event_member_ships?: Member[];
    created_at: Date;
    updated_at: Date;
    deleted_at: Date | null;
}
