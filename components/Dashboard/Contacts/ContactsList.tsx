import { Contact } from '@/types/contact-types';
import ContactItem from './ContactItem';

function ContactsList({ contacts }: { contacts: Contact[] }) {

    // sort contacts by date
    contacts.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return (
        <ul className="events_list">
            {contacts.map(contact => (<ContactItem key={contact.id} contact={contact} />))}
        </ul>
    );
}

export default ContactsList;