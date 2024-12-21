'use client'

import Button from "@/components/Common/Button";
import { MoveRight, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import NewContactModal from "./NewContactModal";
import ContactsList from "./ContactsList";
import NoContacts from "./NoContacts";
import Link from "next/link";
import { Contact } from "@/types/contact-types";
import { useContactStore } from "@/store/contact-store";
import DashboardLoading from "@/components/Layout/DashboardLoading";

function Contacts({ items }: { items: Contact[] }) {
    const [isNewContactModalOpen, setIsNewConatctModalOpen] = useState(false);

    const contacts = useContactStore(state => state.contacts);

    useEffect(() => {
        useContactStore.setState({ contacts: items });
    }, [items]);

    function toggleModal() {
        setIsNewConatctModalOpen(prev => !prev);
    }


    if (contacts === null) {
        return <DashboardLoading />
    }

    return (
        <div className="events_container">
            <div className="event_header_container">

                <div className="event_header_right">
                    <Link href={'/dashboard/contacts'} className="event_back_button">
                        <MoveRight className="event_back_button_icon" />
                    </Link>
                    <h1 className="event_header_title">دوستان {`(${contacts.length})`}</h1>
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

            {contacts.length > 0 ? (<ContactsList contacts={contacts} />) : <NoContacts openNewContactModal={toggleModal} />}


            {isNewContactModalOpen && <NewContactModal onClose={toggleModal} />}
        </div>
    );
}

export default Contacts;