import Button from "@/components/Common/Button";
import { TomanPriceFormatter } from "@/helpers/helpers";
import useClickOutside from "@/hooks/useOutsideClick";
import { type Expense } from "@/types/event-types";
import moment from "jalali-moment";
import { ArrowRightLeft, DollarSign, Ellipsis, Info, MoveLeft, Pencil, Trash } from "lucide-react";
import { useCallback, useState, useContext } from "react";
import EditExpenseModal from "../EditExpenseModal";

import { EventContext } from "@/context/EventContext";

import { MultiSelectItemContext } from "@/context/MultiSelectItemContext";
import InfoExpenseModal from "../InfoExpenseModal";
import useStore from "@/store/store";

function ExpenseSkeleton() {
    return <div className="flex flex-wrap gap-4 justify-between border-b app_border_color py-3 px-5">

        <div className="w-full md:w-fit flex flex-row gap-x-4 items-center">
            <div className="size-8 lg:size-12 rounded-full bg-gray-400 dark:bg-gray-600 opacity-50 animate-pulse"></div>
            <div className="flex flex-col gap-y-2 md:gap-y-4">
                <div className="h-4 lg:h-7 w-32 rounded-md bg-gray-400 dark:bg-gray-600 opacity-50 animate-pulse"></div>
                <div className="flex flex-row gap-x-2 md:gap-x-4 items-center">
                    <div className="h-4 lg:h-5 w-10 rounded-md bg-gray-400 dark:bg-gray-600 opacity-50 animate-pulse"></div>
                    <div className="h-4 lg:h-5 w-6 rounded-md bg-gray-400 dark:bg-gray-600 opacity-50 animate-pulse"></div>
                    <div className="h-4 lg:h-5 w-28 rounded-md bg-gray-400 dark:bg-gray-600 opacity-50 animate-pulse"></div>
                </div>
            </div>
        </div>

        <div className="w-full md:w-fit flex flex-row md:flex-col justify-between md:justify-start gap-y-2">

            <div className="h-4 w-24 rounded-md mt-auto md:mt-0 md:mr-auto bg-gray-400 dark:bg-gray-600 opacity-50 animate-pulse"></div>

            <div className="flex flex-row gap-x-2 items-end">
                <div className="size-6 rounded-full bg-gray-400 dark:bg-gray-600 opacity-50 animate-pulse"></div>
                <div className="h-7 w-24 lg:h-9 lg:w-28 rounded-full bg-gray-400 dark:bg-gray-600 opacity-50 animate-pulse"></div>
            </div>
        </div>
    </div>
}

function Expense({ expense, index }: { expense: Expense, index: number }) {

    const { user, settings, openDialog } = useStore();

    const { event, deleteExpense, showMemberName } = useContext(EventContext)
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
    const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

    function toggleOptions() {

        setIsOptionsOpen(prev => !prev);
    }

    function toggleEditModal() {

        setIsOptionsOpen(false);
        setIsEditExpenseModalOpen(prev => !prev);
    }

    function toggleInfoModal() {
        setIsOptionsOpen(false);
        setIsInfoModalOpen(prev => !prev);
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

    if (!user || !settings) {
        // if (true) {
        return <ExpenseSkeleton />
    }

    return (
        <div
            onClick={onSelect}
            className={`flex flex-wrap gap-4 justify-between border-b app_border_color py-3 px-5 ${selectMode && 'cursor-pointer'} ${selectedItems.includes(expense.id.toString()) ? 'bg-gray-200 dark:bg-gray-800' : ''}`}>
            <div className="flex flex-row w-full md:w-fit gap-x-4 items-center">
                <div className={`p-2 lg:p-3 rounded-full my-auto h-fit ${expense.type === 'transfer' ? 'bg-orange-50 dark:bg-orange-950/30 text-orange-300 dark:text-orange-500' : 'bg-green-50 dark:bg-green-950/30 text-green-400 dark:text-green-500'}`}>
                    {expense.type === 'transfer' ? (
                        <ArrowRightLeft className="size-5 lg:size-6" />
                    ) : (
                        <DollarSign className="size-5 lg:size-6" />
                    )}
                </div>

                <div className="flex flex-col gap-y-2">
                    <h2 className="text-xs md:text-sm max-w-64 lg:max-w-52 xl:max-w-72 overflow-clip text-ellipsis text-nowrap lg:text-base text-gray-700 dark:text-gray-300">{index + 1}.{<span className="mx-1"></span>}{expense.type === 'transfer' ? 'جابه جایی پول' : 'هزینه'}: {expense.description}</h2>

                    <div className="flex flex-wrap gap-x-2 lg:gap-x-4 items-center text-xs lg:text-sm">
                        <span className="user_avatar_gray_text">{showMemberName(expense.type === 'expend' ? expense.payer_id : expense.transmitter_id)}</span>
                        <MoveLeft className="size-3.5 text-gray-500 dark:text-gray-400" />
                        {expense.type === 'transfer' ? (
                            <span className={`user_avatar_${getMember(expense.receiver_id.toString())?.scheme ?? 'gray'}_text`}>{showMemberName(expense.receiver_id)}</span>
                        ) : expense.contributors.length > 3 ? (
                            <span className={`user_avatar_blue_text`}>{expense.contributors.length} نفر</span>
                        ) : <div className="flex flex-wrap gap-x-2">
                            {expense.contributors.map((contributor, index) => (
                                <span key={contributor.id} className={`user_avatar_${contributor?.event_member?.scheme ?? 'blue'}_text`}>{contributor.event_member && showMemberName(contributor.event_member.id)}{index < expense.contributors.length - 1 && '،'}</span>
                            ))}
                        </div>}
                    </div>
                </div>
            </div>

            <div className="w-full md:w-fit flex flex-row justify-between md:justify-start md:flex-col gap-y-2 items-end">
                <span className="text-xs text-gray-500 dark:text-gray-400">{moment(expense.date).locale('fa').format("dddd DD MMM، YYYY")}</span>
                <div className="flex flex-row items-end gap-x-2">

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
                                    onClick={toggleEditModal}
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

            {isEditExpenseModalOpen && (
                <EditExpenseModal
                    event={event}
                    expense={expense}
                    onClose={toggleEditModal}
                />
            )}
            {isInfoModalOpen && (
                <InfoExpenseModal
                    expense={expense}
                    onClose={toggleInfoModal}
                />
            )}
        </div>
    );
}

export default Expense;