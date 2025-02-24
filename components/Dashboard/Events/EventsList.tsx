import { Event } from '@/types/event-types';
import EventItem from './EventItem';
import { CalendarArrowDown, CalendarArrowUp } from 'lucide-react';

function EventsList({ events }: { events: Event[] }) {

    // sort events by date
    events.sort((a, b) => {
        return new Date(b.start_date).getTime() - new Date(a.start_date).getTime();
    });

    let events_in_progress: Event[] = []
    let events_ended: Event[] = []

    events.forEach(event => {
        if (event.end_date === null)
            events_in_progress.push(event)
        else
            events_ended.push(event)
    })

    return (
        <ul className="events_list pb-10">
            <li className='flex flex-row justify-between items-center text-gray-500 dark:text-gray-400 text-lg p-5'>
                <div className="flex flex-row gap-x-2 items-center">
                    <CalendarArrowUp className='size-5' />
                    <span>رویداد های در جریان</span>
                </div>

                <span className='text-sm'>{events_in_progress.length} رویداد</span>
            </li>
            {events_in_progress.map(event => (<EventItem key={event.id} event={event} />))}
            <li className='flex flex-row justify-between items-center text-gray-500 dark:text-gray-400 text-lg p-5'>
                <div className="flex flex-row gap-x-2 items-center">

                    <CalendarArrowDown className='size-5' />
                    <span>رویداد های به پایان رسیده</span>
                </div>
                <span className='text-sm'>{events_ended.length} رویداد</span>
            </li>
            {events_ended.map(event => (<EventItem key={event.id} event={event} />))}
        </ul>
    );
}

export default EventsList;