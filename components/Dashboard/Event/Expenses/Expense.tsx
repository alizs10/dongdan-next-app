import Button from "@/components/Common/Button";
import { generateUID, TomanPriceFormatter } from "@/helpers/helpers";
import useClickOutside from "@/hooks/useOutsideClick";
import { useEventStore } from "@/store/event-store";
import { type Event, type Expense } from "@/types/event-types";
import moment from "jalali-moment";
import { ArrowRightLeft, DollarSign, Ellipsis, MoveLeft, Pencil, Trash } from "lucide-react";
import { useParams } from "next/navigation";
import { useMemo, useCallback, useState } from "react";
import EditExpenseModal from "../EditExpenseModal";
import { useDialogStore } from "@/store/dialog-store";
import { Toast, useToastStore } from "@/store/toast-store";

function Expense({ expense }: { expense: Expense }) {
    const { event_id } = useParams()

    const addToast = useToastStore(state => state.addToast)
    const openDialog = useDialogStore(state => state.openDialog);
    const { events, deleteExpense, updateExpense } = useEventStore(state => state)

    const event = useMemo(() => events.find(event => event.id === event_id) as Event, [events, event_id]);

    const getPerson = useCallback((personId: string) => {
        return event.group.find(person => person.id === personId);
    }, [event]);


    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const [isEditExpenseModalOpen, setIsEditExpenseModalOpen] = useState(false);

    function toggleOptions() {
        if (event.deletedAt !== null) return;
        setIsOptionsOpen(prev => !prev);
    }

    function toggleModal() {
        if (event.deletedAt !== null) return;
        setIsOptionsOpen(false);
        setIsEditExpenseModalOpen(prev => !prev);
    }

    const optionsParentRef = useClickOutside(() => setIsOptionsOpen(false))

    function onDelete() {
        if (event.deletedAt !== null) return;
        setIsOptionsOpen(false);

        let newToast: Toast = {
            id: generateUID(),
            message: `${expense.type === 'expend' ? 'هزینه' : 'جابجایی پول'} حذف شد`,
            type: 'success'
        }

        openDialog(
            'حذف هزینه',
            'آیا از حذف کردن هزینه اطمینان دارید؟',
            {
                ok: {
                    text: 'حذف',
                    onClick: () => {
                        deleteExpense(event_id as string, expense.id)
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
        <div className="flex flex-wrap gap-4 justify-between border-b border-gray-200 py-3 px-5">
            <div className="flex flex-wrap gap-4">
                <div className={`p-2 lg:p-3 rounded-full my-auto h-fit ${expense.type === 'transfer' ? 'bg-orange-50 text-orange-300' : 'bg-green-50 text-green-400'}`}>
                    {expense.type === 'transfer' ? (
                        <ArrowRightLeft className="size-5 lg:size-6" />
                    ) : (
                        <DollarSign className="size-5 lg:size-6" />
                    )}
                </div>

                <div className="flex flex-col gap-y-2">
                    <h2 className="text-sm lg:text-base text-gray-700">{expense.type === 'transfer' ? 'جابه جایی پول' : 'هزینه'}: {expense.desc}</h2>
                    <div className="flex flex-wrap gap-x-2 lg:gap-x-4 items-center text-xs lg:text-sm">
                        <span className="user_avatar_gray_text">{expense.type === 'expend' ? getPerson(expense.payer)?.name ?? '?' : getPerson(expense.from)?.name ?? '?'}</span>
                        <MoveLeft className="size-3.5 text-gray-500" />
                        {expense.type === 'transfer' ? (
                            <span className={`user_avatar_${getPerson(expense.to)?.scheme ?? 'gray'}_text`}>{getPerson(expense.to)?.name ?? '?'}</span>
                        ) : expense.group.length > 3 ? (
                            <span className={`user_avatar_blue_text`}>{expense.group.length} نفر</span>
                        ) : <div className="flex flex-wrap gap-x-2">
                            {expense.group.map((person, index) => (
                                <span key={person} className={`text-xs user_avatar_${getPerson(person)?.scheme ?? 'blue'}_text`}>{getPerson(person)?.name ?? '?'}{index < expense.group.length - 1 && '،'}</span>
                            ))}
                        </div>}
                    </div>
                </div>
            </div>

            <div className="flex flex-col gap-y-2 items-end">
                <span className="text-xs text-gray-500">{moment(expense.date).locale('fa').format("DD MMM، YYYY")}</span>
                <div className="flex flex-row items-center gap-x-2">

                    {event.deletedAt === null && (
                        <div ref={optionsParentRef} className='relative'>
                            <Button
                                text=''
                                icon={<Ellipsis className='size-4' />}
                                color='gray'
                                size='small'
                                shape='square'
                                onClick={toggleOptions}
                            />

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
                    )}

                    <span className="px-2 lg:px-4  py-1 lg:py-2 text-sm lg:text-base font-semibold bg-indigo-100 text-indigo-900 rounded-full">{TomanPriceFormatter(expense.amount.toString())} تومان</span>
                </div>
            </div>

            {isEditExpenseModalOpen && event.deletedAt === null && (
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