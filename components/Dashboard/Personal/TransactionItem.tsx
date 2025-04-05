'use client'

import { Transaction } from "@/types/personal/transaction-types";
import moment from "jalali-moment";
import { BanknoteArrowDownIcon, BanknoteArrowUpIcon, CalendarDays, CalendarSync, Ellipsis, Pencil, Trash } from "lucide-react";
import { useState } from "react";
import useStore from "@/store/store";
import EditTransactionModal from "./Modals/EditTransactionModal";
import { deleteTransactionReq } from "@/app/actions/personal/transaction";
import { TomanPriceFormatter } from "@/helpers/helpers";
import Button from "@/components/Common/Button";
import useClickOutside from "@/hooks/useOutsideClick";

type TransactionItemProps = {
    transaction: Transaction;
    index: number;
    showActions?: boolean;
    setShowActions?: (mode: boolean) => void;
}

const TransactionItem = ({ transaction, index }: TransactionItemProps) => {
    const { date, title, amount, description, categories, type, is_recurring, frequency } = transaction;
    const persianDate = moment(date).locale('fa').format('jYYYY/jMM/jDD');
    const persianFullDate = moment(date).locale('fa').format("dddd DD MMM، YYYY");

    const [showEditModal, setShowEditModal] = useState(false);
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const { removeTransaction, addToast, openDialog } = useStore();

    const optionsParentRef = useClickOutside(() => setIsOptionsOpen(false));

    const toggleOptions = () => {
        setIsOptionsOpen(prev => !prev);
    };

    const handleEditClick = () => {
        setIsOptionsOpen(false);
        setShowEditModal(true);
    };

    const handleDeleteClick = () => {
        setIsOptionsOpen(false);
        // if (setShowActions) setShowActions(false);

        openDialog(
            "حذف تراکنش",
            `آیا از حذف تراکنش "${title}" اطمینان دارید؟`,
            {
                ok: {
                    text: "حذف",
                    onClick: async () => {
                        try {
                            const response = await deleteTransactionReq({ id: transaction.id });
                            if (response.success) {
                                removeTransaction(transaction.id);
                                addToast({
                                    message: 'تراکنش با موفقیت حذف شد',
                                    type: 'success',
                                });
                            } else {
                                addToast({
                                    message: response.message || 'خطا در حذف تراکنش',
                                    type: 'danger',
                                });
                            }
                        } catch (error) {
                            console.error('Error deleting transaction:', error);
                            addToast({
                                message: 'خطا در ارتباط با سرور',
                                type: 'danger',
                            });
                        }
                    }
                },
                cancel: {
                    text: "انصراف",
                    onClick: () => { }
                }
            }
        );
    };

    const isIncome = type === 'income';
    const categoryBgColor = isIncome ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200' : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950/30 dark:text-indigo-200';
    const iconBgColor = isIncome ? 'bg-green-50 dark:bg-green-950/30 text-green-400 dark:text-green-500' : 'bg-red-50 dark:bg-red-950/30 text-red-300 dark:text-red-500';
    const amountColor = isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500';

    // Map frequency to Persian text
    const getFrequencyText = () => {
        if (!frequency) return '';
        const frequencyMap: Record<string, string> = {
            'daily': 'روزانه',
            'weekly': 'هفتگی',
            'monthly': 'ماهانه',
            'yearly': 'سالانه'
        };
        return frequencyMap[frequency] || '';
    };

    return (
        <div className="flex flex-wrap justify-between border-b app_border_color py-3 px-5">
            <div className="flex flex-row w-full md:w-fit gap-x-4 items-center">
                <div className={`p-2 lg:p-3 rounded-full my-auto h-fit ${iconBgColor}`}>
                    {isIncome ? (
                        <BanknoteArrowUpIcon className="size-5 lg:size-6" />
                    ) : (
                        <BanknoteArrowDownIcon className="size-5 lg:size-6" />
                    )}
                </div>

                <div className="flex flex-col gap-y-2">
                    <h2 className="text-xs md:text-sm max-w-64 lg:max-w-52 xl:max-w-72 overflow-clip text-ellipsis text-nowrap lg:text-base text-gray-700 dark:text-gray-300">
                        {index + 1}.{<span className="mx-1"></span>}{isIncome ? 'درآمد' : 'هزینه'}: {title}
                    </h2>

                    {description && (
                        <p className="text-xs lg:text-sm text-gray-600 dark:text-gray-400 max-w-72 truncate">
                            {description}
                        </p>
                    )}

                    {categories && categories.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-1">
                            {categories.map((cat, idx) => (
                                <span
                                    key={idx}
                                    className={`text-xs px-2 py-1 rounded-lg ${categoryBgColor}`}
                                >
                                    {cat.name}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <div className="w-full h-full md:w-fit flex flex-row md:flex-col justify-between md:justify-start gap-y-4 items-end">
                <span className="text-xs text-gray-500 dark:text-gray-400">{persianFullDate}</span>
                <div className="flex flex-row items-end gap-x-2">
                    <div className="flex flex-col items-end gap-y-1">
                        <span className={`text-sm lg:text-base font-semibold ${amountColor} ml-2`}>
                            {TomanPriceFormatter(amount.toString())} تومان
                        </span>
                    </div>

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
                                    onClick={handleEditClick}
                                />
                                <Button
                                    text='حذف'
                                    icon={<Trash className='size-4' />}
                                    color='danger'
                                    size='small'
                                    onClick={handleDeleteClick}
                                />
                            </div>
                        )}
                    </div>
                </div>

                {is_recurring && (
                    <div className="flex bg-indigo-50 dark:bg-indigo-600/10 text-indigo-800 dark:text-indigo-600 rounded-full px-2 py-1 items-center gap-x-1 text-xs">
                        <CalendarSync className="size-3" />
                        <span>{getFrequencyText()}</span>
                    </div>
                )}
            </div>

            {showEditModal && (
                <EditTransactionModal
                    onClose={() => {
                        // if (setShowActions) setShowActions(false);
                        setShowEditModal(false);
                    }}
                    transaction={transaction}
                />
            )}
        </div>
    );
};

export default TransactionItem; 