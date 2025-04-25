"use client";

import { AlertTriangle, Plus } from "lucide-react";
import Button from "@/components/Common/Button";
import { useState } from "react";
import NewSavingsGoalModal from "./Modals/NewSavingsGoalModal";
import SavingsGoals from "./SavingsGoals";
import BudgetStatusBar from "./BudgetStatusBar";
import Alerts from "./Alerts";
import Limits from "./Limits";
import UpcomingExpenses from "./UpcomingExpenses";

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
        <div className="w-72 max-h-[calc(100vh_-_5rem)] overflow-y-scroll app_bg_color h-full sticky top-20">

            <UpcomingExpenses />

            <Alerts />

            <BudgetStatusBar />

            <Limits />

            <SavingsGoals />
        </div>
    );
}