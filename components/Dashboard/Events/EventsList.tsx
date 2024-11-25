import { Event } from '@/types/event-types';
import EventItem from './EventItem';

function EventsList({ events }: { events: Event[] }) {

    // filter trashed events
    events = events.filter(e => e.deletedAt === null);

    // sort events by date
    events.sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    return (
        <ul className="events_list">
            {events.map(event => (<EventItem key={event.id} event={event} />))}
        </ul>
    );
}

export default EventsList;