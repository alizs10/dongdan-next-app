import { Contact } from '@/types/contact-types';
import { Ellipsis, Info, Pencil, Trash, User } from "lucide-react";
import Button from '@/components/Common/Button';
import { useState } from 'react';
import useClickOutside from '@/hooks/useOutsideClick';
import { useContactStore } from '@/store/contact-store';
import EditContactModal from './EditContactModal';
import { useDialogStore } from '@/store/dialog-store';
import { Toast, useToastStore } from '@/store/toast-store';
import { generateUID } from '@/helpers/helpers';
import ContactInfoModal from './ContactInfoModal';
import { trashContactReq } from '@/app/actions/contacts';


function ContactItem({ contact }: { contact: Contact }) {

    const openDialog = useDialogStore(state => state.openDialog)
    const addToast = useToastStore(state => state.addToast)
    const deleteContact = useContactStore(state => state.deleteContact)


    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const [isEditContactModalOpen, setIsEditContactModalOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

    function toggleOptions() {
        setIsOptionsOpen(prev => !prev);
    }

    function toggleModal() {
        // toggleOptions();
        setIsOptionsOpen(false);
        setIsEditContactModalOpen(prev => !prev);
    }

    function toggleInfoModal() {
        // toggleOptions();
        setIsOptionsOpen(false);
        setIsInfoModalOpen(prev => !prev);
    }

    const optionsPrentRef = useClickOutside(() => setIsOptionsOpen(false))
    async function handleTrashContact() {

        let res = await trashContactReq(contact.id)

        if (res.success) {
            let successToast: Toast = {
                id: generateUID(),
                message: 'شخص حذف شد',
                type: 'success'
            }
            deleteContact(contact.id)
            addToast(successToast)
            return
        }

        let errorToast: Toast = {
            id: generateUID(),
            message: res.message,
            type: 'danger'
        }
        addToast(errorToast)
    }

    function onTrash() {
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
                        handleTrashContact()
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
        <li className="flex flex-row justify-between items-center py-3 px-5">
            <div className="flex flex-row gap-x-4 items-center">

                <div className={`flex justify-center p-3 rounded-xl items-center user_avatar_${contact.scheme}_bg user_avatar_${contact.scheme}_text`}>
                    <User className='size-6' />
                </div>

                <h2 className={`text-base lg:text-lg user_avatar_${contact.scheme}_text`}>{contact.name}</h2>
            </div>

            <div className="flex flex-row gap-x-2 items-center">
                <div ref={optionsPrentRef} className='relative'>
                    <Button
                        text=''
                        icon={<Ellipsis className='size-5' />}
                        color='gray'
                        size='small'
                        shape='square'
                        onClick={toggleOptions}
                    />

                    {isOptionsOpen && (
                        <div className="z-50 absolute top-full left-0 mt-4 flex flex-col gap-y-2">
                            <Button
                                text='جزییات'
                                icon={<Info className='size-4' />}
                                color='gray'
                                size='small'
                                onClick={toggleInfoModal}
                            />
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

            </div>

            {isEditContactModalOpen && (<EditContactModal onClose={toggleModal} contact={contact} />)}
            {isInfoModalOpen && (<ContactInfoModal onClose={toggleInfoModal} contact={contact} />)}
        </li>

    );
}

export default ContactItem;