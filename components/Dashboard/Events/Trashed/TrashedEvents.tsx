'use client'

import Link from 'next/link';
import styles from '../../../../styles/dashboard/dashboard-styles.module.css';
import { MoveRight } from 'lucide-react';
import NoEventsTrashed from './NoEventsTrashed';
import { useEventStore } from '@/store/event-store';
import { useMemo } from 'react';
import TrashedEventsList from './TrashedEventsList';

function TrashedEvents() {

    const events = useEventStore(state => state.events);
    const trashedEvents = useMemo(() => events.filter(e => e.deletedAt !== null), [events]);

    return (
        <div className={styles.container}>
            <div className={styles.header_container}>
                <div className={styles.header_right}>
                    <Link href={'/dashboard/events'} className={styles.back_button}>
                        <MoveRight className={styles.back_button_icon} />
                    </Link>
                    <h1 className={styles.header_title}>رویداد های حذف شده</h1>
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