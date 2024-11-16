import { Contact } from '@/types/contact-types';
import styles from './Contacts.module.css';
import ContactItem from './ContactItem';

function ContactsList({ contacts }: { contacts: Contact[] }) {

    // filter trashed contacts
    contacts = contacts.filter(e => e.deletedAt === null);

    // sort contacts by date
    contacts.sort((a, b) => {
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    return (
        <ul className={styles.contacts_list}>
            {contacts.map(contact => (<ContactItem key={contact.id} contact={contact} />))}
        </ul>
    );
}

export default ContactsList;