'use client'

import Link from 'next/link';
import { MoveRight } from 'lucide-react';
import NoEventsTrashed from './NoEventsTrashed';
import TrashedEventsList from './TrashedEventsList';
import { useContext } from 'react';
import { TrashedEventsContext } from '@/context/TrashedEventsContext';

function TrashedEvents() {

    const { trashedEvents: items } = useContext(TrashedEventsContext);

    return (
        <div className='events_container'>
            <div className='event_header_container'>
                <div className='event_header_right'>
                    <Link href={'/dashboard/events'} className='event_back_button'>
                        <MoveRight className='event_back_button_icon' />
                    </Link>
                    <h1 className='event_header_title'>رویداد های حذف شده</h1>
                </div>
            </div>


            {items.length > 0 ? (
                <TrashedEventsList events={items} />
            ) : (
                <NoEventsTrashed />
            )}

        </div>
    );
}

export default TrashedEvents;