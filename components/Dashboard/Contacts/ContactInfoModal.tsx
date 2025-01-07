'use client'

import ModalHeader from "@/components/Common/ModalHeader";
import ModalWrapper from "@/components/Common/ModalWrapper";
import { Contact } from "@/types/contact-types";
import { Event } from "@/types/event-types";
import moment from "jalali-moment";
import { User } from "lucide-react";
import { useCallback, useMemo, useState } from "react";

type PropsTypes = {
    onClose: () => void,
    contact: Contact;
}


function ContactInfoModal({ onClose, contact }: PropsTypes) {

    // const [contact, setContact] = useState<Contact | null>(null)

    console.log(contact)

    return (
        <ModalWrapper onClose={onClose}>

            <section onClick={e => e.stopPropagation()} className="modal_container">
                <ModalHeader title="جزییات دوست" onClose={onClose} />

                <div className="p-5 grid grid-cols-2 gap-4">
                    <div className="col-span-2 flex flex-row items-center gap-x-2">
                        <span className={`p-3 w-fit rounded-full border user_avatar_${contact.scheme}_text user_avatar_${contact.scheme}_border user_avatar_${contact.scheme}_bg`}>
                            <User className="size-5" />
                        </span>
                        <span className={`user_avatar_${contact.scheme}_text text-base`}>{contact.name}</span>
                    </div>

                    <div className="col-span-1 flex flex-col gap-y-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">رویداد ها:</span>
                        {contact?.event_member_ships ? (

                            <span className="text-base text-gray-700 dark:text-gray-300">
                                {contact.event_member_ships.map(membership => membership.event?.name).join(', ')}
                            </span>
                        ) : (

                            <span className="text-base text-gray-700 dark:text-gray-300">
                                {'-'}
                            </span>
                        )}
                    </div>

                    <div className="col-span-1 flex flex-col gap-y-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">تاریخ افزوده شدن:</span>
                        <span className="text-base text-gray-700 dark:text-gray-300">{moment(contact.created_at).locale('fa').format("DD MMM، YYYY")}</span>
                    </div>
                    <div className="col-span-1 flex flex-col gap-y-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">آخرین بروز رسانی:</span>
                        <span className="text-base text-gray-700 dark:text-gray-300">{moment(contact.updated_at).locale('fa').format("DD MMM، YYYY")}</span>
                    </div>
                </div>
            </section>

        </ModalWrapper>
    );
}

export default ContactInfoModal;