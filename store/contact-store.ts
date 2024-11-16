import { ContactState } from "@/types/contact-types";
import { create } from "zustand";

export const useContactStore = create<ContactState>((set) => ({

    contacts: [],
    addContact: (contact) => set((state) => ({ contacts: [...state.contacts, contact] })),
    trashContact: (contactId) => set((state) => ({ contacts: state.contacts.map((contact) => contact.id === contactId ? { ...contact, deletedAt: new Date(Date.now()) } : contact) })),
    updateContact: (contactId, updatedContact) => set((state) => ({ contacts: state.contacts.map((contact) => contact.id === contactId ? { ...contact, ...updatedContact, updatedAt: new Date(Date.now()) } : contact) })),
}))