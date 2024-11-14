import { Event } from '@/types/event-types';
import styles from './Events.module.css';
import { BriefcaseBusiness, Cake, Coffee, Ellipsis, Info, Pencil, Plane, Trash, TreePalm, Utensils } from "lucide-react";
import Link from 'next/link';
import moment from 'jalali-moment';
import Button from '@/components/Common/Button';
import { useState } from 'react';
import useClickOutside from '@/hooks/useOutsideClick';


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

    const [isOptionsOpen, setIsOptionsOpen] = useState(false);

    function toggleOptions() {
        setIsOptionsOpen(prev => !prev);
    }

    const optionsPrentRef = useClickOutside(() => setIsOptionsOpen(false))

    return (
        <li key={event.id} className={styles.event_item}>
            <div className={styles.event_item_right}>

                <div className={styles.event_item_icon_container}>
                    {renderIcon(event.label)}
                </div>

                <h2 className={styles.event_item_name}>{event.name}</h2>
            </div>

            {/* <div className="flex flex-wrap items-center gap-x-2"> */}
            <div className={styles.event_item_left}>
                <span className="text-xs text-gray-500 selft-end">{moment(event.date).locale('fa').format("DD MMM، YYYY")}</span>
                <div ref={optionsPrentRef} className='relative'>
                    <Button
                        text=''
                        icon={<Ellipsis className='size-4' />}
                        color='gray'
                        size='small'
                        shape='square'
                        onClick={toggleOptions}
                    />

                    {isOptionsOpen && (
                        <div className="z-50 absolute top-full left-0 mt-4 flex flex-col gap-y-2">
                            <Button
                                text='ویرایش'
                                icon={<Pencil className='size-4' />}
                                color='warning'
                                size='small'
                                onClick={() => { }}
                            />
                            <Button
                                text='حذف'
                                icon={<Trash className='size-4' />}
                                color='danger'
                                size='small'
                                onClick={() => { }}
                            />
                        </div>
                    )}
                </div>
                <Link href={`/dashboard/events/${event.id}`}>
                    <Button
                        text='مشاهده جزییات'
                        icon={<Info className={styles.event_item_button_icon} />}
                        color='gray'
                        size='small'
                        onClick={() => { }}
                    />
                </Link>
            </div>
            {/* </div> */}
        </li>

    );
}

export default EventItem;