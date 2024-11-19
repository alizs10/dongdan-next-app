import { Contact } from '@/types/contact-types';
import styles from './Contacts.module.css';
import { Ellipsis, Info, Pencil, Trash, User } from "lucide-react";
import Button from '@/components/Common/Button';
import { useState } from 'react';
import useClickOutside from '@/hooks/useOutsideClick';
import { useContactStore } from '@/store/contact-store';
import EditContactModal from './EditContactModal';
import { useDialogStore } from '@/store/dialog-store';
import { Toast, useToastStore } from '@/store/toast-store';
import { generateUID } from '@/helpers/helpers';


function ContactItem({ contact }: { contact: Contact }) {

    const openDialog = useDialogStore(state => state.openDialog)
    const addToast = useToastStore(state => state.addToast)
    const { trashContact } = useContactStore(state => state)


    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const [isEditContactModalOpen, setIsEditContactModalOpen] = useState(false);

    function toggleOptions() {
        setIsOptionsOpen(prev => !prev);
    }

    function toggleModal() {
        // toggleOptions();
        setIsOptionsOpen(false);
        setIsEditContactModalOpen(prev => !prev);
    }

    const optionsPrentRef = useClickOutside(() => setIsOptionsOpen(false))

    let newToast: Toast = {
        id: generateUID(),
        message: 'شخص حذف شد',
        type: 'success'
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
                        trashContact(contact.id)
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
        <li key={contact.id} className={styles.contact_item}>
            <div className={styles.contact_item_right}>

                <div className={`${styles.contact_item_icon_container} user_avatar_${contact.scheme}_bg user_avatar_${contact.scheme}_text`}>
                    <User className='size-6' />
                </div>

                <h2 className={`${styles.contact_item_name} user_avatar_${contact.scheme}_text`}>{contact.name}</h2>
            </div>

            <div className={styles.contact_item_left}>
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
                                onClick={toggleModal}
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
        </li>

    );
}

export default ContactItem;