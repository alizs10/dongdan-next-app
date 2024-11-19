import { Person } from "./event-types"

export type Contact = Person & {
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
}

export type ContactState = {
    contacts: Contact[];
    addContact: (contact: Contact) => void;
    trashContact: (contactId: string) => void;
    restoreContact: (contactId: string) => void;
    deleteContact: (contactId: string) => void;
    updateContact: (contactId: string, updatedContact: Contact) => void;
}