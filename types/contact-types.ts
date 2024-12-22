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
    restoreMultiContact: (contactIds: string) => void;
    deleteContact: (contactId: string) => void;
    deleteMultiContact: (contactIds: string[]) => void;
    updateContact: (contactId: string, updatedContact: Contact) => void;

    trashedContacts: null | Contact[];
    setTrashedContacts: (contacts: Contact[]) => void;
    deleteTrashContact: (contactId: string) => void;
    deleteMultiTrashContact: (contactId: string) => void;
}

export type ContactInputs = Pick<Contact, 'name' | 'scheme'>
