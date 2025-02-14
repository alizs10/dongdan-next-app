import { Contact } from "../contact-types";

export type CreateContactRequest = {
    avatar?: File | null;
} & Pick<Contact, 'name' | 'scheme'>
