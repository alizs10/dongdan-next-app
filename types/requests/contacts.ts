import { Contact } from "../contact-types";

export type CreateContactRequest = Pick<Contact, 'name' | 'scheme'>
