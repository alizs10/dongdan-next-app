'use client'

import ModalHeader from "@/components/Common/ModalHeader";
import ModalWrapper from "@/components/Common/ModalWrapper";
import { Contact } from "@/types/contact-types";
import moment from "jalali-moment";
import { User } from "lucide-react";

type PropsTypes = {
    onClose: () => void,
    contact: Contact;
}


function ContactInfoModal({ onClose, contact }: PropsTypes) {

    return (
        <ModalWrapper onClose={onClose}>

            <section onClick={e => e.stopPropagation()} className="modal_container">
                <ModalHeader title="جزییات دوست" onClose={onClose} />

                <div className="p-5 grid grid-cols-2 gap-4">
                    <div className="col-span-2 flex flex-row items-center gap-x-2">


                        {contact.avatar ? (
                            <div className={`rounded-xl overflow-hidden`}>
                                <img src={contact.avatar} alt={contact.name} className="size-12 object-center object-cover" />
                            </div>
                        ) : (
                            <div className={`size-12 flex justify-center rounded-xl items-center user_avatar_${contact.scheme}_bg user_avatar_${contact.scheme}_text`}>
                                <User className='size-6' />
                            </div>

                        )}

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