'use client'

import { useEffect, useState } from 'react';
import useStore from '@/store/store';
import { TomanPriceFormatter } from '@/helpers/helpers';
import { LeafIcon } from 'lucide-react';

interface BudgetStatusBarProps {
    className?: string;
}

const BudgetStatusBar = ({ className = '' }: BudgetStatusBarProps) => {
    const { transactions } = useStore();
    const [income, setIncome] = useState(0);
    const [expenses, setExpenses] = useState(0);
    const [balance, setBalance] = useState(0);
    const [percentage, setPercentage] = useState(50); // Default at center (0)

    useEffect(() => {
        // Calculate total income and expenses
        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);

        const totalExpenses = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);

        const currentBalance = totalIncome - totalExpenses;

        setIncome(totalIncome);
        setExpenses(totalExpenses);
        setBalance(currentBalance);

        // Calculate percentage for the status bar
        // If income and expenses are both 0, keep at 50%
        if (totalIncome === 0 && totalExpenses === 0) {
            setPercentage(50);
        } else if (currentBalance >= 0) {
            // Positive balance - move right from center
            const maxValue = Math.max(totalIncome, totalExpenses * 2);
            const calculatedPercentage = 50 + (currentBalance / maxValue) * 50;
            setPercentage(Math.min(calculatedPercentage, 100));
        } else {
            // Negative balance - move left from center
            const maxValue = Math.max(totalExpenses, totalIncome * 2);
            const calculatedPercentage = 50 - (Math.abs(currentBalance) / maxValue) * 50;
            setPercentage(Math.max(calculatedPercentage, 0));
        }
    }, [transactions]);

    return (
        <div className={`w-full border-t app_border_color py-6 px-4 app_bg_color rounded-lg ${className}`}>
            <div className="flex flex-row items-center  mb-3 gap-x-2 primary_text_color">
                <LeafIcon className='size-5' />
                <h2 className="text-lg font-semibold">وضعیت بودجه</h2>
            </div>
            {/* <div className="flex flex-col gap-y-2 mb-2">
                <div className="text-red-500 dark:text-red-400 text-sm">
                    هزینه‌ها: {TomanPriceFormatter(expenses.toString())} تومان
                </div>
                <div className="text-emerald-600 dark:text-emerald-400 text-sm">
                    درآمدها: {TomanPriceFormatter(income.toString())} تومان
                </div>
            </div> */}

            <div className="relative">
                {/* Center line */}
                <div className="absolute -top-1 -bottom-1 left-1/2 w-0.5 bg-black dark:bg-white z-10"></div>

                {/* Pointer */}
                <div
                    className="absolute top-0 bottom-0 h-2 bg-black shadow-[0_0_4px_2px_rgba(0,0,0,0.35)] aspect-square rounded-full z-20 transform -translate-x-1/2 translate-y-1/2"
                    style={{ left: `${percentage}%` }}
                ></div>

                <div className="relative h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                    {/* Status indicator */}
                    <div
                        className="absolute top-0 bottom-0 bg-gradient-to-r from-red-500 via-gray-300 to-emerald-400"
                        style={{ width: '100%' }}
                    ></div>
                </div>
            </div>

            <div className="mt-3">
                <span className={`font-semibold text-base ${balance >= 0 ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500 dark:text-red-400'}`}>
                    {balance >= 0 ? 'مانده: ' : 'کسری: '}
                    {TomanPriceFormatter(Math.abs(balance).toString())} تومان
                </span>
            </div>
        </div>
    );
};

export default BudgetStatusBar;
