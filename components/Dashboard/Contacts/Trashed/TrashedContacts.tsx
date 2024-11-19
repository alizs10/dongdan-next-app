'use client'

import Link from 'next/link';
import styles from '../../../../styles/dashboard/dashboard-styles.module.css';
import { MoveRight } from 'lucide-react';
import { useMemo } from 'react';
import NoContactsTrashed from './NoContactsTrashed';
import TrashedContactsList from './TrashedContactsList';
import { useContactStore } from '@/store/contact-store';

function TrashedContacts() {

    const contacts = useContactStore(state => state.contacts);
    const trashedContacts = useMemo(() => contacts.filter(e => e.deletedAt !== null), [contacts]);

    return (
        <div className={styles.contacts_container}>
            <div className={styles.header_container}>
                <div className={styles.header_right}>
                    <Link href={'/dashboard/events/contacts'} className={styles.back_button}>
                        <MoveRight className={styles.back_button_icon} />
                    </Link>
                    <h1 className={styles.header_title}>دوستان حذف شده</h1>
                </div>
            </div>


            {trashedContacts.length > 0 ? (
                <TrashedContactsList contacts={trashedContacts} />
            ) : (
                <NoContactsTrashed />
            )}

        </div>
    );
}

export default TrashedContacts;