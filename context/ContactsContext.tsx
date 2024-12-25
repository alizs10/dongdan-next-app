'use client'

import { Contact } from "@/types/contact-types";
import { createContext, useState } from "react";

type ContactsContextType = {
    contacts: Contact[];
    addContact: (contact: Contact) => void;
    updateContact: (contactId: string, updatedContact: Contact) => void;
    deleteContact: (contactId: string) => void;
    deleteMultiContact: (contactIds: string[]) => void;
};

export const ContactsContext = createContext<ContactsContextType>({
    contacts: [],
    addContact: () => { },
    updateContact: () => { },
    deleteContact: () => { },
    deleteMultiContact: () => { },
});

export function ContactsContextProvider({ children, items }: { children: React.ReactNode, items: Contact[] }) {

    const [contacts, setContacts] = useState<Contact[]>(items);

    function addContact(contact: Contact) {
        setContacts(prevState => [...prevState, contact]);
    }

    function updateContact(contactId: string, updatedContact: Contact) {
        setContacts(prevState => prevState.map(contact => contact.id.toString() === contactId ? updatedContact : contact));
    }

    function deleteContact(contactId: string) {
        setContacts(contacts.filter((contact) => contact.id.toString() !== contactId));
    }

    function deleteMultiContact(contactIds: string[]) {
        setContacts(contacts.filter((contact) => !contactIds.includes(contact.id.toString())));
    }

    const values = {
        contacts,
        addContact,
        updateContact,
        deleteContact,
        deleteMultiContact,
    };

    return (
        <ContactsContext.Provider value={values}>
            {children}
        </ContactsContext.Provider>
    );
}