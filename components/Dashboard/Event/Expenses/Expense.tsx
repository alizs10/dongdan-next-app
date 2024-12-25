import Button from "@/components/Common/Button";
import { TomanPriceFormatter } from "@/helpers/helpers";
import useClickOutside from "@/hooks/useOutsideClick";
import { type Expense } from "@/types/event-types";
import moment from "jalali-moment";
import { ArrowRightLeft, DollarSign, Ellipsis, MoveLeft, Pencil, Trash } from "lucide-react";
import { useCallback, useState, useContext } from "react";
import EditExpenseModal from "../EditExpenseModal";
import { useDialogStore } from "@/store/dialog-store";
import { EventContext } from "@/context/EventContext";
import { useAppStore } from "@/store/app-store";
import { MultiSelectItemContext } from "@/context/MultiSelectItemContext";

function Expense({ expense }: { expense: Expense }) {

    const openDialog = useDialogStore(state => state.openDialog);

    const { event, deleteExpense } = useContext(EventContext)
    const { toggleItem, selectMode, selectedItems } = useContext(MultiSelectItemContext);

    function onSelect() {
        if (!selectMode) return;
        toggleItem(expense.id.toString());
    }

    const getMember = useCallback((memeberId: string) => {
        return event.members.find(member => member.id.toString() === memeberId);
    }, [event]);


    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const [isEditExpenseModalOpen, setIsEditExpenseModalOpen] = useState(false);

    function toggleOptions() {

        setIsOptionsOpen(prev => !prev);
    }

    function toggleModal() {

        setIsOptionsOpen(false);
        setIsEditExpenseModalOpen(prev => !prev);
    }

    const optionsParentRef = useClickOutside(() => setIsOptionsOpen(false))

    function onDelete() {

        setIsOptionsOpen(false);


        openDialog(
            'حذف هزینه',
            'آیا از حذف کردن هزینه اطمینان دارید؟',
            {
                ok: {
                    text: 'حذف',
                    onClick: () => {
                        deleteExpense(expense.id)
                    }
                },
                cancel: {
                    text: 'انصراف',
                    onClick: () => { }
                }
            })
    }

    const user = useAppStore(state => state.user)

    const getMemberName = useCallback((memberId: string) => {
        const member = getMember(memberId);
        if (member?.member_id === user?.id) return 'خودم';

        return member?.name ?? 'نامشخص';
    }, [getMember]);

    return (
        <div
            onClick={onSelect}
            className={`flex flex-wrap gap-4 justify-between border-b app_border_color py-3 px-5 ${selectMode && 'cursor-pointer'} ${selectedItems.includes(expense.id.toString()) ? 'bg-gray-200 dark:bg-gray-800' : ''}`}>
            <div className="flex flex-wrap gap-4">
                <div className={`p-2 lg:p-3 rounded-full my-auto h-fit ${expense.type === 'transfer' ? 'bg-orange-50 dark:bg-orange-950/30 text-orange-300 dark:text-orange-500' : 'bg-green-50 dark:bg-green-950/30 text-green-400 dark:text-green-500'}`}>
                    {expense.type === 'transfer' ? (
                        <ArrowRightLeft className="size-5 lg:size-6" />
                    ) : (
                        <DollarSign className="size-5 lg:size-6" />
                    )}
                </div>

                <div className="flex flex-col gap-y-2">
                    <h2 className="text-sm lg:text-base text-gray-700 dark:text-gray-300">{expense.type === 'transfer' ? 'جابه جایی پول' : 'هزینه'}: {expense.description}</h2>

                    <div className="flex flex-wrap gap-x-2 lg:gap-x-4 items-center text-xs lg:text-sm">
                        <span className="user_avatar_gray_text">{expense.type === 'expend' ? getMemberName(expense.payer_id.toString()) : getMemberName(expense.transmitter_id.toString())}</span>
                        <MoveLeft className="size-3.5 text-gray-500 dark:text-gray-400" />
                        {expense.type === 'transfer' ? (
                            <span className={`user_avatar_${getMember(expense.receiver_id.toString())?.scheme ?? 'gray'}_text`}>{getMemberName(expense.receiver_id.toString())}</span>
                        ) : expense.contributors.length > 3 ? (
                            <span className={`user_avatar_blue_text`}>{expense.contributors.length} نفر</span>
                        ) : <div className="flex flex-wrap gap-x-2">
                            {expense.contributors.map((member, index) => (
                                <span key={member.id} className={`user_avatar_${getMember(member.id.toString())?.scheme ?? 'blue'}_text`}>{getMemberName(member.id.toString())}{index < expense.contributors.length - 1 && '،'}</span>
                            ))}
                        </div>}
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-y-2 items-end">
                <span className="text-xs text-gray-500 dark:text-gray-400">{moment(expense.date).locale('fa').format("DD MMM، YYYY")}</span>
                <div className="flex flex-row items-center gap-x-2">

                    <div ref={optionsParentRef} className='relative'>
                        {!selectMode && (
                            <Button
                                text=''
                                icon={<Ellipsis className='size-4' />}
                                color='gray'
                                size='small'
                                shape='square'
                                onClick={toggleOptions}
                            />
                        )}

                        {isOptionsOpen && (
                            <div className="z-50 absolute top-full left-0 mt-4 flex flex-col gap-y-2">
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

                    <span className="px-2 lg:px-4  py-1 lg:py-2 text-sm lg:text-base font-semibold bg-indigo-100 dark:bg-indigo-950/50 primary_text_color rounded-full">{TomanPriceFormatter(expense.amount.toString())} تومان</span>
                </div>
            </div>

            {isEditExpenseModalOpen && event.deleted_at === null && (
                <EditExpenseModal
                    event={event}
                    expense={expense}
                    onClose={toggleModal}
                />
            )}
        </div>
    );
}

export default Expense;