import Button from "@/components/Common/Button";
import useClickOutside from "@/hooks/useOutsideClick";
import { type Member } from "@/types/event-types";
import { Ellipsis, Info, Pencil, Trash, User } from "lucide-react";
import { useContext, useState } from "react";
import EditMemberModal from "./EditMemberModal";
import { useDialogStore } from "@/store/dialog-store";
import MemberInfoModal from "./MemberInfoModal";
import { useAppStore } from "@/store/app-store";
import { EventContext } from "@/context/EventContext";

function MemberSkeleton() {
    return (
        <li className="flex w-full justify-between items-center">
            <div className="flex flex-row gap-x-4 justify-center items-center">
                <div className="size-10 bg-gray-400 dark:bg-gray-600 opacity-50 rounded-full animate-pulse"></div>
                <div className="w-14 bg-gray-400 dark:bg-gray-600 opacity-50 rounded-md animate-pulse h-5"></div>
            </div>

            <div className="size-6 rounded-full bg-gray-400 dark:bg-gray-600 opacity-50 animate-pulse"></div>
        </li>
    )
}

function Member({ member }: { member: Member }) {

    const user = useAppStore(state => state.user)
    const openDialog = useDialogStore(state => state.openDialog)
    const { deleteMember, showMemberName } = useContext(EventContext)

    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const [isEditMemberModalOpen, setIsEditMemberModalOpen] = useState(false);
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

    function toggleOptions() {
        setIsOptionsOpen(prev => !prev);
    }

    function toggleModal() {
        setIsOptionsOpen(false);
        setIsEditMemberModalOpen(prev => !prev);
    }

    function toggleInfoModal() {
        // toggleOptions();
        setIsOptionsOpen(false);
        setIsInfoModalOpen(prev => !prev);
    }

    const parentRef = useClickOutside(() => setIsOptionsOpen(false))

    function onDelete() {

        setIsOptionsOpen(false);

        openDialog(
            'حذف شخص',
            'آیا از حذف کردن شخص اطمینان دارید؟ تمام هزینه های مربوط به آن نیز حذف خواهد شد و قابل برگشت نیست.',
            {
                ok:
                {
                    text: 'حذف',
                    onClick: () => {
                        deleteMember(member.id)
                    }
                },
                cancel: {
                    text: 'انصراف',
                    onClick: () => { }
                }
            })

    }

    if (!user) {
        return <MemberSkeleton />
    }

    return (

        <li className="flex flex-row justify-between items-center">
            <div className="flex flex-row gap-x-4 items-center">
                <div className={`p-2 border user_avatar_${member.scheme}_border user_avatar_${member.scheme}_bg rounded-full`}>
                    <User className={`size-5 user_avatar_${member.scheme}_text`} />
                </div>
                <span className={`text-base user_avatar_${member.scheme}_text`}>{showMemberName(member.id)}</span>
            </div>


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


            {isEditMemberModalOpen && <EditMemberModal member={member} onClose={toggleModal} />}
            {isInfoModalOpen && (<MemberInfoModal onClose={toggleInfoModal} member={member} />)}
        </li>

    );
}

export default Member;