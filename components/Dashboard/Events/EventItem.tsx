import { Event } from '@/types/event-types';
import styles from './Events.module.css';
import { BriefcaseBusiness, Cake, Coffee, Info, Plane, TreePalm, Utensils } from "lucide-react";
import Link from 'next/link';
import moment from 'jalali-moment';


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
function EventItem({ event }: { event: Event }) {



    return (
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

    );
}

export default EventItem;