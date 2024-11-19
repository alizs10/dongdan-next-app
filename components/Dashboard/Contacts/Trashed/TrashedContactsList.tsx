import { Contact } from '@/types/contact-types';
import styles from '../Contacts.module.css';
import TrashedContactItem from './TrashedContactItem';

function TrashedContactsList({ contacts }: { contacts: Contact[] }) {

    // sort contacts by date
    contacts.sort((a, b) => {
        return new Date(b.deletedAt as Date).getTime() - new Date(a.deletedAt as Date).getTime();
    });

    return (
        <ul className={styles.contacts_list}>
            {contacts.map(contact => (<TrashedContactItem key={contact.id} contact={contact} />))}
        </ul>
    );
}

export default TrashedContactsList;