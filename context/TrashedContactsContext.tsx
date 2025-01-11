'use client'

import { Contact } from "@/types/contact-types";
import { createContext, useState } from "react";

type TrashedContactsContextType = {
    trashedContacts: Contact[];
    deleteContact: (contactId: string) => void;
    deleteMultiContact: (contactIds: string[]) => void;
};

export const TrashedContactsContext = createContext<TrashedContactsContextType>({
    trashedContacts: [],
    deleteContact: () => { },
    deleteMultiContact: () => { },
});

export function TrashedContactsContextProvider({ children, items }: { children: React.ReactNode, items: Contact[] }) {

    const [trashedContacts, setTrashedContacts] = useState<Contact[]>(items);

    function deleteContact(contactId: string) {
        setTrashedContacts(trashedContacts.filter((contact) => contact.id.toString() !== contactId));
    }

    function deleteMultiContact(contactIds: string[]) {
        setTrashedContacts(trashedContacts.filter((contact) => !contactIds.includes(contact.id.toString())));
    }

    const values = {
        trashedContacts,
        deleteContact,
        deleteMultiContact,
    };

    return (
        <TrashedContactsContext.Provider value={values}>
            {children}
        </TrashedContactsContext.Provider>
    );
}