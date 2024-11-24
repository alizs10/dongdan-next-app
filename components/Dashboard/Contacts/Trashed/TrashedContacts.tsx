'use client'

import Link from 'next/link';
import { MoveRight } from 'lucide-react';
import { useMemo } from 'react';
import NoContactsTrashed from './NoContactsTrashed';
import TrashedContactsList from './TrashedContactsList';
import { useContactStore } from '@/store/contact-store';

function TrashedContacts() {

    const contacts = useContactStore(state => state.contacts);
    const trashedContacts = useMemo(() => contacts.filter(e => e.deletedAt !== null), [contacts]);

    return (
        <div className='events_container'>

            <div className='event_header_container'>
                <div className='event_header_right'>
                    <Link href={'/dashboard/events/contacts'} className='event_back_button'>
                        <MoveRight className='event_back_button_icon' />
                    </Link>
                    <h1 className='event_header_title'>دوستان حذف شده</h1>
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