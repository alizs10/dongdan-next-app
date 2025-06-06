"use client";

import { CreditCard, CreditCardIcon, Crosshair, EllipsisIcon, GaugeIcon, Pencil, Plus, Trash, TriangleAlertIcon } from "lucide-react";
import Button from "@/components/Common/Button";
import { useState } from "react";
import useStore from "@/store/store";
import { BudgetLimit } from "@/types/personal/limit-types";
import { Category } from "@/types/personal/category-types";
import NewBudgetLimitModal from "./Modals/NewBudgetLimitModal";
import EditBudgetLimitModal from "./Modals/EditBudgetLimitModal";
import { deleteBudgetLimitReq } from '@/app/actions/personal/budget-limit';
import moment from 'jalali-moment';

// Separate component for individual budget limit
const BudgetLimitItem = ({ limit, category, showActions, setShowActions }: {
    limit: BudgetLimit,
    category: Category,
    showActions: boolean,
    setShowActions: (mode: boolean) => void
}) => {
    const [showEditModal, setShowEditModal] = useState(false);
    const { removeBudgetLimit, addToast, openDialog, transactions } = useStore();

    // Calculate current amount based on period using Persian calendar
    const calculateCurrentAmount = () => {
        const now = moment();
        let startDate = moment();

        switch (limit.period) {
            case 'weekly':
                startDate = now.clone().startOf('week');
                break;
            case 'monthly':
                startDate = now.clone().startOf('jMonth');
                break;
            case 'yearly':
                startDate = now.clone().startOf('jYear');
                break;
        }

        return transactions
            .filter(t => {
                const isExpense = t.type === 'expense';
                const hasCategory = t.categories?.some(c => c.id === category.id);
                // Parse ISO date and convert to Jalali
                const transactionDate = moment(t.date, 'YYYY-MM-DDTHH:mm:ss.SSSSSSZ').locale('fa');
                const isInRange = transactionDate.isSameOrAfter(startDate) && transactionDate.isSameOrBefore(now);

                return isExpense && hasCategory && isInRange;
            })
            .reduce((sum, t) => sum + t.amount, 0);
    };

    const currentAmount = calculateCurrentAmount();
    const progress = Math.min((currentAmount / limit.amount) * 100, 100);
    const isLimitReached = progress >= 100;

    // Determine progress bar and percentage text color based on progress
    const getProgressColor = () => {
        if (progress < 33) return 'bg-green-500 text-green-500';
        if (progress < 50) return 'bg-yellow-400 text-yellow-400';
        if (progress < 67) return 'bg-orange-500 text-orange-500';
        return 'bg-red-500 text-red-500';
    };

    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowEditModal(true);
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowActions(false);

        openDialog(
            "حذف محدودیت بودجه",
            `آیا از حذف محدودیت بودجه برای "${category.name}" اطمینان دارید؟`,
            {
                ok: {
                    text: "حذف",
                    onClick: async () => {
                        try {
                            const result = await deleteBudgetLimitReq({
                                id: limit.id,
                            });

                            if (result.success) {
                                removeBudgetLimit(limit.id);
                                addToast({
                                    message: result.message,
                                    type: 'success',
                                });
                            } else {
                                addToast({
                                    message: result.message,
                                    type: 'danger',
                                });
                            }
                        } catch (error) {
                            console.error('Error deleting budget limit:', error);
                            addToast({
                                message: 'خطای سرور',
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

    const getPeriodText = (period: string) => {
        switch (period) {
            case 'weekly': return 'هفتگی';
            case 'monthly': return 'ماهانه';
            case 'yearly': return 'سالانه';
            default: return period;
        }
    };

    return (
        <div className="app_bg_color p-4 rounded-lg">
            <div className="flex justify-between items-start mb-2">
                <div className="flex justify-between w-full">
                    <div className="flex flex-col">
                        <span className="font-medium">{limit.name}</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{category.name}</span>
                    </div>
                    <div className="flex items-center">
                        {showActions ? (
                            <div className="flex gap-2">
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
                        ) : (
                            <div className="flex flex-col items-end">
                                <span className={`font-medium ${getProgressColor().split(' ')[1]}`}>
                                    {Math.round(progress)}%
                                </span>
                                <span className="text-sm text-gray-500 dark:text-gray-400">{getPeriodText(limit.period)}</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="mb-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div
                    className={`h-2 ${getProgressColor().split(' ')[0]} rounded-full`}
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                <span className={`${progress >= 100 ? 'text-red-500 dark:text-red-400' : ''}`}>
                    {progress >= 100 ? "محدودیت رسیده" : `${new Intl.NumberFormat('fa-IR').format(currentAmount)} تومان`}
                </span>
                <span>{new Intl.NumberFormat('fa-IR').format(limit.amount)} تومان</span>
            </div>

            {showEditModal && (
                <EditBudgetLimitModal
                    onClose={() => {
                        setShowActions(false);
                        setShowEditModal(false);
                    }}
                    limit={limit}
                />
            )}
        </div>
    );
};

export default function Limits() {
    const { budgetLimits, categories } = useStore();
    const [newLimitModalVis, setNewLimitModalVis] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const toggleEditMode = () => {
        setEditMode(prevState => !prevState);
    };

    return (
        <div className="space-y-2 border-t app_border_color pt-6">
            <div className="flex justify-between items-center px-4">
                <h3 className="text-lg font-semibold primary_text_color flex items-center gap-x-2">
                    <GaugeIcon className="size-5" />
                    محدودیت‌ها
                </h3>
                <div className="flex flex-row items-center gap-x-2">
                    <button
                        onClick={toggleEditMode}
                        className="text-gray-500">
                        <EllipsisIcon className="size-4" />
                    </button>
                    <Button
                        color="accent"
                        icon={<Plus className="size-4" />}
                        size="small"
                        text=""
                        onClick={() => setNewLimitModalVis(true)}
                    />
                </div>

                {newLimitModalVis && (
                    <NewBudgetLimitModal onClose={() => setNewLimitModalVis(false)} />
                )}
            </div>

            {budgetLimits.length > 0 ? (
                <div className="space-y-6">
                    {budgetLimits.map((limit) => {
                        let category = categories.find(c => c.id === limit.category_id);
                        if (!category) {
                            category = {
                                id: 0,
                                name: 'همه دسته‌بندی‌ها',
                                created_at: new Date(),
                                updated_at: new Date(),
                            }
                        };
                        return (
                            <BudgetLimitItem
                                key={limit.id}
                                limit={limit}
                                category={category}
                                showActions={editMode}
                                setShowActions={setEditMode}
                            />
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-6 app_bg_color rounded-lg">
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">اولین محدودیت بودجه رو اضافه کن</p>
                </div>
            )}
        </div>
    );
}