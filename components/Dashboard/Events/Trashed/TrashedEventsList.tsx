import { Event } from '@/types/event-types';
import styles from '../Events.module.css';
import TrashedEventItem from './TrashedEventItem';
function TrashedEventsList({ events }: { events: Event[] }) {

    // sort events by date
    events.sort((a, b) => {
        return new Date(b.deletedAt as Date).getTime() - new Date(a.deletedAt as Date).getTime();
    });

    return (
        <ul className={styles.events_list}>
            {events.map(event => (<TrashedEventItem key={event.id} event={event} />))}
        </ul>
    );
}

export default TrashedEventsList;