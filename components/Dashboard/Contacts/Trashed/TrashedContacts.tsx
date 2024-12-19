'use client'

import Link from 'next/link';
import { MoveRight } from 'lucide-react';
import NoContactsTrashed from './NoContactsTrashed';
import TrashedContactsList from './TrashedContactsList';
import { Contact } from '@/types/contact-types';

function TrashedContacts({ items }: { items: Contact[] }) {

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

            {items.length > 0 ? (
                <TrashedContactsList contacts={items} />
            ) : (
                <NoContactsTrashed />
            )}

        </div>
    );
}

export default TrashedContacts;