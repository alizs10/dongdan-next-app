"use client";

import { AlignJustify, BanknoteArrowDownIcon, BanknoteArrowUpIcon, EllipsisIcon, Plus } from "lucide-react";
import Button from "@/components/Common/Button";
import { useContext, useState } from "react";
import NewTransactionModal from "./Modals/NewTransactionsModal";
import useStore from "@/store/store";
import TransactionItem from "./TransactionItem";
import { PersonalContext } from "@/context/PersonalContext";

export default function Transactions() {

    const { transactionsForView, activeFilters, setActiveFilters } = useStore()

    const { newTransactionModalVis, openNewTransactionModal } = useContext(PersonalContext)

    transactionsForView.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    // Calculate transaction counts
    const transactionsCount = transactionsForView.length;
    const incomesCount = transactionsForView.filter(transaction => transaction.type === 'income').length;
    const expensesCount = transactionsForView.filter(transaction => transaction.type === 'expense').length;


    return (
        <div className="">
            <div className="flex justify-between items-center px-6">
                <div className="flex gap-x-2">
                    <button
                        className={`px-4 py-2 flex flex-row items-center gap-x-2 rounded-md app_border_color border transition-colors ${activeFilters?.type === "all"
                            ? "primary_bg_color text-white hover:bg-indigo-700 dark:hover:bg-indigo-500"
                            : "app_bg_color hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                        onClick={() => setActiveFilters({ ...activeFilters, type: "all" })}
                    >
                        <AlignJustify className="size-5" />
                        همه
                        <span>{`(${transactionsCount})`}</span>
                    </button>
                    <button
                        className={`px-4 py-2 flex flex-row items-center gap-x-2 rounded-md app_border_color border transition-colors ${activeFilters?.type === "expense"
                            ? "primary_bg_color text-white hover:bg-indigo-700 dark:hover:bg-indigo-500"
                            : "app_bg_color hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                        onClick={() => setActiveFilters({ ...activeFilters, type: "expense" })}
                    >
                        <BanknoteArrowDownIcon className="size-5" />
                        هزینه
                        <span>{`(${expensesCount})`}</span>
                    </button>
                    <button
                        className={`px-4 py-2 flex flex-row items-center gap-x-2 rounded-md app_border_color border transition-colors ${activeFilters?.type === "income"
                            ? "primary_bg_color text-white hover:bg-indigo-700 dark:hover:bg-indigo-500"
                            : "app_bg_color hover:bg-gray-100 dark:hover:bg-gray-700"
                            }`}
                        onClick={() => setActiveFilters({ ...activeFilters, type: "income" })}
                    >
                        <BanknoteArrowUpIcon className="size-5" />
                        درآمد
                        <span>{`(${incomesCount})`}</span>
                    </button>
                </div>
                <div className="flex items-center gap-2">
                    <Button
                        color="accent"
                        icon={<Plus className="size-6" />}
                        size="medium"
                        text="افزودن تراکنش جدید"
                        onClick={openNewTransactionModal}
                    />
                </div>

                {newTransactionModalVis && <NewTransactionModal />}
            </div>
            {transactionsForView.length > 0 ? (
                <div className="mt-6">
                    {transactionsForView.map((transaction, index) => (
                        <TransactionItem
                            key={transaction.id}
                            transaction={transaction}
                            index={index}
                        // showActions={editMode}
                        // setShowActions={setEditMode}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 app_bg_color rounded-lg">
                    <p className="text-lg text-gray-600 dark:text-gray-400 mb-4">اولین تراکنش رو اضافه کن</p>
                </div>
            )}
        </div>
    );
}