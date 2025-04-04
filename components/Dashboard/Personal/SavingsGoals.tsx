"use client";

import { Plus } from "lucide-react";
import Button from "@/components/Common/Button";
import { useState } from "react";
import NewSavingsGoalModal from "./Modals/NewSavingsGoalModal";
import useStore from "@/store/store";
import { SavingsGoal } from "@/types/personal/savings-goal-types";

// Separate component for individual savings goal
const SavingsGoalItem = ({ goal }: { goal: SavingsGoal }) => {

    const { budget } = useStore()
    const progress = (budget / goal.target_amount) * 100;

    return (
        <div className="app_bg_color p-4 rounded-lg">
            <div className="flex justify-between items-center mb-2">
                <span className="font-medium">{goal.name}</span>
                <span className="text-sm text-gray-500 dark:text-gray-400">{Math.round(progress)}٪</span>
            </div>
            <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-2">
                <div
                    className="h-2 primary_bg_color rounded-full"
                    style={{ width: `${progress}%` }}
                ></div>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-600 dark:text-gray-400">
                <span>{new Intl.NumberFormat('fa-IR').format(budget)} تومان</span>
                <span>{new Intl.NumberFormat('fa-IR').format(goal.target_amount)} تومان</span>
            </div>
        </div>
    );
};

export default function SavingsGoals() {

    const { savingsGoals } = useStore()
    const [newSavingsGoalModalVis, setNewSavingsGoalModalVis] = useState(false);

    return (
        <div className="space-y-2 border-t app_border_color pt-6">
            <div className="flex justify-between items-center px-4">
                <h3 className="text-lg font-semibold primary_text_color">اهداف پس‌انداز</h3>
                <Button
                    color="accent"
                    icon={<Plus className="size-4" />}
                    size="small"
                    text=""
                    onClick={() => setNewSavingsGoalModalVis(true)}
                />

                {newSavingsGoalModalVis && (
                    <NewSavingsGoalModal onClose={() => setNewSavingsGoalModalVis(false)} />
                )}
            </div>

            {savingsGoals.length > 0 ? (
                <div className="space-y-6">
                    {savingsGoals.map((goal, index) => (
                        <SavingsGoalItem key={index} goal={goal} />
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

