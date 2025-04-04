"use client";

import { EllipsisIcon, Plus } from "lucide-react";
import Button from "@/components/Common/Button";
import ExpenseItem from "./ExpenseItem";
import IncomeItem from "./IncomeItem";
import { useState } from "react";
import NewTransactionModal from "./Modals/NewTransactionsModal";
import { Transaction } from "@/types/personal/transaction-types";
import useStore from "@/store/store";

export default function Transactions() {

    const { transactions } = useStore()

    const [newTransactionModalVis, setNewTransactionModalVis] = useState(false)
    const [editMode, setEditMode] = useState(false);

    const [activeFilter, setActiveFilter] = useState("all");

    transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    const filteredTransactions = transactions.filter((transaction) =>
        activeFilter === "all" ? true : transaction.type === activeFilter
    );

    const toggleEditMode = () => {
        setEditMode(prevState => !prevState);
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center px-6">
                <div className="flex gap-x-2">
                    <button
                        className={`px-4 py-2 rounded-md app_border_color border transition-colors ${activeFilter === "all"
                            ? "primary_bg_color text-white hover:bg-indigo-700 dark:hover:bg-indigo-500"
                            : "app_bg_color hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                        onClick={() => setActiveFilter("all")}
                    >
                        همه
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md app_border_color border transition-colors ${activeFilter === "income"
                            ? "primary_bg_color text-white hover:bg-indigo-700 dark:hover:bg-indigo-500"
                            : "app_bg_color hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                        onClick={() => setActiveFilter("income")}
                    >
                        درآمد
                    </button>
                    <button
                        className={`px-4 py-2 rounded-md app_border_color border transition-colors ${activeFilter === "expense"
                            ? "primary_bg_color text-white hover:bg-indigo-700 dark:hover:bg-indigo-500"
                            : "app_bg_color hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                        onClick={() => setActiveFilter("expense")}
                    >
                        هزینه
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <button
                        onClick={toggleEditMode}
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
                        <EllipsisIcon className="size-5" />
                    </button>
                    <Button
                        color="accent"
                        icon={<Plus className="size-6" />}
                        size="medium"
                        text="افزودن تراکنش جدید"
                        onClick={() => setNewTransactionModalVis(true)}
                    />
                </div>

                {newTransactionModalVis && <NewTransactionModal onClose={() => setNewTransactionModalVis(false)} />}
            </div>
            {filteredTransactions.length > 0 ? (
                filteredTransactions.map((transaction, index) =>
                    transaction.type === "income" ? (
                        <IncomeItem key={index} transaction={transaction} showActions={editMode} setShowActions={setEditMode} />
                    ) : (
                        <ExpenseItem key={index} transaction={transaction} showActions={editMode} setShowActions={setEditMode} />
                    )
                )
            ) : (
                <div className="text-center py-12 app_bg_color rounded-lg">
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">اولین تراکنش رو اضافه کن</p>
                </div>
            )}
        </div>
    );
}