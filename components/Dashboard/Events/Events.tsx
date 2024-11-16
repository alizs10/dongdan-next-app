import { CalendarPlus, Contact, Users } from "lucide-react";
import styles from "./Events.module.css";
import NewEventModal from "./NewEventModal";
import { useState } from "react";
import { useEventStore } from "@/store/event-store";
import NoEvents from "./NoEvents";
import Button from "@/components/Common/Button";
import EventsList from "./EventsList";
import { useRouter } from "next/navigation";
import { useContactStore } from "@/store/contact-store";

function Events() {

    const contacts = useContactStore(state => state.contacts)
    const events = useEventStore((state) => state.events);

    const contactsCount = contacts.filter(c => c.deletedAt === null).length;

    const [newEventModalVis, setNewEventModalVis] = useState(false);

    function openModal() {
        setNewEventModalVis(true)
    }

    function closeModal() {
        setNewEventModalVis(false)
    }

    const router = useRouter();


    return (
        <div className={styles.events_container}>
            <div className={styles.header_container}>
                <h1 className={styles.header_title}>رویداد ها</h1>


                <div className="flex flex-row gap-x-2 items-center">

                    <Button
                        text={`دوستان (${contactsCount})`}
                        color="success"
                        onClick={() => {
                            router.push("/dashboard/events/contacts")
                        }}
                        size="medium"
                        icon={<Contact className="size-5" />}
                    />
                    <Button
                        text="افزودن رویداد"
                        color="accent"
                        onClick={openModal}
                        size="medium"
                        icon={<CalendarPlus className="size-5" />}
                    />
                </div>

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