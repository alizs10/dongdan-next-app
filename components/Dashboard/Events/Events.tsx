import { CalendarPlus, PlusIcon } from "lucide-react";
import styles from "./Events.module.css";
import NewEventModal from "./NewEventModal";
import { useState } from "react";

function Events() {

    const [newEventModalVis, setNewEventModalVis] = useState(false);

    function openModal() {
        setNewEventModalVis(true)
    }

    function closeModal() {
        setNewEventModalVis(false)
    }

    return (
        <div className={styles.events_container}>
            <h1 className={styles.header}>رویداد ها</h1>


            <div className={styles.empty_container}>
                <CalendarPlus className={styles.empty_icon} />
                <p className={styles.empty_text}>اولین رویداد خود را ایجاد کنید</p>
                <button onClick={openModal} className={styles.button}>
                    <PlusIcon className={styles.button_icon} />
                    <span>افزودن رویداد</span>
                </button>
            </div>

            {newEventModalVis && <NewEventModal onClose={closeModal} />}
        </div>
    );
}

export default Events;