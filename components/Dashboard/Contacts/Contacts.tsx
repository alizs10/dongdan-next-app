'use client'

import Button from "@/components/Common/Button";
import { MoveRight, UserPlus } from "lucide-react";
import { useEffect, useState } from "react";
import NewContactModal from "./NewContactModal";
import { useContactStore } from "@/store/contact-store";
import ContactsList from "./ContactsList";
import NoContacts from "./NoContacts";
import Link from "next/link";
import { Toast, useToastStore } from "@/store/toast-store";
import { generateUID } from "@/helpers/helpers";
import DashboardLoading from "@/components/Layout/DashboardLoading";

function Contacts() {

    const { contacts, setContacts } = useContactStore(state => state);
    const [loading, setLoading] = useState(false);
    const addToast = useToastStore(state => state.addToast);

    useEffect(() => {

        async function getContacts() {
            setLoading(true)
            try {
                let res = await fetch("http://localhost:8000/api/contacts", {
                    method: "GET",
                    headers: {
                        'accept': 'application/json',
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                })
                let data = await res.json()

                if (data?.status) {
                    setContacts(data.contacts)
                } else {
                    let errorToast: Toast = {
                        id: generateUID(),
                        message: "دریافت اطلاعات با خطا مواجه شد",
                        type: "danger"
                    }
                    addToast(errorToast)
                }
                setLoading(false)

            } catch (error) {
                console.log(error)
                let errorToast: Toast = {
                    id: generateUID(),
                    message: "دریافت اطلاعات با خطا مواجه شد",
                    type: "danger"
                }
                addToast(errorToast)
                setLoading(false)
            }
        }

        console.log(contacts)

        if (!contacts) {
            getContacts()
        }

    }, [contacts])


    const [isNewContactModalOpen, setIsNewConatctModalOpen] = useState(false);

    function toggleModal() {
        setIsNewConatctModalOpen(prev => !prev);
    }

    if (loading || !contacts) {
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