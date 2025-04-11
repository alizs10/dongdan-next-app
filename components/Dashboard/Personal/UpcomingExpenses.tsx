import React, { useMemo } from 'react'
import useStore from "@/store/store"
import { Transaction } from "@/types/personal/transaction-types"
import moment from "jalali-moment"
import { CalendarArrowUpIcon } from 'lucide-react'

export default function UpcomingExpenses() {
    const { transactions } = useStore()

    // Get recurring expenses and calculate their next occurrence
    const upcomingExpenses = useMemo(() => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)

        // Filter recurring expenses
        const recurringExpenses = transactions.filter(transaction =>
            transaction.type === 'expense' &&
            transaction.is_recurring &&
            transaction.frequency
        )

        // Calculate next occurrence for each recurring expense
        const expensesWithNextDate = recurringExpenses.map(expense => {
            const lastDate = new Date(expense.date)
            let nextDate = new Date(lastDate)

            // Calculate next occurrence based on frequency
            switch (expense.frequency) {
                case 'daily':
                    nextDate.setDate(nextDate.getDate() + 1)
                    break
                case 'weekly':
                    nextDate.setDate(nextDate.getDate() + 7)
                    break
                case 'monthly':
                    nextDate.setMonth(nextDate.getMonth() + 1)
                    break
                case 'yearly':
                    nextDate.setFullYear(nextDate.getFullYear() + 1)
                    break
                default:
                    // If frequency is not recognized, use the original date
                    nextDate = lastDate
            }

            // If the calculated next date is in the past, calculate the next occurrence
            while (nextDate < today) {
                switch (expense.frequency) {
                    case 'daily':
                        nextDate.setDate(nextDate.getDate() + 1)
                        break
                    case 'weekly':
                        nextDate.setDate(nextDate.getDate() + 7)
                        break
                    case 'monthly':
                        nextDate.setMonth(nextDate.getMonth() + 1)
                        break
                    case 'yearly':
                        nextDate.setFullYear(nextDate.getFullYear() + 1)
                        break
                }
            }

            return {
                ...expense,
                nextDate
            }
        })

        // Sort by next occurrence date and limit to 5
        return expensesWithNextDate
            .sort((a, b) => a.nextDate.getTime() - b.nextDate.getTime())
            .slice(0, 5)
    }, [transactions])

    return (
        <div className="mb-6">
            <h3 className="text-lg font-semibold primary_text_color px-4 pt-4 mb-4 flex items-center">
                <CalendarArrowUpIcon className="w-5 h-5 ml-2" />
                صورتحساب‌های آتی
            </h3>

            {upcomingExpenses.length > 0 ? (
                <ul className="space-y-2">
                    {upcomingExpenses.map(expense => (
                        <li key={expense.id} className="flex justify-between items-center px-4">
                            <span>{expense.title}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">
                                {moment(expense.nextDate).locale('fa').format('jDD jMMMM')}
                            </span>
                        </li>
                    ))}
                </ul>
            ) : (
                <p className="text-center text-gray-500 dark:text-gray-400 px-4 py-2">
                    هیچ صورتحساب آتی وجود ندارد
                </p>
            )}
        </div>
    )
} 