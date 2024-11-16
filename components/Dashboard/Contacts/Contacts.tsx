'use client'


import Button from "@/components/Common/Button";
import styles from "./Contacts.module.css";
import { MoveRight, UserPlus } from "lucide-react";
import { useState } from "react";
import NewContactModal from "./NewContactModal";
import { useContactStore } from "@/store/contact-store";
import ContactsList from "./ContactsList";
import NoContacts from "./NoContacts";
import Link from "next/link";

function Contacts() {

    const contacts = useContactStore(state => state.contacts);

    const [isNewContactModalOpen, setIsNewConatctModalOpen] = useState(false);

    function toggleModal() {
        setIsNewConatctModalOpen(prev => !prev);
    }

    const contactsCount = contacts.filter(c => c.deletedAt === null).length

    return (
        <div className='p-3'>
            <div className='flex flex-row justify-between items-center pb-3 border-b border-gray-200'>

                <div className={styles.header_right}>
                    <Link href={'/dashboard/events'} className={styles.back_button}>
                        <MoveRight className={styles.back_button_icon} />
                    </Link>
                    <h1 className='text-indigo-900 text-lg'>دوستان {`(${contactsCount})`}</h1>
                </div>


                <div className="flex flex-row gap-x-2 items-center">
                    <Button
                        text="افزودن دوست"
                        color="accent"
                        onClick={toggleModal}
                        size="medium"
                        icon={<UserPlus className="size-5" />}
                    />
                </div>

            </div>

            {contactsCount > 0 ? (<ContactsList contacts={contacts} />) : <NoContacts openNewContactModal={toggleModal} />}


            {isNewContactModalOpen && <NewContactModal onClose={toggleModal} />}
        </div>
    );
}

export default Contacts;