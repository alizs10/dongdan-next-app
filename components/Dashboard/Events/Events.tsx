'use client'

import { CalendarPlus } from "lucide-react";
import NewEventModal from "./NewEventModal";
import NoEvents from "./NoEvents";
import Button from "@/components/Common/Button";
import EventsList from "./EventsList";
import { useContext, useState } from "react";
import { EventsContext } from "@/context/EventsContext";

function Events() {

    const { events: items } = useContext(EventsContext);
    const [newEventModalVis, setNewEventModalVis] = useState(false);

    function openModal() {
        setNewEventModalVis(true)
    }

    function closeModal() {
        setNewEventModalVis(false)
    }


    return (
        <div className='events_container'>
            <div className='events_header_container'>
                <h1 className='events_header_title'>رویداد ها {`(${items.length})`}</h1>
                <Button
                    text="افزودن رویداد"
                    color="accent"
                    onClick={openModal}
                    size="medium"
                    icon={<CalendarPlus className="size-5" />}
                />
            </div>


            {items.length > 0 ? (
                <EventsList events={items} />
            ) : (
                <NoEvents openNewEventModal={openModal} />
            )}

            {newEventModalVis && <NewEventModal onClose={closeModal} />}
        </div>
    );
}

export default Events;