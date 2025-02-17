'use client'

import Button from "@/components/Common/Button";
import { ListCheck, ListChecks, MoveRight, Trash, UserPlus, X } from "lucide-react";
import { useContext, useEffect, useState } from "react";
import NewContactModal from "./NewContactModal";
import ContactsList from "./ContactsList";
import NoContacts from "./NoContacts";
import Link from "next/link";
import { ContactsContext } from "@/context/ContactsContext";
import { MultiSelectItemContext } from "@/context/MultiSelectItemContext";


import { trashContactItemsReq } from "@/app/actions/contacts";
import useStore from "@/store/store";
import { useRouter } from "next/router";
import TrackedLink from "@/components/Common/TrackedLinks";

function Contacts() {

    const { contacts, deleteMultiContact } = useContext(ContactsContext);
    const { enableSelectMode, selectMode, disableSelectMode, selectAllItems, selectedItems } = useContext(MultiSelectItemContext);

    const { addToast, openDialog } = useStore()

    const [isNewContactModalOpen, setIsNewConatctModalOpen] = useState(false);
    function toggleModal() {
        setIsNewConatctModalOpen(prev => !prev);
    }

    function onDeleteSelectedItems() {

        openDialog(
            'حذف موارد انتخابی',
            'آیا از حذف موارد انتخاب شده اطمینان دارید؟ درصورت حذف، داده ها قابل بازیابی نیستند.',
            {
                ok: {
                    text: 'حذف',
                    onClick: () => {
                        handleTrashContactItems()
                    }
                },
                cancel: {
                    text: 'انصراف',
                    onClick: () => { }
                }
            }
        )

    }

    async function handleTrashContactItems() {
        const res = await trashContactItemsReq(selectedItems)

        if (res.success) {
            deleteMultiContact(selectedItems)
            disableSelectMode()
            const successToast = {

                message: res.message,
                type: 'success' as const,
            }
            addToast(successToast)
            return;
        }

        const errorToast = {

            message: res.message,
            type: 'danger' as const,
        }
        addToast(errorToast)
    }


    return (
        <div className="events_container">
            <div className="event_header_container">

                <div className="event_header_right">
                    <TrackedLink href={'/dashboard/events'} className="event_back_button">
                        <MoveRight className="event_back_button_icon" />
                    </TrackedLink>
                    <h1 className="event_header_title">دوستان {`(${contacts.length})`}</h1>
                </div>


                <div className="event_header_left">
                    {contacts.length > 0 && (
                        <>
                            {selectMode && (
                                <>
                                    {selectedItems.length > 0 && (

                                        <Button
                                            text={"حذف" + `${selectedItems.length > 0 ? " (" + selectedItems.length + ")" : ''}`}
                                            color="danger"
                                            onClick={onDeleteSelectedItems}
                                            size="small"
                                            icon={<Trash className="size-5" />}
                                        />
                                    )}
                                    <Button
                                        text="انتخاب همه"
                                        color="accent"
                                        onClick={() => selectAllItems(contacts.map(item => item.id.toString()))}
                                        size="small"
                                        icon={<ListCheck className="size-5" />}
                                    />
                                </>
                            )}
                            <Button
                                text=""
                                color="accent"
                                onClick={selectMode ? disableSelectMode : enableSelectMode}
                                size="small"
                                icon={selectMode ? <X className='size-5' /> : <ListChecks className="size-5" />}
                            />
                        </>
                    )}
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