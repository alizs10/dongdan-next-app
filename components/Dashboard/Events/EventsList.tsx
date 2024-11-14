import { Event } from '@/types/event-types';
import styles from './Events.module.css';
import EventItem from './EventItem';

function EventsList({ events }: { events: Event[] }) {

    return (
        <ul className={styles.events_list}>
            {events.map(event => (<EventItem key={event.id} event={event} />))}
        </ul>
    );
}

export default EventsList;