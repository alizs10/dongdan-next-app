import { CalendarPlus } from "lucide-react";
import NewEventModal from "./NewEventModal";
import { useState } from "react";
import { useEventStore } from "@/store/event-store";
import NoEvents from "./NoEvents";
import Button from "@/components/Common/Button";
import EventsList from "./EventsList";

function Events() {

    const events = useEventStore((state) => state.events);

    const [newEventModalVis, setNewEventModalVis] = useState(false);

    function openModal() {
        setNewEventModalVis(true)
    }

    function closeModal() {
        setNewEventModalVis(false)
    }

    const eventsCount = events.filter(e => e.deletedAt === null).length;

    return (
        <div className='events_container'>
            <div className='events_header_container'>
                <h1 className='events_header_title'>رویداد ها</h1>
                <Button
                    text="افزودن رویداد"
                    color="accent"
                    onClick={openModal}
                    size="medium"
                    icon={<CalendarPlus className="size-5" />}
                />
            </div>


            {eventsCount > 0 ? (
                <EventsList events={events} />
            ) : (
                <NoEvents openNewEventModal={openModal} />
            )}

            {newEventModalVis && <NewEventModal onClose={closeModal} />}
        </div>
    );
}

export default Events;