"use client";

import { AlertTriangle, Plus } from "lucide-react";
import Button from "@/components/Common/Button";
import { useState } from "react";
import NewSavingsGoalModal from "./Modals/NewSavingsGoalModal";
import SavingsGoals from "./SavingsGoals";
import BudgetStatusBar from "./BudgetStatusBar";
import Alerts from "./Alerts";
import Limits from "./Limits";

export default function RightSidebar() {

    const [newSavingsGoalModalVis, setNewSavingsGoalModalVis] = useState(false)


    // Initial savings goal as an example
    const [savingsGoals, setSavingsGoals] = useState([
        {
            name: "لپ‌تاپ جدید",
            current: 25000000, // Current progress in IRR
            target: 50000000,  // Target amount in IRR
        },
    ]);

    const addSavingsGoal = () => {
        // Placeholder for adding a new goal - could trigger a form or modal later
        const newGoal = {
            name: "هدف جدید",
            current: 0,
            target: 10000000, // Default target, adjustable later
        };
        setSavingsGoals([...savingsGoals, newGoal]);
    };

    return (
        <div className="w-72 app_bg_color h-full sticky top-20">
            <div className="mb-6">
                <h3 className="text-lg font-semibold primary_text_color px-4 pt-4 mb-4">صورتحساب‌های آتی</h3>
                <ul className="space-y-2">
                    <li className="flex justify-between items-center px-4">
                        <span>اجاره خانه</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">۱۱ اسفند</span>
                    </li>
                    <li className="flex justify-between items-center px-4">
                        <span>هزینه اینترنت</span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">۹ اسفند</span>
                    </li>
                </ul>
            </div>
            <Alerts />

            <BudgetStatusBar />

            <Limits />

            <SavingsGoals />
        </div>
    );
}