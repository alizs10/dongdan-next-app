import { Event } from '@/types/event-types';
import EventItem from './EventItem';

function EventsList({ events }: { events: Event[] }) {

    // sort events by date
    events.sort((a, b) => {
        return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
    });

    return (
        <ul className="events_list">
            {events.map(event => (<EventItem key={event.id} event={event} />))}
        </ul>
    );
}

export default EventsList;