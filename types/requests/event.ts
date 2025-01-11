import { SchemeType } from "../event-types";

type AddContacts = {
    contacts: string[];
    self_included: 'true' | 'false';
}

type CreateMember = {
    name: string;
    scheme: SchemeType;
    email?: string;
}

export type CreateMemberRequest = AddContacts | CreateMember;


export type CreateExpendRequest = {
    description: string;
    type: "expend";
    date: Date;
    payer_id: string;
    equal_shares: 0 | 1;
    contributors: {
        event_member_id: string;
        amount: string;
    }[];
}

export type CreateTransferRequest = {
    description: string;
    amount: string;
    type: "transfer";
    date: Date;
    transmitter_id: string;
    receiver_id: string;
}
