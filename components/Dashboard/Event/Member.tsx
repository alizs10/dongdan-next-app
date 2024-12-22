import Button from "@/components/Common/Button";
import useClickOutside from "@/hooks/useOutsideClick";
import { useEventStore } from "@/store/event-store";
import { Person } from "@/types/event-types";
import { Ellipsis, Info, Pencil, Trash, User } from "lucide-react";
import { useParams } from "next/navigation";
import { useState } from "react";
import EditPersonModal from "./EditPersonModal";
import { useDialogStore } from "@/store/dialog-store";
import { Toast, useToastStore } from "@/store/toast-store";
import { generateUID } from "@/helpers/helpers";
import MemberInfoModal from "./MemberInfoModal";

function Member({ person, isEventDeleted }: { person: Person, isEventDeleted: boolean }) {

    const addToast = useToastStore(state => state.addToast)
    const openDialog = useDialogStore(state => state.openDialog)
    const { deleteEventMemberWithExpenses } = useEventStore(state => state);
    const { event_id } = useParams()

    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const [isEditPersonModalOpen, setIsEditPersonModalOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

    function toggleOptions() {
        if (isEventDeleted) return;
        setIsOptionsOpen(prev => !prev);
    }

    function toggleModal() {
        if (isEventDeleted) return;
        setIsOptionsOpen(false);
        setIsEditPersonModalOpen(prev => !prev);
    }


    function toggleInfoModal() {
        // toggleOptions();
        setIsOptionsOpen(false);
        setIsInfoModalOpen(prev => !prev);
    }

    const parentRef = useClickOutside(() => setIsOptionsOpen(false))

    function deletePersonWithExpenses() {
        if (typeof event_id !== 'string' || isEventDeleted) return;
        // deletePersonExpenses(event_id, person.id);
        deleteEventMemberWithExpenses(event_id, person.id);
    }


    function onDelete() {

        if (isEventDeleted) return;
        setIsOptionsOpen(false);


        const newToast: Toast = {
            id: generateUID(),
            message: 'شخص حذف شد',
            type: 'success'
        }
        openDialog(
            'حذف شخص',
            'آیا از حذف کردن شخص اطمینان دارید؟ تمام هزینه های مربوط به آن نیز حذف خواهد شد و قابل برگشت نیست.',
            {
                ok:
                {
                    text: 'حذف',
                    onClick: () => {
                        deletePersonWithExpenses()
                        addToast(newToast)

                    }
                },
                cancel: {
                    text: 'انصراف',
                    onClick: () => { }
                }
            })

    }

    return (

        <li className="flex flex-row justify-between items-center">
            <div className="flex flex-row gap-x-4 items-center">
                <div className={`p-2 border user_avatar_${person.scheme}_border user_avatar_${person.scheme}_bg rounded-full`}>
                    <User className={`size-5 user_avatar_${person.scheme}_text`} />
                </div>
                <span className={`text-base user_avatar_${person.scheme}_text`}>{person.name}</span>
            </div>

            {!isEventDeleted && (

                <div ref={parentRef} className="relative">


                    <Button
                        text=''
                        icon={<Ellipsis className='size-4' />}
                        color='gray'
                        size='small'
                        shape='square'
                        onClick={toggleOptions}
                    />

                    {isOptionsOpen && (
                        <div className="absolute z-50 top-full left-0 mt-4 flex flex-col gap-y-2">
                            <Button
                                text='جزییات'
                                icon={<Info className='size-4' />}
                                color='gray'
                                size='small'
                                onClick={toggleInfoModal}
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
                                onClick={onDelete}
                            />
                        </div>
                    )}
                </div>
            )}

            {isEditPersonModalOpen && !isEventDeleted && <EditPersonModal person={person} onClose={toggleModal} />}
            {isInfoModalOpen && (<MemberInfoModal onClose={toggleInfoModal} member={person} />)}
        </li>

    );
}

export default Member;