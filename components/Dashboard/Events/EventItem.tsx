import { Event } from '@/types/event-types';
import { BookDashed, BriefcaseBusiness, Cake, Coffee, Dot, Ellipsis, Info, Pencil, Plane, Trash, TreePalm, Utensils } from "lucide-react";
import Link from 'next/link';
import moment from 'jalali-moment';
import Button from '@/components/Common/Button';
import { useContext, useState } from 'react';
import useClickOutside from '@/hooks/useOutsideClick';
import EditEventModal from './EditEventModal';
import { useDialogStore } from '@/store/dialog-store';
import { Toast, useToastStore } from '@/store/toast-store';
import { generateUID } from '@/helpers/helpers';
import { trashEventReq } from '@/app/actions/events';
import { EventsContext } from '@/context/EventsContext';
import { MultiSelectItemContext } from '@/context/MultiSelectItemContext';


export function RenderLabelIcon(label: string) {
    switch (label) {
        case 'سفر':
            return <Plane className='event_item_icon' />
            break;
        case 'کافه':
            return <Coffee className='event_item_icon' />
            break;
        case 'رستوران':
            return <Utensils className='event_item_icon' />
            break;
        case 'کار':
            return <BriefcaseBusiness className='event_item_icon' />
            break;
        case 'جشن':
            return <Cake className='event_item_icon' />
            break;
        case 'تفریح':
            return <TreePalm className='event_item_icon' />
            break;


        default:
            return <Plane className='event_item_icon' />
            break;
    }
}

function EventItem({ event }: { event: Event }) {

    const { deleteEvent } = useContext(EventsContext)
    const { toggleItem, selectMode, selectedItems } = useContext(MultiSelectItemContext);

    function onSelect() {
        if (!selectMode) return;
        toggleItem(event.id.toString());
    }

    const addToast = useToastStore(state => state.addToast)
    const { openDialog } = useDialogStore(state => state)

    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const [isEditEventModalOpen, setIsEditEventModalOpen] = useState(false);

    function toggleOptions() {
        setIsOptionsOpen(prev => !prev);
    }

    function toggleModal() {
        // toggleOptions();
        setIsOptionsOpen(false);
        setIsEditEventModalOpen(prev => !prev);
    }

    const optionsPrentRef = useClickOutside(() => setIsOptionsOpen(false))

    async function handleTrashEvent() {

        const res = await trashEventReq(event.id.toString())

        if (res.success) {
            const successToast = {

                message: res.message,
                type: 'success' as const,
            }
            deleteEvent(event.id.toString())
            addToast(successToast)
            return
        }

        const errorToast = {

            message: res.message,
            type: 'danger' as const,
        }
        addToast(errorToast)
    }

    function onTrash() {
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
                        handleTrashEvent()
                    }
                },
                cancel:
                {
                    text: 'انصراف',
                    onClick: () => { }
                }
            })
    }

    return (
        <li
            onClick={onSelect}
            className={`event_item ${selectMode && 'cursor-pointer'} ${selectedItems.includes(event.id.toString()) ? 'bg-gray-200 dark:bg-gray-800' : ''}`}>
            <div className='event_item_right'>

                <div className='event_item_icon_container'>
                    {RenderLabelIcon(event.label)}
                </div>

                <div className="flex flex-col gap-y-1">

                    <Link href={`/dashboard/events/${event.slug}`}>
                        <h2 className='event_item_name'>{event.name}</h2>
                    </Link>

                    <div className="flex flex-row gap-x-1 items-center">


                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {event.members_count + ' عضو'}،
                        </span>

                        <span className="text-xs text-gray-500 dark:text-gray-400">
                            {event.expenses_count + ' هزینه'}
                        </span>
                    </div>
                </div>
            </div>

            <div className='event_item_left'>
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
                        <div className="z-50 absolute top-full left-0 mt-4 flex flex-col gap-y-2">
                            <Button
                                text='ویرایش'
                                icon={<Pencil className='size-4' />}
                                color='warning'
                                size='small'
                                onClick={toggleModal}
                            />
                            <Button
                                text='حذف'
                                icon={<Trash className='size-4' />}
                                color='danger'
                                size='small'
                                onClick={onTrash}
                            />


                        </div>
                    )}
                </div>
                <Link className='hidden lg:block' href={`/dashboard/events/${event.slug}`}>
                    <Button
                        text='مشاهده جزییات'
                        icon={<Info className='event_item_button_icon' />}
                        color='gray'
                        size='small'
                        onClick={() => { }}
                    />
                </Link>
                {isEditEventModalOpen && (
                    <EditEventModal event={event} onClose={toggleModal} />
                )}
            </div>
        </li>

    );
}

export default EventItem;