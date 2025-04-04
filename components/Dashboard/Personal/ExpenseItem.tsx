'use client'

import { Transaction } from "@/types/personal/transaction-types";
import moment from "jalali-moment"
import { Pencil, Trash } from "lucide-react";
import { useState } from "react";
import useStore from "@/store/store";
import EditTransactionModal from "./Modals/EditTransactionModal";
import { deleteTransactionReq } from "@/app/actions/personal/transaction";
import { TomanPriceFormatter } from "@/helpers/helpers";

type ExpenseItemProps = {
    transaction: Transaction;
    showActions?: boolean;
    setShowActions: (mode: boolean) => void;
}

const ExpenseItem = ({ transaction, showActions: editMode = false, setShowActions }: ExpenseItemProps) => {
    const { date, title, amount, description, categories } = transaction;
    const persianDate = moment(date).locale('fa').format('jYYYY/jMM/jDD'); // Convert to Persian date

    const [showEditModal, setShowEditModal] = useState(false);
    const { removeTransaction, addToast, openDialog } = useStore();

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowEditModal(true);
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowActions(false);

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

    return (
        <div className="relative p-6 border-b app_border_color last:border-b-0">
            <div className="flex justify-between items-center mb-4">
                <div>
                    <h3 className="text-xl font-semibold app_text_color mb-2">{title}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{persianDate}</p>
                    {categories && categories.length > 0 && (
                        <div className="flex gap-2 mt-2">
                            {categories.map((cat, index) => (
                                <span
                                    key={index}
                                    className="text-sm px-3 py-1.5 rounded-lg bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200"
                                >
                                    {cat.name}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-red-500 text-2xl font-bold">
                        {TomanPriceFormatter(amount.toString())}
                    </span>

                </div>
            </div>
            {description && <p className="text-base text-gray-600 dark:text-gray-400">{description}</p>}

            {showEditModal && (
                <EditTransactionModal
                    onClose={() => {
                        setShowActions(false);
                        setShowEditModal(false);
                        if (setShowActions) setShowActions(false);
                    }}
                    transaction={transaction}
                />
            )}

            {editMode && (
                <div className={`absolute bottom-0 left-0 p-6 w-fit z-10 flex gap-2`}>
                    <button
                        onClick={handleEditClick}
                        className="text-gray-500 dark:text-gray-400 hover:text-yellow-500 dark:hover:text-yellow-300 p-1"
                    >
                        <Pencil className="size-4" />
                    </button>
                    <button
                        onClick={handleDeleteClick}
                        className="text-gray-500 dark:text-gray-400 hover:text-red-600 dark:hover:text-red-400 p-1"
                    >
                        <Trash className="size-4" />
                    </button>
                </div>
            )}
        </div>
    )
}

export default ExpenseItem
