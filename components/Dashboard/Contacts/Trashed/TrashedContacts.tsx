'use client'

import Link from 'next/link';
import { ListCheck, ListChecks, MoveRight, RotateCw, Trash, X } from 'lucide-react';
import NoContactsTrashed from './NoContactsTrashed';
import TrashedContactsList from './TrashedContactsList';
import Button from '@/components/Common/Button';
import { useContext } from 'react';
import { MultiSelectItemContext } from '@/context/MultiSelectItemContext';
import { TrashedContactsContext } from '@/context/TrashedContactsContext';
import { deleteContactItemsReq, restoreContactItemsReq } from '@/app/actions/contacts';
import useStore from '@/store/store';
import TrackedLink from '@/components/Common/TrackedLinks';

function TrashedContacts() {

    const { trashedContacts: items, deleteMultiContact } = useContext(TrashedContactsContext)
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
                        handleDeleteContactItems()
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
                        handleRestoreContactItems()
                    }
                },
                cancel: {
                    text: 'انصراف',
                    onClick: () => { }
                }
            }
        )

    }

    async function handleRestoreContactItems() {
        const res = await restoreContactItemsReq(selectedItems)

        if (res.success) {
            deleteMultiContact(selectedItems)
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

    async function handleDeleteContactItems() {
        const res = await deleteContactItemsReq(selectedItems)

        if (res.success) {
            deleteMultiContact(selectedItems)
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
                    <TrackedLink href={'/dashboard/events/contacts'} className='event_back_button'>
                        <MoveRight className='event_back_button_icon' />
                    </TrackedLink>
                    <h1 className='event_header_title'>دوستان حذف شده</h1>
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
                <TrashedContactsList contacts={items} />
            ) : (
                <NoContactsTrashed />
            )}

        </div>
    );
}

export default TrashedContacts;