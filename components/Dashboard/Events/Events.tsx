import { BriefcaseBusiness, Cake, CalendarPlus, Coffee, Info, Plane, PlusIcon, TreePalm, Utensils } from "lucide-react";
import styles from "./Events.module.css";
import NewEventModal from "./NewEventModal";
import { useState } from "react";
import Link from "next/link";
import { useEventStore } from "@/store/event-store";
import moment from "jalali-moment";
import NoEvents from "./NoEvents";

const EVENTS = [
    {
        id: 'e1',
        name: 'مسافرت شمال',
        label: 'سفر'
    },
    {
        id: 'e2',
        name: 'کافه لیمو',
        label: 'کافه'
    },
    {
        id: 'e3',
        name: 'پروژه سایت دنگ دان',
        label: 'کار'
    },
    {
        id: 'e4',
        name: 'جشن تولد میلاد',
        label: 'جشن'
    },
    {
        id: 'e5',
        name: 'رستوران با خانواده',
        label: 'رستوران'
    },
]

function Events() {

    const events = useEventStore((state) => state.events);

    const [newEventModalVis, setNewEventModalVis] = useState(false);

    function openModal() {
        setNewEventModalVis(true)
    }

    function closeModal() {
        setNewEventModalVis(false)
    }

    function renderIcon(label: string) {
        switch (label) {
            case 'سفر':
                return <Plane className={styles.event_item_icon} />
                break;
            case 'کافه':
                return <Coffee className={styles.event_item_icon} />
                break;
            case 'رستوران':
                return <Utensils className={styles.event_item_icon} />
                break;
            case 'کار':
                return <BriefcaseBusiness className={styles.event_item_icon} />
                break;
            case 'جشن':
                return <Cake className={styles.event_item_icon} />
                break;
            case 'تفریح':
                return <TreePalm className={styles.event_item_icon} />
                break;


            default:
                return <Plane className={styles.event_item_icon} />
                break;
        }
    }

    return (
        <div className={styles.events_container}>
            <div className={styles.header_container}>
                <h1 className={styles.header_title}>رویداد ها</h1>
                {EVENTS.length > 0 && (
                    <button onClick={openModal} className={styles.header_button}>
                        <CalendarPlus className={styles.header_button_icon} />
                        <span>افزودن رویداد</span>
                    </button>
                )}
            </div>


            {events.length > 0 ? (

                <ul className={styles.events_list}>

                    {events.map(event => (

                        <li key={event.id} className={styles.event_item}>
                            <div className={styles.event_item_right}>

                                <div className={styles.event_item_icon_container}>
                                    {renderIcon(event.label)}
                                </div>

                                <h2 className={styles.event_item_name}>{event.name}</h2>
                            </div>

                            <div className="flex flex-wrap items-center gap-x-2">
                                <span className="text-xs text-gray-500 selft-end">{moment(event.date).locale('fa').format("DD MMM، YYYY")}</span>
                                <div className={styles.event_item_left}>
                                    <Link href={`/dashboard/events/${event.id}`} className={styles.event_item_button}>
                                        <Info className={styles.event_item_button_icon} />
                                        <span>مشاهده جزییات</span>
                                    </Link>
                                </div>
                            </div>
                        </li>
                    ))}

                </ul>

            ) : (
                <NoEvents openNewEventModal={openModal} />
            )}

            {EVENTS.length === 0 && (

                <div className={styles.empty_container}>
                    <CalendarPlus className={styles.empty_icon} />
                    <p className={styles.empty_text}>اولین رویداد خود را ایجاد کنید</p>
                    <button onClick={openModal} className={styles.button}>
                        <PlusIcon className={styles.button_icon} />
                        <span>افزودن رویداد</span>
                    </button>
                </div>
            )}

            {newEventModalVis && <NewEventModal onClose={closeModal} />}
        </div>
    );
}

export default Events;