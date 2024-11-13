import { CalendarPlus } from "lucide-react";
import styles from "./Events.module.css";
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


    return (
        <div className={styles.events_container}>
            <div className={styles.header_container}>
                <h1 className={styles.header_title}>رویداد ها</h1>

                <Button
                    text="افزودن رویداد"
                    color="accent"
                    onClick={openModal}
                    size="medium"
                    icon={<CalendarPlus className="size-5" />}
                />

            </div>


            {events.length > 0 ? (
                <EventsList events={events} />
            ) : (
                <NoEvents openNewEventModal={openModal} />
            )}

            {newEventModalVis && <NewEventModal onClose={closeModal} />}
        </div>
    );
}

export default Events;