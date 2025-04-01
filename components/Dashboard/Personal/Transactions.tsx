"use client";

import { Plus } from "lucide-react";
import Button from "@/components/Common/Button";
import ExpenseItem from "./ExpenseItem";
import IncomeItem from "./IncomeItem";
import { useState } from "react";
import { Transaction } from "./PersonalMain";

export default function Transactions({ transactions }: { transactions: Transaction[] }) {
    const [activeFilter, setActiveFilter] = useState("all");

    transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const filteredTransactions = transactions.filter((transaction) =>
        activeFilter === "all" ? true : transaction.type === activeFilter
    );

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-8 px-6">
                <div className="flex gap-x-4">
                    <button
                        className={`px-8 py-3 rounded-lg app_border_color border transition-colors ${activeFilter === "all"
                            ? "primary_bg_color text-white hover:bg-indigo-700 dark:hover:bg-indigo-500"
                            : "app_bg_color hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                        onClick={() => setActiveFilter("all")}
                    >
                        همه
                    </button>
                    <button
                        className={`px-8 py-3 rounded-lg app_border_color border transition-colors ${activeFilter === "income"
                            ? "primary_bg_color text-white hover:bg-indigo-700 dark:hover:bg-indigo-500"
                            : "app_bg_color hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                        onClick={() => setActiveFilter("income")}
                    >
                        درآمد
                    </button>
                    <button
                        className={`px-8 py-3 rounded-lg app_border_color border transition-colors ${activeFilter === "expense"
                            ? "primary_bg_color text-white hover:bg-indigo-700 dark:hover:bg-indigo-500"
                            : "app_bg_color hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                        onClick={() => setActiveFilter("expense")}
                    >
                        هزینه
                    </button>
                </div>
                <Button
                    color="accent"
                    icon={<Plus className="size-6" />}
                    size="medium"
                    text="افزودن تراکنش جدید"
                />
            </div>
            {filteredTransactions.map((transaction, index) =>
                transaction.type === "income" ? (
                    <IncomeItem key={index} {...transaction} />
                ) : (
                    <ExpenseItem key={index} {...transaction} />
                )
            )}
        </div>
    );
}