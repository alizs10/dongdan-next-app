import { ContactState } from "@/types/contact-types";
import { create } from "zustand";

export const useContactStore = create<ContactState>((set) => ({
    contacts: null,
    trashedContacts: null,

    setContacts: (contacts) => set({ contacts }),
    setTrashedContacts: (contacts) => set({ trashedContacts: contacts }),

    addContact: (contact) => set((state) => ({ contacts: [...(state.contacts ?? []), contact] })),
    restoreContact: (contactId) => set((state) => ({ contacts: state.contacts?.map((contact) => contact.id === contactId ? { ...contact, deletedAt: null } : contact) ?? [] })),
    restoreMultiContact: (contactIds) => set((state) => ({ contacts: state.contacts?.map((contact) => contact.id === contactId ? { ...contact, deletedAt: null } : contact) ?? [] })),
    deleteContact: (contactId) => set((state) => ({ contacts: state.contacts?.filter((contact) => contact.id !== contactId) ?? [] })),
    deleteMultiContact: (contactIds) => set((state) => ({ contacts: state.contacts?.filter((contact) => !contactIds.includes(contact.id)) ?? [] })),
    updateContact: (contactId, updatedContact) => set((state) => ({ contacts: state.contacts?.map((contact) => contact.id === contactId ? { ...contact, ...updatedContact, updatedAt: new Date(Date.now()) } : contact) ?? [] })),
}))