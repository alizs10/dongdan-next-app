import { Contact } from '@/types/contact-types';
import { Ellipsis, RotateCw, Trash, User } from "lucide-react";
import Button from '@/components/Common/Button';
import { useState } from 'react';
import useClickOutside from '@/hooks/useOutsideClick';
import { useContactStore } from '@/store/contact-store';
import { useDialogStore } from '@/store/dialog-store';
import { Toast, useToastStore } from '@/store/toast-store';
import { generateUID } from '@/helpers/helpers';


function TrashedContactItem({ contact }: { contact: Contact }) {

    const openDialog = useDialogStore(state => state.openDialog)
    const addToast = useToastStore(state => state.addToast)
    const { deleteContact, restoreContact } = useContactStore(state => state)


    const [isOptionsOpen, setIsOptionsOpen] = useState(false);

    function toggleOptions() {
        setIsOptionsOpen(prev => !prev);
    }

    const optionsPrentRef = useClickOutside(() => setIsOptionsOpen(false))


    function onDelete() {
        setIsOptionsOpen(false);
        let newToast: Toast = {
            id: generateUID(),
            message: 'شخص بصورت دائم حذف شد',
            type: 'success'
        }
        openDialog(
            'حذف شخص',
            'آیا از حذف کردن شخص اطمینان دارید؟',
            {
                ok:
                {
                    text:
                        'حذف',
                    onClick: () => {
                        deleteContact(contact.id)
                        addToast(newToast)
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
        let newToast: Toast = {
            id: generateUID(),
            message: 'شخص بازیابی شد',
            type: 'success'
        }
        openDialog(
            'بازیابی شخص',
            'آیا از بازیابی شخص اطمینان دارید؟',
            {
                ok:
                {
                    text:
                        'بازیابی',
                    onClick: () => {
                        restoreContact(contact.id)
                        addToast(newToast)
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
        <li className="event_item">
            <div className="event_item_right">

                <div className={`flex justify-center p-3 rounded-xl items-center user_avatar_${contact.scheme}_bg user_avatar_${contact.scheme}_text`}>
                    <User className='size-6' />
                </div>

                <h2 className={`text-base lg:text-lg user_avatar_${contact.scheme}_text`}>{contact.name}</h2>
            </div>

            <div className="flex flex-row gap-x-2 items-center">
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