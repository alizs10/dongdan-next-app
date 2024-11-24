'use client'

import Link from 'next/link';
import { MoveRight } from 'lucide-react';
import NoEventsTrashed from './NoEventsTrashed';
import { useEventStore } from '@/store/event-store';
import { useMemo } from 'react';
import TrashedEventsList from './TrashedEventsList';

function TrashedEvents() {

    const events = useEventStore(state => state.events);
    const trashedEvents = useMemo(() => events.filter(e => e.deletedAt !== null), [events]);

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


            {trashedEvents.length > 0 ? (
                <TrashedEventsList events={trashedEvents} />
            ) : (

                <NoEventsTrashed />
            )}

        </div>
    );
}

export default TrashedEvents;