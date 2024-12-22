import { Contact } from '@/types/contact-types';
import ContactItem from './ContactItem';

function ContactsList({ contacts }: { contacts: Contact[] }) {

    // sort contacts by date
    contacts.sort((a, b) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
    });

    return (
        <ul className="events_list">
            {contacts.map(contact => (<ContactItem key={contact.id} contact={contact} />))}
        </ul>
    );
}

export default ContactsList;