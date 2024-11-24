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
        <div className="events_container">
            <div className="event_header_container">

                <div className="event_header_right">
                    <Link href={'/dashboard/events'} className="event_back_button">
                        <MoveRight className="event_back_button_icon" />
                    </Link>
                    <h1 className="event_header_title">دوستان {`(${contactsCount})`}</h1>
                </div>


                <div className="event_header_left">
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