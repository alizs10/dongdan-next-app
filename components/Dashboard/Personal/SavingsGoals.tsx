"use client";

import { CheckCircleIcon, CreditCard, Crosshair, EllipsisIcon, Pencil, Plus, Trash } from "lucide-react";
import Button from "@/components/Common/Button";
import { useContext, useMemo, useState } from "react";
import NewSavingsGoalModal from "./Modals/NewSavingsGoalModal";
import EditSavingsGoalModal from "./Modals/EditSavingsGoalModal";
import useStore from "@/store/store";
import { SavingsGoal } from "@/types/personal/savings-goal-types";
import { deleteSavingsGoalReq } from "@/app/actions/personal/savings-goal";
import { PersonalContext } from "@/context/PersonalContext";

// Separate component for individual savings goal
const SavingsGoalItem = ({ goal, showActions, setShowActions }: { goal: SavingsGoal, showActions: boolean, setShowActions: (mode: boolean) => void }) => {
    const [showEditModal, setShowEditModal] = useState(false);
    const { removeSavingsGoal, addToast, openDialog, transactions } = useStore();
    const { openNewTransactionModal, setInitTransaction } = useContext(PersonalContext)

    function handleCreateTransaction() {
        setInitTransaction({
            type: 'expense',
            amount: goal.target_amount.toString(),
            date: new Date(),
            description: `خرید ${goal.name}`,
            category_ids: [],
            frequency: null,
            is_recurring: 0,
            title: goal.name,
            savings_goal_id: goal.id,
        });
        openNewTransactionModal()
    }

    const budget = useMemo(() => {

        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const currentBalance = totalIncome - totalExpenses;


        return currentBalance >= 0 ? currentBalance : 0;

    }, [transactions])

    const progress = Math.min((budget / goal.target_amount) * 100, 100);
    const isReached = goal.status;
    const isgGoalReachable = progress >= 100 && !isReached;
    const handleEditClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowEditModal(true);
    };

    const handleDeleteClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setShowActions(false);

        openDialog(
            "حذف هدف پس‌انداز",
            `آیا از حذف هدف پس‌انداز "${goal.name}" اطمینان دارید؟`,
            {
                ok: {
                    text: "حذف",
                    onClick: async () => {
                        try {
                            const response = await deleteSavingsGoalReq({
                                id: goal.id
                            });

                            if (response.success) {
                                removeSavingsGoal(goal.id);
                                addToast({
                                    message: response.message,
                                    type: 'success',
                                });
                            } else {
                                addToast({
                                    message: response.message,
                                    type: 'danger',
                                });
                            }
                        } catch (error) {
                            console.error('Error deleting savings goal:', error);
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
        <div className="app_bg_color p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{goal.name}</span>
                <div className="flex items-center">
                    {(!goal.status && showActions) ? (
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
                        <div className="flex flex-row gap-x-2 items-center">
                            {isgGoalReachable && (
                                <Button
                                    text=""
                                    size="small"
                                    onClick={handleCreateTransaction}
                                    color="success"
                                    icon={<CreditCard className="size-4" />}
                                />
                            )}
                            {isReached ? (
                                <CheckCircleIcon className="size-4 text-emerald-500" />
                            ) : (
                                <span className="text-sm text-gray-500 dark:text-gray-400">{isgGoalReachable ? "100%" : `${Math.round(progress)}٪`}</span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {!isReached ? (<>
                <div className="w-full h-2 bg-gray-200 overflow-hidden dark:bg-gray-700 rounded-full mb-2">
                    <div
                        className={`h-2 ${isgGoalReachable ? 'bg-emerald-500' : 'primary_bg_color'} rounded-full`}
                        style={{ width: `${progress}%` }}
                    ></div>
                </div>
                <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                    <span className={`${progress >= 100 ? 'text-emerald-500 dark:text-emerald-400' : ''}`}>{progress >= 100 ? "قابل خرید" : `${new Intl.NumberFormat('fa-IR').format(budget)} تومان`}</span>
                    <span>{new Intl.NumberFormat('fa-IR').format(goal.target_amount)} تومان</span>
                </div>

            </>) : (

                <div className="flex flex-row items-center justify-between">
                    <span className="text-emerald-500 dark:text-emerald-400">تکمیل شده</span>
                    <span className="text-emerald-500">{new Intl.NumberFormat('fa-IR').format(goal.target_amount)} تومان</span>
                </div>
            )}


            {(!goal.status && showEditModal) && (
                <EditSavingsGoalModal
                    onClose={() => {
                        setShowActions(false);
                        setShowEditModal(false);
                    }}
                    goal={goal}
                />
            )}
        </div>
    );
};

export default function SavingsGoals() {
    const { savingsGoals } = useStore();
    const [newSavingsGoalModalVis, setNewSavingsGoalModalVis] = useState(false);
    const [editMode, setEditMode] = useState(false);

    const toggleEditMode = () => {
        setEditMode(prevState => !prevState);
    };

    return (
        <div className="space-y-2 border-t app_border_color pt-6">
            <div className="flex justify-between items-center px-4">
                <h3 className="text-lg font-semibold primary_text_color flex items-center gap-x-2">
                    <Crosshair className="size-5" />
                    اهداف
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
                        onClick={() => setNewSavingsGoalModalVis(true)}
                    />
                </div>

                {newSavingsGoalModalVis && (
                    <NewSavingsGoalModal onClose={() => setNewSavingsGoalModalVis(false)} />
                )}
            </div>

            {savingsGoals.length > 0 ? (
                <div className="space-y-6">
                    {savingsGoals.map((goal) => (
                        <SavingsGoalItem
                            key={goal.id}
                            goal={goal}
                            showActions={editMode}
                            setShowActions={setEditMode}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-6 app_bg_color rounded-lg">
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">اولین هدف پس‌انداز رو اضافه کن</p>
                </div>
            )}
        </div>
    );
}

