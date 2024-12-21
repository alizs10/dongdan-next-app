import { Person } from "./event-types"

export type Contact = Omit<Person, 'eventId'> & {
    createdAt: Date,
    updatedAt: Date,
    deletedAt: Date | null,
}

export type ContactState = {
    contacts: null | Contact[];
    setContacts: (contacts: Contact[]) => void;
    addContact: (contact: Contact) => void;
    restoreContact: (contactId: string) => void;
    deleteContact: (contactId: string) => void;
    updateContact: (contactId: string, updatedContact: Contact) => void;
}

export type NewContactInputs = Pick<Contact, 'name' | 'scheme'>
