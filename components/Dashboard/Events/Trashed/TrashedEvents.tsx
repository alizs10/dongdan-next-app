'use client'

import Link from 'next/link';
import { ListCheck, ListChecks, MoveRight, RotateCw, Trash, X } from 'lucide-react';
import NoEventsTrashed from './NoEventsTrashed';
import TrashedEventsList from './TrashedEventsList';
import { useContext } from 'react';
import { TrashedEventsContext } from '@/context/TrashedEventsContext';
import { MultiSelectItemContext } from '@/context/MultiSelectItemContext';
import { deleteEventItemsReq, restoreEventItemsReq } from '@/app/actions/events';
import Button from '@/components/Common/Button';
import useStore from '@/store/store';
import TrackedLink from '@/components/Common/TrackedLinks';

function TrashedEvents() {

    const { trashedEvents: items, deleteMultiEvent } = useContext(TrashedEventsContext);

    const { enableSelectMode, selectMode, disableSelectMode, selectAllItems, selectedItems } = useContext(MultiSelectItemContext);

    const { addToast, openDialog } = useStore()

    function onDeleteSelectedItems() {

        openDialog(
            'حذف موارد انتخابی',
            'آیا از حذف موارد انتخاب شده اطمینان دارید؟ درصورت حذف، داده ها قابل بازیابی نیستند.',
            {
                ok: {
                    text: 'حذف',
                    onClick: () => {
                        handleDeleteEventItems()
                    }
                },
                cancel: {
                    text: 'انصراف',
                    onClick: () => { }
                }
            }
        )

    }

    function onRestoreSelectedItems() {

        openDialog(
            'بازیابی موارد انتخابی',
            'آیا از بازیابی موارد انتخاب شده اطمینان دارید؟.',
            {
                ok: {
                    text: 'بازیابی',
                    onClick: () => {
                        handleRestoreEventItems()
                    }
                },
                cancel: {
                    text: 'انصراف',
                    onClick: () => { }
                }
            }
        )

    }

    async function handleRestoreEventItems() {
        const res = await restoreEventItemsReq(selectedItems)

        if (res.success) {
            deleteMultiEvent(selectedItems)
            disableSelectMode()
            const successToast = {

                message: res.message,
                type: 'success' as const,
            }
            addToast(successToast)
            return;
        }

        const errorToast = {

            message: res.message,
            type: 'danger' as const,
        }
        addToast(errorToast)
    }

    async function handleDeleteEventItems() {
        const res = await deleteEventItemsReq(selectedItems)

        if (res.success) {
            deleteMultiEvent(selectedItems)
            disableSelectMode()
            const successToast = {

                message: res.message,
                type: 'success' as const,
            }
            addToast(successToast)
            return;
        }

        const errorToast = {

            message: res.message,
            type: 'danger' as const,
        }
        addToast(errorToast)
    }


    return (
        <div className='events_container'>
            <div className='event_header_container'>
                <div className='event_header_right'>
                    <TrackedLink href={'/dashboard/events'} className='event_back_button'>
                        <MoveRight className='event_back_button_icon' />
                    </TrackedLink>
                    <h1 className='event_header_title'>رویداد های حذف شده</h1>
                </div>

                <div className="event_header_left">
                    {items.length > 0 && (
                        <>
                            {selectMode && (
                                <>
                                    {selectedItems.length > 0 && (
                                        <div className="flex flex-row gap-x-2 items-center">
                                            <Button
                                                text={"بازیابی" + `${selectedItems.length > 0 ? " (" + selectedItems.length + ")" : ''}`}
                                                color="success"
                                                onClick={onRestoreSelectedItems}
                                                size="small"
                                                icon={<RotateCw className="size-5" />}
                                            />
                                            <Button
                                                text={"حذف" + `${selectedItems.length > 0 ? " (" + selectedItems.length + ")" : ''}`}
                                                color="danger"
                                                onClick={onDeleteSelectedItems}
                                                size="small"
                                                icon={<Trash className="size-5" />}
                                            />
                                        </div>
                                    )}
                                    <Button
                                        text="انتخاب همه"
                                        color="accent"
                                        onClick={() => selectAllItems(items.map(item => item.id.toString()))}
                                        size="small"
                                        icon={<ListCheck className="size-5" />}
                                    />
                                </>
                            )}
                            <Button
                                text=""
                                color="accent"
                                onClick={selectMode ? disableSelectMode : enableSelectMode}
                                size="small"
                                icon={selectMode ? <X className='size-5' /> : <ListChecks className="size-5" />}
                            />
                        </>
                    )}
                </div>
            </div>


            {items.length > 0 ? (
                <TrashedEventsList events={items} />
            ) : (
                <NoEventsTrashed />
            )}

        </div>
    );
}

export default TrashedEvents;