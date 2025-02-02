import { Contact } from '@/types/contact-types';
import { Ellipsis, RotateCw, Trash, User } from "lucide-react";
import Button from '@/components/Common/Button';
import { useContext, useState } from 'react';
import useClickOutside from '@/hooks/useOutsideClick';
import { MultiSelectItemContext } from '@/context/MultiSelectItemContext';
import { TrashedContactsContext } from '@/context/TrashedContactsContext';
import { deleteContactReq, restoreContactReq } from '@/app/actions/contacts';
import useStore from '@/store/store';


function TrashedContactItem({ contact }: { contact: Contact }) {

    const { deleteContact } = useContext(TrashedContactsContext);
    const { toggleItem, selectMode, selectedItems } = useContext(MultiSelectItemContext);

    const { openDialog, addToast } = useStore()

    const [isOptionsOpen, setIsOptionsOpen] = useState(false);

    function toggleOptions() {
        setIsOptionsOpen(prev => !prev);
    }

    const optionsPrentRef = useClickOutside(() => setIsOptionsOpen(false))


    function onDelete() {
        setIsOptionsOpen(false);

        openDialog(
            'حذف شخص',
            'آیا از حذف کردن شخص اطمینان دارید؟',
            {
                ok:
                {
                    text:
                        'حذف',
                    onClick: () => {
                        handleDeleteContact()
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
            'بازیابی شخص',
            'آیا از بازیابی شخص اطمینان دارید؟',
            {
                ok:
                {
                    text:
                        'بازیابی',
                    onClick: () => {
                        handleRestoreContact()
                    }
                },
                cancel:
                {
                    text: 'انصراف',
                    onClick: () => { }
                }
            })
    }


    async function handleRestoreContact() {
        const res = await restoreContactReq(contact.id)

        if (res.success) {
            deleteContact(contact.id.toString())
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

    async function handleDeleteContact() {
        const res = await deleteContactReq(contact.id)

        if (res.success) {
            deleteContact(contact.id.toString())
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

    function onSelect() {
        if (!selectMode) return;
        toggleItem(contact.id.toString());
    }


    return (
        <li
            onClick={onSelect}
            className={`event_item ${selectMode && 'cursor-pointer'} ${selectedItems.includes(contact.id.toString()) ? 'bg-gray-200 dark:bg-gray-800' : ''}`}>
            <div className="event_item_right">

                <div className={`flex justify-center p-3 rounded-xl items-center user_avatar_${contact.scheme}_bg user_avatar_${contact.scheme}_text`}>
                    <User className='size-6' />
                </div>

                <h2 className={`text-base lg:text-lg user_avatar_${contact.scheme}_text`}>{contact.name}</h2>
            </div>

            <div className="flex flex-row gap-x-2 items-center">
                <div ref={optionsPrentRef} className='relative'>
                    {!selectMode && (

                        <Button
                            text=''
                            icon={<Ellipsis className='size-4' />}
                            color='gray'
                            size='small'
                            shape='square'
                            onClick={toggleOptions}
                        />
                    )}

                    {!selectMode && isOptionsOpen && (
                        <div className="z-50 absolute top-full whitespace-nowrap left-0 mt-4 flex flex-col gap-y-2">

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

export default TrashedContactItem;