import { Event } from '@/types/event-types';
import { BriefcaseBusiness, Cake, Coffee, Ellipsis, Info, Plane, RotateCw, Trash, TreePalm, Utensils } from "lucide-react";
import Link from 'next/link';
import moment from 'jalali-moment';
import Button from '@/components/Common/Button';
import { useContext, useState } from 'react';
import useClickOutside from '@/hooks/useOutsideClick';
import { useEventStore } from '@/store/event-store';
import { useDialogStore } from '@/store/dialog-store';
import { Toast, useToastStore } from '@/store/toast-store';
import { generateUID } from '@/helpers/helpers';
import { TrashedEventsContext } from '@/context/TrashedEventsContext';
import { deleteEventReq, restoreEventReq } from '@/app/actions/events';


function renderIcon(label: string) {
    switch (label) {
        case 'سفر':
            return <Plane className="event_item_icon" />
            break;
        case 'کافه':
            return <Coffee className="event_item_icon" />
            break;
        case 'رستوران':
            return <Utensils className="event_item_icon" />
            break;
        case 'کار':
            return <BriefcaseBusiness className="event_item_icon" />
            break;
        case 'جشن':
            return <Cake className="event_item_icon" />
            break;
        case 'تفریح':
            return <TreePalm className="event_item_icon" />
            break;


        default:
            return <Plane className="event_item_icon" />
            break;
    }
}

function TrashedEventItem({ event }: { event: Event }) {

    const { deleteEvent } = useContext(TrashedEventsContext);

    const addToast = useToastStore(state => state.addToast)
    const openDialog = useDialogStore(state => state.openDialog)

    const [isOptionsOpen, setIsOptionsOpen] = useState(false);

    function toggleOptions() {
        setIsOptionsOpen(prev => !prev);
    }

    const optionsPrentRef = useClickOutside(() => setIsOptionsOpen(false))


    function onDelete() {
        setIsOptionsOpen(false);

        openDialog(
            'حذف رویداد',
            'آیا از حذف کردن رویداد اطمینان دارید؟',
            {
                ok:
                {
                    text:
                        'حذف',
                    onClick: () => {
                        handleDeleteEvent()
                    }
                },
                cancel:
                {
                    text: 'انصراف',
                    onClick: () => { }
                }
            })
    }

    function onRestore() {
        setIsOptionsOpen(false);

        openDialog(
            'بازیابی رویداد',
            'آیا از بازیابی رویداد اطمینان دارید؟',
            {
                ok:
                {
                    text:
                        'بازیابی',
                    onClick: () => {
                        handleRestoreEvent()
                    }
                },
                cancel:
                {
                    text: 'انصراف',
                    onClick: () => { }
                }
            })
    }


    async function handleRestoreEvent() {
        let res = await restoreEventReq(event.id)

        if (res.success) {
            deleteEvent(event.id)
            let successToast: Toast = {
                id: generateUID(),
                message: res.message,
                type: 'success'
            }
            addToast(successToast)
            return;
        }

        let errorToast: Toast = {
            id: generateUID(),
            message: res.message,
            type: 'danger'
        }
        addToast(errorToast)
    }

    async function handleDeleteEvent() {
        let res = await deleteEventReq(event.id)

        if (res.success) {
            deleteEvent(event.id)
            let successToast: Toast = {
                id: generateUID(),
                message: res.message,
                type: 'success'
            }
            addToast(successToast)
            return;
        }

        let errorToast: Toast = {
            id: generateUID(),
            message: res.message,
            type: 'danger'
        }
        addToast(errorToast)
    }

    return (
        <li key={event.id} className="event_item">
            <div className="event_item_right">

                <div className="event_item_icon_container">
                    {renderIcon(event.label)}
                </div>

                <h2 className="event_item_name">{event.name}</h2>
            </div>

            <div className="event_item_left">
                <span className="text-xs text-gray-500 selft-end">{moment(event.start_date).locale('fa').format("DD MMM، YYYY")}</span>
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
                        <div className="z-50 absolute top-full left-0 whitespace-nowrap mt-4 flex flex-col gap-y-2">
                            <Button
                                text='بازیابی'
                                icon={<RotateCw className='size-4' />}
                                color='success'
                                size='small'
                                onClick={onRestore}
                            />
                            <Button
                                text='حذف دائم'
                                icon={<Trash className='size-4' />}
                                color='danger'
                                size='small'
                                onClick={onDelete}
                            />
                        </div>
                    )}
                </div>

            </div>
        </li>

    );
}

export default TrashedEventItem;