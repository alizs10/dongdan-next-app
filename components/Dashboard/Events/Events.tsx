'use client'

import { CalendarPlus, ListCheck, ListChecks, Trash, X } from "lucide-react";
import NewEventModal from "./NewEventModal";
import NoEvents from "./NoEvents";
import Button from "@/components/Common/Button";
import EventsList from "./EventsList";
import { useContext, useState } from "react";
import { EventsContext } from "@/context/EventsContext";
import { MultiSelectItemContext } from "@/context/MultiSelectItemContext";
import { Toast, useToastStore } from "@/store/toast-store";
import { useDialogStore } from "@/store/dialog-store";
import { generateUID } from "@/helpers/helpers";
import { trashEventItemsReq } from "@/app/actions/events";

function Events() {

    const { events: items, deleteMultiEvent } = useContext(EventsContext);
    const { enableSelectMode, selectMode, disableSelectMode, selectAllItems, selectedItems } = useContext(MultiSelectItemContext);

    const addToast = useToastStore(state => state.addToast)
    const openDialog = useDialogStore(state => state.openDialog)

    const [newEventModalVis, setNewEventModalVis] = useState(false);

    function toggleModal() {
        setNewEventModalVis(prev => !prev);
    }

    function onDeleteSelectedItems() {

        openDialog(
            'حذف موارد انتخابی',
            'آیا از حذف موارد انتخاب شده اطمینان دارید؟ درصورت حذف، داده ها قابل بازیابی نیستند.',
            {
                ok: {
                    text: 'حذف',
                    onClick: () => {
                        handleTrashEventItems()
                    }
                },
                cancel: {
                    text: 'انصراف',
                    onClick: () => { }
                }
            }
        )

    }

    async function handleTrashEventItems() {
        const res = await trashEventItemsReq(selectedItems)

        if (res.success) {
            deleteMultiEvent(selectedItems)
            disableSelectMode()
            const successToast: Toast = {
                id: generateUID(),
                message: res.message,
                type: 'success'
            }
            addToast(successToast)
            return;
        }

        const errorToast: Toast = {
            id: generateUID(),
            message: res.message,
            type: 'danger'
        }
        addToast(errorToast)
    }


    return (
        <div className='events_container'>
            <div className='events_header_container'>
                <div className="event_header_right">

                    <h1 className='events_header_title'>رویداد ها {`(${items.length})`}</h1>
                </div>

                <div className="event_header_left">
                    {items.length > 0 && (
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
                                        onClick={() => selectAllItems(items.map(item => item.id))}
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
                        text="افزودن رویداد"
                        color="accent"
                        onClick={toggleModal}
                        size="medium"
                        icon={<CalendarPlus className="size-5" />}
                    />
                </div>
            </div>


            {items.length > 0 ? (
                <EventsList events={items} />
            ) : (
                <NoEvents openNewEventModal={toggleModal} />
            )}

            {newEventModalVis && <NewEventModal onClose={toggleModal} />}
        </div>
    );
}

export default Events;