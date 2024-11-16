import { Contact } from '@/types/contact-types';
import styles from './Contacts.module.css';
import { BriefcaseBusiness, Cake, Coffee, Ellipsis, Info, Pencil, Plane, Trash, TreePalm, User, Utensils } from "lucide-react";
import Link from 'next/link';
import Button from '@/components/Common/Button';
import { useState } from 'react';
import useClickOutside from '@/hooks/useOutsideClick';
import { useContactStore } from '@/store/contact-store';
import EditContactModal from './EditContactModal';


function renderIcon(label: string) {
    switch (label) {
        case 'سفر':
            return <Plane className={styles.contact_item_icon} />
            break;
        case 'کافه':
            return <Coffee className={styles.contact_item_icon} />
            break;
        case 'رستوران':
            return <Utensils className={styles.contact_item_icon} />
            break;
        case 'کار':
            return <BriefcaseBusiness className={styles.contact_item_icon} />
            break;
        case 'جشن':
            return <Cake className={styles.contact_item_icon} />
            break;
        case 'تفریح':
            return <TreePalm className={styles.contact_item_icon} />
            break;


        default:
            return <Plane className={styles.contact_item_icon} />
            break;
    }
}
function ContactItem({ contact }: { contact: Contact }) {

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

    function onDelete() {
        console.log('delete');
    }

    function onTrash() {
        console.log('trash');
        trashContact(contact.id)
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
                        icon={<Ellipsis className='size-4' />}
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