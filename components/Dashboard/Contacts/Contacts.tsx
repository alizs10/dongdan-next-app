'use client'

import Button from "@/components/Common/Button";
import { MoveRight, UserPlus } from "lucide-react";
import { useState } from "react";
import NewContactModal from "./NewContactModal";
import ContactsList from "./ContactsList";
import NoContacts from "./NoContacts";
import Link from "next/link";
import { Contact } from "@/types/contact-types";

function Contacts({ items }: { items: Contact[] }) {

    const [isNewContactModalOpen, setIsNewConatctModalOpen] = useState(false);

    function toggleModal() {
        setIsNewConatctModalOpen(prev => !prev);
    }

    return (
        <div className="events_container">
            <div className="event_header_container">

                <div className="event_header_right">
                    <Link href={'/dashboard/contacts'} className="event_back_button">
                        <MoveRight className="event_back_button_icon" />
                    </Link>
                    <h1 className="event_header_title">دوستان {`(${items.length})`}</h1>
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

            {items.length > 0 ? (<ContactsList contacts={items} />) : <NoContacts openNewContactModal={toggleModal} />}


            {isNewContactModalOpen && <NewContactModal onClose={toggleModal} />}
        </div>
    );
}

export default Contacts;