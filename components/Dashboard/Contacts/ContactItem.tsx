import { Contact } from '@/types/contact-types';
import { Ellipsis, Info, Pencil, Trash, User } from "lucide-react";
import Button from '@/components/Common/Button';
import { useContext, useState } from 'react';
import useClickOutside from '@/hooks/useOutsideClick';
import EditContactModal from './EditContactModal';
import { useDialogStore } from '@/store/dialog-store';
import { useToastStore } from '@/store/toast-store';
import ContactInfoModal from './ContactInfoModal';
import { trashContactReq } from '@/app/actions/contacts';
import { ContactsContext } from '@/context/ContactsContext';
import { MultiSelectItemContext } from '@/context/MultiSelectItemContext';


function ContactItem({ contact }: { contact: Contact }) {

    const { deleteContact } = useContext(ContactsContext);
    const { toggleItem, selectMode, selectedItems } = useContext(MultiSelectItemContext);

    function onSelect() {
        if (!selectMode) return;
        toggleItem(contact.id.toString());
    }


    const openDialog = useDialogStore(state => state.openDialog)
    const addToast = useToastStore(state => state.addToast)


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

        const res = await trashContactReq(contact.id.toString())

        if (res.success) {
            const successToast = {

                message: res.message,
                type: 'success' as const,
            }
            deleteContact(contact.id.toString())
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
        <li
            onClick={onSelect}
            className={`event_item ${selectMode && 'cursor-pointer'} ${selectedItems.includes(contact.id.toString()) ? 'bg-gray-200 dark:bg-gray-800' : ''}`}>
            <div className="flex flex-row gap-x-4 items-center">

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